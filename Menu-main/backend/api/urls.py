from django.urls import path

from .views import (
    CategoryViewSet,
    ProductViewSet,
    MenuView,
    OrderCreateAPIView,
    OrderListAPIView,
    OrderDetailAPIView,
    OrderStatusUpdateAPIView,
)

urlpatterns = [
    path('menu/', MenuView.as_view(), name='menu'),
    path('menu/categories/', CategoryViewSet.as_view({'get': 'list'}), name='menu-categories'),
    path('menu/products/', ProductViewSet.as_view({'get': 'list'}), name='menu-products'),
    path('menu/products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='menu-product-detail'),

    path('orders/', OrderCreateAPIView.as_view(), name='orders-create'),
    path('orders/list', OrderListAPIView.as_view(), name='orders-list'),
    path('orders/list/', OrderListAPIView.as_view(), name='orders-list-slash'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='orders-detail'),
    path('orders/<int:pk>/estado/', OrderStatusUpdateAPIView.as_view(), name='orders-status'),
]
