from django.contrib import admin
from .models import Order, OrderItem, OrderItemModifier


class OrderItemModifierInline(admin.TabularInline):
    model = OrderItemModifier
    extra = 0
    readonly_fields = ('modifier', 'precio_extra')
    can_delete = False


class OrderItemInline(admin.StackedInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'cantidad', 'precio_unitario', 'notas')
    show_change_link = True
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('numero_orden', 'total', 'estado', 'metodo_pago', 'created_at')
    list_filter = ('estado', 'metodo_pago')
    search_fields = ('numero_orden', 'notas')
    readonly_fields = ('numero_orden', 'total', 'created_at')
    ordering = ('-created_at',)
    inlines = [OrderItemInline]
    fieldsets = (
        ('Información de la orden', {
            'fields': ('numero_orden', 'total', 'created_at')
        }),
        ('Estado y pago', {
            'fields': ('estado', 'metodo_pago', 'notas')
        }),
    )


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ('order', 'product', 'cantidad', 'precio_unitario')
    search_fields = ('product__nombre', 'order__numero_orden')
    readonly_fields = ('order', 'product', 'cantidad', 'precio_unitario')
    inlines = [OrderItemModifierInline]
