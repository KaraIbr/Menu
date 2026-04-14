from django.contrib import admin
from .models import Category, Product, ModifierGroup, Modifier

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'activo')
    list_editable = ('orden', 'activo')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'category', 'precio_base', 'disponible', 'activo')
    list_filter = ('category', 'disponible')

admin.site.register(ModifierGroup)
admin.site.register(Modifier)