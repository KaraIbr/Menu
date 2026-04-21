from django import forms
from django.contrib import admin
from .models import Category, Product, ModifierGroup, Modifier, Order, OrderItem, OrderItemModifier, Personal


class PersonalAdminForm(forms.ModelForm):
    """
    Custom form that replaces the stored hashed-password field with a
    plain-text input so the Django admin can set/reset passwords cleanly.
    """
    raw_password = forms.CharField(
        label='Contraseña',
        required=False,
        widget=forms.PasswordInput(render_value=False),
        help_text='Dejar vacío para conservar la contraseña actual. Obligatorio al crear.',
    )

    class Meta:
        model = Personal
        fields = ('nombre', 'username', 'raw_password', 'rol', 'activo')

    def clean(self):
        cleaned = super().clean()
        # Require password when creating a new record
        if not self.instance.pk and not cleaned.get('raw_password'):
            self.add_error('raw_password', 'La contraseña es obligatoria al crear un usuario.')
        return cleaned

    def save(self, commit=True):
        personal = super().save(commit=False)
        raw_pw = self.cleaned_data.get('raw_password')
        if raw_pw:
            personal.set_password(raw_pw)
        if commit:
            personal.save()
        return personal


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
    form = PersonalAdminForm
    list_display = ('nombre', 'username', 'rol', 'activo', 'created_at')
    list_filter = ('rol', 'activo')
    search_fields = ('nombre', 'username')
    fieldsets = (
        (None, {
            'fields': ('nombre', 'username', 'raw_password', 'rol', 'activo'),
        }),
    )
