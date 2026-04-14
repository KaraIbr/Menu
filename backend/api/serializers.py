from decimal import Decimal
from django.db import transaction
from rest_framework import serializers

from .models import (
    Category,
    Product,
    ModifierGroup,
    Modifier,
    Order,
    OrderItem,
    OrderItemModifier,
)


class ModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modifier
        fields = ('id', 'nombre', 'precio_extra')


class ModifierGroupSerializer(serializers.ModelSerializer):
    modifiers = ModifierSerializer(many=True, read_only=True)

    class Meta:
        model = ModifierGroup
        fields = ('id', 'nombre', 'requerido', 'min_select', 'max_select', 'modifiers')


class ProductSerializer(serializers.ModelSerializer):
    modifier_groups = ModifierGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'nombre', 'descripcion', 'precio_base', 'imagen', 'activo',
            'disponible', 'modifier_groups'
        )


class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'nombre', 'descripcion', 'products')


class OrderItemModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemModifier
        fields = ('id', 'modifier', 'nombre', 'precio_extra')


class ProductSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ('id', 'nombre')


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSummarySerializer(read_only=True)
    selected_modifiers = OrderItemModifierSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = (
            'id', 'product', 'product_name', 'cantidad', 'notas',
            'precio_unitario', 'subtotal', 'selected_modifiers'
        )


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'numero_orden', 'estado', 'metodo_pago', 'notas',
            'total', 'created_at', 'items'
        )


class OrderItemCreateSerializer(serializers.Serializer):
    product = serializers.IntegerField()
    cantidad = serializers.IntegerField(min_value=1, default=1)
    notas = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    selected_modifiers = serializers.ListField(child=serializers.DictField(), required=False)


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'numero_orden', 'metodo_pago', 'notas', 'items',
            'estado', 'total', 'created_at'
        )
        read_only_fields = ('id', 'numero_orden', 'estado', 'total', 'created_at')

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError('Debes agregar al menos un producto.')
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        with transaction.atomic():
            order = Order.objects.create(**validated_data)
            total = Decimal('0')

            for item_data in items_data:
                product_id = item_data.get('product')
                try:
                    product = Product.objects.get(id=product_id, activo=True, disponible=True)
                except Product.DoesNotExist:
                    raise serializers.ValidationError(f'Producto {product_id} no esta disponible')

                cantidad = item_data.get('cantidad', 1)
                selected_modifiers_data = item_data.get('selected_modifiers', []) or []
                modifier_ids = [m.get('modifier') for m in selected_modifiers_data if m.get('modifier')]

                modifiers_qs = Modifier.objects.filter(
                    id__in=modifier_ids,
                    group__product=product,
                    activo=True,
                ).select_related('group')

                if len(modifier_ids) != modifiers_qs.count():
                    raise serializers.ValidationError('Uno o mas modificadores no son validos para este producto.')

                selected_by_group = {}
                for mod in modifiers_qs:
                    selected_by_group.setdefault(mod.group_id, []).append(mod)

                for group in product.modifier_groups.filter(activo=True):
                    selected_for_group = selected_by_group.get(group.id, [])
                    if group.requerido and len(selected_for_group) < group.min_select:
                        raise serializers.ValidationError(
                            f'El grupo "{group.nombre}" requiere al menos {group.min_select} opcion(es).'
                        )
                    if len(selected_for_group) > group.max_select:
                        raise serializers.ValidationError(
                            f'El grupo "{group.nombre}" solo permite hasta {group.max_select} opcion(es).'
                        )

                item_price = Decimal(product.precio_base)
                for mod in modifiers_qs:
                    item_price += Decimal(mod.precio_extra)

                subtotal = item_price * Decimal(cantidad)
                order_item = OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.nombre,
                    cantidad=cantidad,
                    notas=item_data.get('notas') or '',
                    precio_unitario=item_price,
                    subtotal=subtotal,
                )

                for mod in modifiers_qs:
                    OrderItemModifier.objects.create(
                        order_item=order_item,
                        modifier=mod,
                        nombre=mod.nombre,
                        precio_extra=mod.precio_extra,
                    )

                total += subtotal

            order.total = total
            order.save()

        return order
