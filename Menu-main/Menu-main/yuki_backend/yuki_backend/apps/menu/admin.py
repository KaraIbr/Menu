from django.contrib import admin
from .models import Category, Product, ModifierGroup, Modifier


class ModifierInline(admin.TabularInline):
    """Modificadores anidados dentro de un ModifierGroup."""
    model = Modifier
    extra = 2
    fields = ('nombre', 'precio_extra', 'activo')


class ModifierGroupInline(admin.StackedInline):
    """Grupos de modificadores anidados dentro de un Product."""
    model = ModifierGroup
    extra = 1
    fields = ('nombre', 'requerido', 'min_select', 'max_select', 'orden')
    show_change_link = True


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'orden', 'activo')
    list_editable = ('orden', 'activo')
    search_fields = ('nombre', 'descripcion')
    list_filter = ('activo',)
    ordering = ('orden', 'nombre')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'category', 'precio_base', 'disponible', 'activo')
    list_editable = ('disponible', 'activo')
    search_fields = ('nombre', 'descripcion', 'category__nombre')
    list_filter = ('activo', 'disponible', 'category')
    ordering = ('category__orden', 'nombre')
    inlines = [ModifierGroupInline]
    fieldsets = (
        ('Información básica', {
            'fields': ('category', 'nombre', 'descripcion', 'imagen')
        }),
        ('Precio y disponibilidad', {
            'fields': ('precio_base', 'disponible', 'activo')
        }),
    )


@admin.register(ModifierGroup)
class ModifierGroupAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'product', 'requerido', 'min_select', 'max_select', 'orden')
    list_filter = ('requerido',)
    search_fields = ('nombre', 'product__nombre')
    ordering = ('product__nombre', 'orden')
    inlines = [ModifierInline]


@admin.register(Modifier)
class ModifierAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'group', 'precio_extra', 'activo')
    list_editable = ('activo',)
    list_filter = ('activo', 'group__product__category')
    search_fields = ('nombre', 'group__nombre', 'group__product__nombre')
    ordering = ('group__product__nombre', 'group__nombre', 'nombre')
