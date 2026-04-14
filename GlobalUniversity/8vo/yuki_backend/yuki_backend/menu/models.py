from django.db import models

class Category(models.Model):
    nombre = models.CharField(max_length=80)
    descripcion = models.TextField(blank=True, null=True)
    icono = models.CharField(max_length=50, blank=True, null=True)
    orden = models.PositiveIntegerField()
    activo = models.BooleanField(default=True)

    class Meta: 
        ordering = ['orden']
        
    def __str__(self): 
        return self.nombre

class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    nombre = models.CharField(max_length=120)
    descripcion = models.TextField(blank=True, null=True)
    precio_base = models.DecimalField(max_digits=8, decimal_places=2)
    imagen = models.ImageField(upload_to='products/', blank=True, null=True)
    disponible = models.BooleanField(default=True)
    activo = models.BooleanField(default=True)

    def __str__(self): 
        return self.nombre

class ModifierGroup(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='modifier_groups')
    nombre = models.CharField(max_length=80)
    requerido = models.BooleanField(default=False)
    min_select = models.PositiveIntegerField(default=0)
    max_select = models.PositiveIntegerField(default=1)
    orden = models.PositiveIntegerField()

    class Meta: 
        ordering = ['orden']
        
    def __str__(self): 
        return f"{self.product.nombre} - {self.nombre}"

class Modifier(models.Model):
    group = models.ForeignKey(ModifierGroup, on_delete=models.CASCADE, related_name='modifiers')
    nombre = models.CharField(max_length=80)
    precio_extra = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    activo = models.BooleanField(default=True)

    def __str__(self): 
        return self.nombre