from django.db import models
from menu.models import Product, Modifier

class Order(models.Model):
    ESTADOS = [
        ('pendiente', 'Pendiente'), 
        ('preparando', 'Preparando'),
        ('listo', 'Listo'), 
        ('entregado', 'Entregado'), 
        ('cancelado', 'Cancelado')
    ]
    METODOS = [('efectivo', 'Efectivo'), ('tarjeta', 'Tarjeta'), ('qr', 'QR')]

    numero_orden = models.PositiveIntegerField(blank=True, null=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    metodo_pago = models.CharField(max_length=20, choices=METODOS)
    notas = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.numero_orden:
            self.numero_orden = self.id
            super().save(update_fields=['numero_orden'])
            
    def __str__(self):
        return f"Orden #{self.numero_orden} - {self.estado}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(max_digits=8, decimal_places=2)
    notas = models.TextField(blank=True, null=True)

class OrderItemModifier(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='selected_modifiers')
    modifier = models.ForeignKey(Modifier, on_delete=models.PROTECT)
    precio_extra = models.DecimalField(max_digits=6, decimal_places=2)