from rest_framework import viewsets
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Vistas para categorías: Solo lectura (GET) [cite: 69]"""
    queryset = Category.objects.filter(activo=True)
    serializer_class = CategorySerializer

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """Vistas para productos: Solo lectura (GET) [cite: 69]"""
    queryset = Product.objects.filter(activo=True)
    serializer_class = ProductSerializer