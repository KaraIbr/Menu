from django.db import models
from apps.menu.models import Product, Modifier


class Order(models.Model):
    """Pedido completo realizado desde el kiosk."""

    ESTADO_PENDIENTE = 'pendiente'
    ESTADO_PREPARANDO = 'preparando'
    ESTADO_LISTO = 'listo'
    ESTADO_ENTREGADO = 'entregado'
    ESTADO_CANCELADO = 'cancelado'

    ESTADO_CHOICES = [
        (ESTADO_PENDIENTE, 'Pendiente'),
        (ESTADO_PREPARANDO, 'Preparando'),
        (ESTADO_LISTO, 'Listo'),
        (ESTADO_ENTREGADO, 'Entregado'),
        (ESTADO_CANCELADO, 'Cancelado'),
    ]

    PAGO_EFECTIVO = 'efectivo'
    PAGO_TARJETA = 'tarjeta'
    PAGO_QR = 'qr'

    PAGO_CHOICES = [
        (PAGO_EFECTIVO, 'Efectivo'),
        (PAGO_TARJETA, 'Tarjeta'),
        (PAGO_QR, 'QR / Transferencia'),
    ]

    numero_orden = models.PositiveIntegerField(
        verbose_name='Número de orden',
        help_text='Número visible para el cliente en pantalla'
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Total'
    )
    estado = models.CharField(
        max_length=20,
        choices=ESTADO_CHOICES,
        default=ESTADO_PENDIENTE,
        verbose_name='Estado'
    )
    metodo_pago = models.CharField(
        max_length=20,
        choices=PAGO_CHOICES,
        default=PAGO_EFECTIVO,
        verbose_name='Método de pago'
    )
    notas = models.TextField(blank=True, verbose_name='Notas generales')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Orden'
        verbose_name_plural = 'Órdenes'

    def __str__(self):
        return f'Orden #{self.numero_orden} — {self.get_estado_display()}'


class OrderItem(models.Model):
    """Línea individual dentro de un pedido."""

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Orden'
    )
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='order_items',
        verbose_name='Producto'
    )
    cantidad = models.PositiveIntegerField(default=1, verbose_name='Cantidad')
    precio_unitario = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        verbose_name='Precio unitario',
        help_text='Precio al momento de ordenar (incluye extras)'
    )
    notas = models.TextField(blank=True, verbose_name='Notas del ítem')

    class Meta:
        verbose_name = 'Ítem de orden'
        verbose_name_plural = 'Ítems de orden'

    def __str__(self):
        return f'{self.cantidad}x {self.product.nombre}'


class OrderItemModifier(models.Model):
    """Modificador seleccionado para un ítem de la orden.

    El precio_extra se guarda como snapshot para preservar
    el histórico aunque el admin lo cambie después.
    """

    order_item = models.ForeignKey(
        OrderItem,
        on_delete=models.CASCADE,
        related_name='selected_modifiers',
        verbose_name='Ítem de orden'
    )
    modifier = models.ForeignKey(
        Modifier,
        on_delete=models.PROTECT,
        verbose_name='Modificador'
    )
    precio_extra = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        verbose_name='Precio extra (snapshot)'
    )

    class Meta:
        verbose_name = 'Modificador de ítem'
        verbose_name_plural = 'Modificadores de ítem'

    def __str__(self):
        return f'{self.order_item} + {self.modifier.nombre}'
