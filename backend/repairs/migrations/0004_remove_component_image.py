# Generated by Django 5.1.6 on 2025-02-13 01:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('repairs', '0003_component_repair_price'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='component',
            name='image',
        ),
    ]
