from rest_framework import serializers
from .models import Order, OrderItem, OrderItemModifier

class OrderItemModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemModifier
        fields = ['id', 'modifier', 'precio_extra']

class OrderItemSerializer(serializers.ModelSerializer):
    selected_modifiers = OrderItemModifierSerializer(many=True, read_only=True)
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'cantidad', 'precio_unitario', 'notas', 'selected_modifiers']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    class Meta:
        model = Order
        fields = ['id', 'numero_orden', 'total', 'estado', 'metodo_pago', 'notas', 'created_at', 'items']

        