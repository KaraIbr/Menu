from django.urls import path
from .views import MenuView, ProductListView, ProductDetailView, CategoryListView

urlpatterns = [
    path('', MenuView.as_view(), name='menu'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
]
