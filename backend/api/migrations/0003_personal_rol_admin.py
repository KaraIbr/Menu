from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_personal_category_tipo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personal',
            name='rol',
            field=models.CharField(
                choices=[('barista', 'Barista'), ('cocinero', 'Cocinero'), ('admin', 'Admin')],
                max_length=20,
            ),
        ),
    ]
