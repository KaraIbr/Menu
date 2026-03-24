from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import Order
from .serializers import (
    OrderWriteSerializer, OrderReadSerializer, OrderEstadoSerializer
)


class OrderCreateView(APIView):
    """
    POST /api/orders/
    Crea una nueva orden desde el kiosk. No requiere autenticación.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrderWriteSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            return Response(
                OrderReadSerializer(order).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderListView(generics.ListAPIView):
    """
    GET /api/orders/
    Lista de órdenes para el panel barista.
    Soporta filtro ?estado=pendiente
    Requiere autenticación JWT.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = OrderReadSerializer

    def get_queryset(self):
        qs = Order.objects.prefetch_related('items__selected_modifiers__modifier')
        estado = self.request.query_params.get('estado')
        if estado:
            qs = qs.filter(estado=estado)
        return qs


class OrderDetailView(generics.RetrieveAPIView):
    """
    GET /api/orders/<id>/
    Detalle de una orden. Requiere autenticación.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = OrderReadSerializer
    queryset = Order.objects.prefetch_related('items__selected_modifiers__modifier')


class OrderEstadoView(APIView):
    """
    PATCH /api/orders/<id>/estado/
    Cambia el estado de una orden. Solo el barista (autenticado) puede hacerlo.
    """
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        try:
            order = Order.objects.get(pk=pk)
        except Order.DoesNotExist:
            return Response({'error': 'Orden no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = OrderEstadoSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(OrderReadSerializer(order).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
