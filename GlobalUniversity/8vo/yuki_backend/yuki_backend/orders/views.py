from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import transaction
from .models import Order, OrderItem, OrderItemModifier
from menu.models import Product, Modifier
from .serializers import OrderSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-created_at')
    serializer_class = OrderSerializer

    def get_permissions(self):
        # Crear orden es público para el Kiosk [cite: 66]
        if self.action == 'create':
            return [AllowAny()]
        # Ver órdenes requiere login (Barista) [cite: 67]
        return [IsAuthenticated()]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        data = request.data
        orden = Order.objects.create(
            metodo_pago=data.get('metodo_pago'),
            notas=data.get('notas', '')
        )
        total_calculado = 0
        for item_data in data.get('items', []):
            producto = Product.objects.get(id=item_data['product'])
            cantidad = item_data.get('cantidad', 1)
            order_item = OrderItem.objects.create(
                order=orden, product=producto, cantidad=cantidad,
                precio_unitario=producto.precio_base
            )
            subtotal_item = producto.precio_base
            for mod_data in item_data.get('selected_modifiers', []):
                modificador = Modifier.objects.get(id=mod_data['modifier'])
                OrderItemModifier.objects.create(
                    order_item=order_item, modifier=modificador,
                    precio_extra=modificador.precio_extra
                )
                subtotal_item += modificador.precio_extra
            total_calculado += (subtotal_item * cantidad)
        orden.total = total_calculado
        orden.save()
        return Response(OrderSerializer(orden).data, status=status.HTTP_201_CREATED)
    