# Generated by Django 2.1.5 on 2020-06-09 19:05

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('css', '0012_sportif_categorie'),
    ]

    operations = [
        migrations.AddField(
            model_name='sportif',
            name='updated',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
