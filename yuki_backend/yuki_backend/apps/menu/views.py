from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, filters
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import (
    MenuSerializer, CategorySerializer,
    ProductSerializer, ProductListSerializer
)


class MenuView(APIView):
    """
    GET /api/menu/
    Retorna el menú completo: categorías activas con sus productos
    y modificadores anidados.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        categories = Category.objects.filter(activo=True).prefetch_related(
            'products__modifier_groups__modifiers'
        )
        serializer = CategorySerializer(categories, many=True, context={'request': request})
        return Response({'categories': serializer.data})


class ProductListView(generics.ListAPIView):
    """
    GET /api/menu/products/
    Lista de productos con filtros opcionales:
    ?category=<id>
    ?disponible=true
    """
    permission_classes = [AllowAny]
    serializer_class = ProductListSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre', 'descripcion']

    def get_queryset(self):
        qs = Product.objects.filter(activo=True).select_related('category')
        category = self.request.query_params.get('category')
        disponible = self.request.query_params.get('disponible')
        if category:
            qs = qs.filter(category__id=category)
        if disponible is not None:
            qs = qs.filter(disponible=disponible.lower() == 'true')
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    """
    GET /api/menu/products/<id>/
    Detalle de un producto con todos sus grupos de modificadores.
    """
    permission_classes = [AllowAny]
    serializer_class = ProductSerializer
    queryset = Product.objects.filter(activo=True).prefetch_related(
        'modifier_groups__modifiers'
    )


class CategoryListView(generics.ListAPIView):
    """
    GET /api/menu/categories/
    Lista de categorías activas.
    """
    permission_classes = [AllowAny]
    serializer_class = CategorySerializer
    queryset = Category.objects.filter(activo=True)
