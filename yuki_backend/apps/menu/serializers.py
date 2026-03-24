from rest_framework import serializers
from .models import Category, Product, ModifierGroup, Modifier


class ModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modifier
        fields = ('id', 'nombre', 'precio_extra', 'activo')


class ModifierGroupSerializer(serializers.ModelSerializer):
    modifiers = ModifierSerializer(many=True, read_only=True)

    class Meta:
        model = ModifierGroup
        fields = ('id', 'nombre', 'requerido', 'min_select', 'max_select', 'orden', 'modifiers')


class ProductSerializer(serializers.ModelSerializer):
    modifier_groups = ModifierGroupSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = (
            'id', 'nombre', 'descripcion',
            'precio_base', 'imagen',
            'disponible', 'activo',
            'modifier_groups'
        )


class ProductListSerializer(serializers.ModelSerializer):
    """Versión ligera del producto para listas (sin modifier_groups)."""

    class Meta:
        model = Product
        fields = ('id', 'nombre', 'descripcion', 'precio_base', 'imagen', 'disponible')


class CategorySerializer(serializers.ModelSerializer):
    products = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ('id', 'nombre', 'descripcion', 'icono', 'orden', 'products')

    def get_products(self, obj):
        productos_activos = obj.products.filter(activo=True)
        return ProductSerializer(productos_activos, many=True, context=self.context).data


class MenuSerializer(serializers.Serializer):
    """Serializer raíz del menú completo."""
    categories = CategorySerializer(many=True)
