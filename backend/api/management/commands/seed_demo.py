from decimal import Decimal
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from api.models import Category, Product, ModifierGroup, Modifier, Personal


class Command(BaseCommand):
    help = 'Crea datos de ejemplo para el menu y usuarios de demostración.'

    def handle(self, *args, **options):
        User = get_user_model()

        barista_user, created = User.objects.get_or_create(username='barista', defaults={'is_staff': True})
        if created:
            barista_user.set_password('Barista123!')
            barista_user.save()
            self.stdout.write(self.style.SUCCESS('Usuario Django barista creado (Barista123!)'))
        else:
            self.stdout.write('Usuario Django barista ya existe')

        # Personal admin for frontend panel
        if not Personal.objects.filter(username='admin').exists():
            admin_personal = Personal(nombre='Admin', username='admin', rol='admin', activo=True)
            admin_personal.set_password('Admin123!')
            admin_personal.save()
            self.stdout.write(self.style.SUCCESS('Personal admin creado (username: admin / password: Admin123!)'))
        else:
            self.stdout.write('Personal admin ya existe')

        # Personal barista for frontend panel
        if not Personal.objects.filter(username='barista').exists():
            barista_personal = Personal(nombre='Barista Demo', username='barista', rol='barista', activo=True)
            barista_personal.set_password('Barista123!')
            barista_personal.save()
            self.stdout.write(self.style.SUCCESS('Personal barista creado (username: barista / password: Barista123!)'))
        else:
            self.stdout.write('Personal barista ya existe')

        bebidas, _ = Category.objects.get_or_create(nombre='Bebidas calientes', defaults={'orden': 1})
        frios, _ = Category.objects.get_or_create(nombre='Bebidas frias', defaults={'orden': 2})
        comida, _ = Category.objects.get_or_create(nombre='Panaderia', defaults={'orden': 3})

        latte, _ = Product.objects.get_or_create(
            category=bebidas,
            nombre='Latte',
            defaults={
                'precio_base': Decimal('45.00'),
                'descripcion': 'Espresso con leche vaporizada',
                'disponible': True,
            }
        )
        capuccino, _ = Product.objects.get_or_create(
            category=bebidas,
            nombre='Capuccino',
            defaults={
                'precio_base': Decimal('42.00'),
                'descripcion': 'Con espuma cremosa',
                'disponible': True,
            }
        )
        cold_brew, _ = Product.objects.get_or_create(
            category=frios,
            nombre='Cold Brew',
            defaults={
                'precio_base': Decimal('48.00'),
                'descripcion': 'Infusion en frio por 16 horas',
                'disponible': True,
            }
        )
        roll, _ = Product.objects.get_or_create(
            category=comida,
            nombre='Cinnamon Roll',
            defaults={
                'precio_base': Decimal('35.00'),
                'descripcion': 'Glaseado de vainilla',
                'disponible': True,
            }
        )

        tam_group, _ = ModifierGroup.objects.get_or_create(
            product=latte,
            nombre='Tamano',
            defaults={'requerido': True, 'min_select': 1, 'max_select': 1}
        )
        Modifier.objects.get_or_create(group=tam_group, nombre='Chico', defaults={'precio_extra': 0})
        Modifier.objects.get_or_create(group=tam_group, nombre='Grande', defaults={'precio_extra': 10})

        leche_group, _ = ModifierGroup.objects.get_or_create(
            product=latte,
            nombre='Tipo de leche',
            defaults={'requerido': False, 'min_select': 0, 'max_select': 2}
        )
        Modifier.objects.get_or_create(group=leche_group, nombre='Deslactosada', defaults={'precio_extra': 5})
        Modifier.objects.get_or_create(group=leche_group, nombre='Almendra', defaults={'precio_extra': 8})

        extra_shot_group, _ = ModifierGroup.objects.get_or_create(
            product=cold_brew,
            nombre='Shots extra',
            defaults={'requerido': False, 'min_select': 0, 'max_select': 2}
        )
        Modifier.objects.get_or_create(group=extra_shot_group, nombre='1 shot extra', defaults={'precio_extra': 8})
        Modifier.objects.get_or_create(group=extra_shot_group, nombre='2 shots extra', defaults={'precio_extra': 14})

        self.stdout.write(self.style.SUCCESS('Datos de ejemplo listos.'))
