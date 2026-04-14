from decimal import Decimal
from django.db import models, transaction


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Category(TimeStampedModel):
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    orden = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ('orden', 'nombre')
        verbose_name_plural = 'Categorias'

    def __str__(self):
        return self.nombre


class Product(TimeStampedModel):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True, null=True)
    precio_base = models.DecimalField(max_digits=10, decimal_places=2)
    imagen = models.ImageField(upload_to='products/', blank=True, null=True)
    activo = models.BooleanField(default=True)
    disponible = models.BooleanField(default=True)
    destacado = models.BooleanField(default=False)

    class Meta:
        ordering = ('nombre',)

    def __str__(self):
        return self.nombre


class ModifierGroup(TimeStampedModel):
    product = models.ForeignKey(Product, related_name='modifier_groups', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=120)
    requerido = models.BooleanField(default=False)
    min_select = models.PositiveSmallIntegerField(default=0)
    max_select = models.PositiveSmallIntegerField(default=1)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ('product', 'nombre')
        verbose_name = 'Grupo de modificadores'
        verbose_name_plural = 'Grupos de modificadores'

    def __str__(self):
        return f"{self.product.nombre} - {self.nombre}"


class Modifier(TimeStampedModel):
    group = models.ForeignKey(ModifierGroup, related_name='modifiers', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=120)
    precio_extra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    activo = models.BooleanField(default=True)

    class Meta:
        ordering = ('group', 'nombre')

    def __str__(self):
        return f"{self.nombre} (+{self.precio_extra})"


class Order(TimeStampedModel):
    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        PREPARANDO = 'preparando', 'Preparando'
        LISTO = 'listo', 'Listo'
        ENTREGADO = 'entregado', 'Entregado'
        CANCELADO = 'cancelado', 'Cancelado'

    class MetodoPago(models.TextChoices):
        EFECTIVO = 'efectivo', 'Efectivo'
        TARJETA = 'tarjeta', 'Tarjeta'
        QR = 'qr', 'QR'

    numero_orden = models.PositiveIntegerField(unique=True, editable=False)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.PENDIENTE)
    metodo_pago = models.CharField(max_length=20, choices=MetodoPago.choices)
    notas = models.TextField(blank=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ('-created_at',)

    def __str__(self):
        return f"Orden #{self.numero_orden}"

    def save(self, *args, **kwargs):
        if not self.numero_orden:
            with transaction.atomic():
                last = Order.objects.select_for_update().order_by('-numero_orden').first()
                self.numero_orden = 1 if not last else last.numero_orden + 1
                super().save(*args, **kwargs)
        else:
            super().save(*args, **kwargs)


class OrderItem(TimeStampedModel):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='order_items', on_delete=models.SET_NULL, null=True, blank=True)
    product_name = models.CharField(max_length=120)
    cantidad = models.PositiveIntegerField(default=1)
    notas = models.TextField(blank=True)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ('order', 'id')
        verbose_name = 'Item de orden'
        verbose_name_plural = 'Items de orden'

    def __str__(self):
        return f"{self.cantidad}x {self.product_name} (#{self.order.numero_orden})"


class OrderItemModifier(TimeStampedModel):
    order_item = models.ForeignKey(OrderItem, related_name='selected_modifiers', on_delete=models.CASCADE)
    modifier = models.ForeignKey(Modifier, related_name='order_item_modifiers', on_delete=models.SET_NULL, null=True, blank=True)
    nombre = models.CharField(max_length=120)
    precio_extra = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ('order_item', 'id')
        verbose_name = 'Modificador seleccionado'
        verbose_name_plural = 'Modificadores seleccionados'

    def __str__(self):
        return f"{self.nombre} (+{self.precio_extra})"
