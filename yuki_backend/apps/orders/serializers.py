from rest_framework import serializers
from decimal import Decimal
from .models import Order, OrderItem, OrderItemModifier
from apps.menu.models import Product, Modifier
from apps.menu.serializers import ProductListSerializer


class OrderItemModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemModifier
        fields = ('modifier', 'precio_extra')


class OrderItemModifierReadSerializer(serializers.ModelSerializer):
    modifier_nombre = serializers.CharField(source='modifier.nombre', read_only=True)

    class Meta:
        model = OrderItemModifier
        fields = ('modifier', 'modifier_nombre', 'precio_extra')


class OrderItemReadSerializer(serializers.ModelSerializer):
    product_nombre = serializers.CharField(source='product.nombre', read_only=True)
    selected_modifiers = OrderItemModifierReadSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_nombre', 'cantidad', 'precio_unitario', 'notas', 'selected_modifiers')


class OrderItemWriteSerializer(serializers.Serializer):
    """Serializer de escritura para cada ítem al crear una orden."""
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.filter(activo=True))
    cantidad = serializers.IntegerField(min_value=1)
    notas = serializers.CharField(required=False, allow_blank=True, default='')
    selected_modifiers = OrderItemModifierSerializer(many=True, required=False, default=[])


class OrderWriteSerializer(serializers.Serializer):
    """
    Serializer para crear una orden desde el kiosk.
    Valida y calcula el total en el backend.
    """
    metodo_pago = serializers.ChoiceField(choices=Order.PAGO_CHOICES)
    notas = serializers.CharField(required=False, allow_blank=True, default='')
    items = OrderItemWriteSerializer(many=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError('La orden debe tener al menos un ítem.')
        return items

    def create(self, validated_data):
        items_data = validated_data.pop('items')

        # Calcular número de orden (consecutivo)
        ultimo = Order.objects.order_by('-numero_orden').first()
        numero_orden = (ultimo.numero_orden + 1) if ultimo else 1

        # Calcular total
        total = Decimal('0.00')
        for item_data in items_data:
            product = item_data['product']
            precio_unit = product.precio_base
            for mod_data in item_data.get('selected_modifiers', []):
                precio_unit += mod_data['precio_extra']
            total += precio_unit * item_data['cantidad']

        order = Order.objects.create(
            numero_orden=numero_orden,
            total=total,
            metodo_pago=validated_data['metodo_pago'],
            notas=validated_data.get('notas', ''),
        )

        for item_data in items_data:
            product = item_data['product']
            precio_unit = product.precio_base
            for mod_data in item_data.get('selected_modifiers', []):
                precio_unit += mod_data['precio_extra']

            order_item = OrderItem.objects.create(
                order=order,
                product=product,
                cantidad=item_data['cantidad'],
                precio_unitario=precio_unit,
                notas=item_data.get('notas', ''),
            )

            for mod_data in item_data.get('selected_modifiers', []):
                OrderItemModifier.objects.create(
                    order_item=order_item,
                    modifier=mod_data['modifier'],
                    precio_extra=mod_data['precio_extra'],
                )

        return order


class OrderReadSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            'id', 'numero_orden', 'total', 'estado',
            'metodo_pago', 'notas', 'created_at', 'items'
        )


class OrderEstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('estado',)
