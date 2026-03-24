from django.urls import path
from .views import OrderCreateView, OrderListView, OrderDetailView, OrderEstadoView

urlpatterns = [
    path('', OrderCreateView.as_view(), name='order-create'),
    path('list/', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('<int:pk>/estado/', OrderEstadoView.as_view(), name='order-estado'),
]
