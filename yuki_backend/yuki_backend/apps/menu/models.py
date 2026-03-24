from django.db import models


class Category(models.Model):
    """Categoría del menú (ej: Matcha, Café, Alimentos, Toppings)."""

    nombre = models.CharField(max_length=80, verbose_name='Nombre')
    descripcion = models.TextField(blank=True, verbose_name='Descripción')
    icono = models.CharField(
        max_length=50,
        blank=True,
        verbose_name='Ícono',
        help_text='Nombre del ícono Lucide (ej: leaf, coffee, utensils)'
    )
    orden = models.PositiveIntegerField(
        default=0,
        verbose_name='Orden de aparición',
        help_text='Número menor = aparece primero en el kiosk'
    )
    activo = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        ordering = ['orden', 'nombre']
        verbose_name = 'Categoría'
        verbose_name_plural = 'Categorías'

    def __str__(self):
        return self.nombre


class Product(models.Model):
    """Producto orderable: bebida, alimento o postre."""

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name='products',
        verbose_name='Categoría'
    )
    nombre = models.CharField(max_length=120, verbose_name='Nombre')
    descripcion = models.TextField(blank=True, verbose_name='Descripción')
    precio_base = models.DecimalField(
        max_digits=8,
        decimal_places=2,
        verbose_name='Precio base'
    )
    imagen = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name='Imagen'
    )
    disponible = models.BooleanField(
        default=True,
        verbose_name='Disponible',
        help_text='Desmarca para ocultar temporalmente sin desactivar'
    )
    activo = models.BooleanField(
        default=True,
        verbose_name='Activo',
        help_text='Desactiva para eliminar del menú de forma permanente'
    )

    class Meta:
        ordering = ['category__orden', 'nombre']
        verbose_name = 'Producto'
        verbose_name_plural = 'Productos'

    def __str__(self):
        return f'{self.nombre} (${self.precio_base})'


class ModifierGroup(models.Model):
    """Grupo de opciones personalizables de un producto.

    Ejemplos:
    - 'Tipo de leche' (requerido, elige exactamente 1)
    - 'Extras'        (opcional, hasta 3)
    - 'Toppings'      (opcional, hasta 5)
    """

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='modifier_groups',
        verbose_name='Producto'
    )
    nombre = models.CharField(max_length=80, verbose_name='Nombre del grupo')
    requerido = models.BooleanField(
        default=False,
        verbose_name='Requerido',
        help_text='El cliente debe elegir al menos una opción'
    )
    min_select = models.PositiveIntegerField(
        default=0,
        verbose_name='Mínimo de selecciones'
    )
    max_select = models.PositiveIntegerField(
        default=1,
        verbose_name='Máximo de selecciones'
    )
    orden = models.PositiveIntegerField(
        default=0,
        verbose_name='Orden de aparición'
    )

    class Meta:
        ordering = ['orden', 'nombre']
        verbose_name = 'Grupo de modificadores'
        verbose_name_plural = 'Grupos de modificadores'

    def __str__(self):
        return f'{self.product.nombre} — {self.nombre}'


class Modifier(models.Model):
    """Opción individual dentro de un grupo (extra o topping)."""

    group = models.ForeignKey(
        ModifierGroup,
        on_delete=models.CASCADE,
        related_name='modifiers',
        verbose_name='Grupo'
    )
    nombre = models.CharField(max_length=80, verbose_name='Nombre')
    precio_extra = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.00,
        verbose_name='Precio extra',
        help_text='0.00 si no tiene costo adicional'
    )
    activo = models.BooleanField(default=True, verbose_name='Activo')

    class Meta:
        ordering = ['nombre']
        verbose_name = 'Modificador'
        verbose_name_plural = 'Modificadores'

    def __str__(self):
        if self.precio_extra > 0:
            return f'{self.nombre} (+${self.precio_extra})'
        return self.nombre
