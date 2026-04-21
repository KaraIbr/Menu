from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet,
    ProductViewSet,
    MenuView,
    OrderCreateAPIView,
    OrderListAPIView,
    OrderDetailAPIView,
    OrderStatusUpdateAPIView,
    TestAuthView,
    PersonalLoginView,
    PersonalViewSet,
    CategoryAdminViewSet,
    ProductAdminViewSet,
    ModifierGroupAdminViewSet,
    ModifierAdminViewSet,
)

router = DefaultRouter()
router.register(r'admin/personal', PersonalViewSet, basename='personal')
router.register(r'admin/categories', CategoryAdminViewSet, basename='categories-admin')
router.register(r'admin/products', ProductAdminViewSet, basename='products-admin')
router.register(r'admin/modifier-groups', ModifierGroupAdminViewSet, basename='modifier-groups-admin')
router.register(r'admin/modifiers', ModifierAdminViewSet, basename='modifiers-admin')

urlpatterns = [
    path('test-auth/', TestAuthView.as_view(), name='test-auth'),
    path('menu/', MenuView.as_view(), name='menu'),
    path('menu/categories/', CategoryViewSet.as_view({'get': 'list'}), name='menu-categories'),
    path('menu/products/', ProductViewSet.as_view({'get': 'list'}), name='menu-products'),
    path('menu/products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='menu-product-detail'),

    path('orders/', OrderCreateAPIView.as_view(), name='orders-create'),
    path('orders/list', OrderListAPIView.as_view(), name='orders-list'),
    path('orders/list/', OrderListAPIView.as_view(), name='orders-list-slash'),
    path('orders/<int:pk>/', OrderDetailAPIView.as_view(), name='orders-detail'),
    path('orders/<int:pk>/estado/', OrderStatusUpdateAPIView.as_view(), name='orders-status'),

    path('auth/personal/login/', PersonalLoginView.as_view(), name='personal-login'),
] + router.urls
