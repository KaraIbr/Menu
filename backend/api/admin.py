from django.contrib import admin
from .models import Category, Product, ModifierGroup, Modifier, Order, OrderItem, OrderItemModifier, Personal


class ModifierInline(admin.TabularInline):
    model = Modifier
    extra = 1


class ModifierGroupInline(admin.TabularInline):
    model = ModifierGroup
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'activo', 'orden', 'created_at')
    list_filter = ('activo',)
    search_fields = ('nombre',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'category', 'precio_base', 'activo', 'disponible')
    list_filter = ('category', 'activo', 'disponible')
    search_fields = ('nombre',)
    inlines = [ModifierGroupInline]


@admin.register(ModifierGroup)
class ModifierGroupAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'product', 'requerido', 'min_select', 'max_select')
    inlines = [ModifierInline]


@admin.register(Modifier)
class ModifierAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'group', 'precio_extra', 'activo')
    list_filter = ('group', 'activo')


class OrderItemModifierInline(admin.TabularInline):
    model = OrderItemModifier
    extra = 0


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('precio_unitario', 'subtotal')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('numero_orden', 'estado', 'metodo_pago', 'total', 'created_at')
    list_filter = ('estado', 'metodo_pago', 'created_at')
    search_fields = ('numero_orden',)
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product_name', 'cantidad', 'precio_unitario', 'subtotal')
    inlines = [OrderItemModifierInline]


@admin.register(OrderItemModifier)
class OrderItemModifierAdmin(admin.ModelAdmin):
    list_display = ('order_item', 'nombre', 'precio_extra')


@admin.register(Personal)
class PersonalAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'username', 'rol', 'activo', 'created_at')
    list_filter = ('rol', 'activo')
    search_fields = ('nombre', 'username')
    exclude = ('password',)
    
    def save_model(self, request, obj, form, change):
        if 'password' in form.cleaned_data and form.cleaned_data['password']:
            obj.set_password(form.cleaned_data['password'])
        super().save_model(request, obj, form, change)
