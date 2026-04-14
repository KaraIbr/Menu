from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from menu.views import CategoryViewSet, ProductViewSet
from orders.views import OrderViewSet

# --- CONFIGURACIÓN DEL PANEL (Esto debe ir DESPUÉS del import) ---
admin.site.site_header = "YUKI - Panel de Control"
admin.site.site_title = "Portal de Administración YUKI"
admin.site.index_title = "Bienvenido a la Gestión del Sistema YUKI"

# --- RUTAS ---
router = DefaultRouter()
router.register(r'menu/categories', CategoryViewSet, basename='category')
router.register(r'menu/products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]