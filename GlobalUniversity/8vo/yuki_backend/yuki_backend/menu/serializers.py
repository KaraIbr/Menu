from rest_framework import serializers
from .models import Category, Product, ModifierGroup, Modifier

class ModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Modifier
        fields = ['id', 'nombre', 'precio_extra']

class ModifierGroupSerializer(serializers.ModelSerializer):
    modifiers = ModifierSerializer(many=True, read_only=True)
    class Meta:
        model = ModifierGroup
        fields = ['id', 'nombre', 'requerido', 'min_select', 'max_select', 'modifiers']

class ProductSerializer(serializers.ModelSerializer):
    modifier_groups = ModifierGroupSerializer(many=True, read_only=True)
    class Meta:
        model = Product
        fields = ['id', 'nombre', 'descripcion', 'precio_base', 'imagen', 'disponible', 'modifier_groups']

class CategorySerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    class Meta:
        model = Category
        fields = ['id', 'nombre', 'icono', 'orden', 'products']