# Generated by Django 2.1.5 on 2020-06-09 18:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('css', '0011_auto_20200609_1824'),
    ]

    operations = [
        migrations.AddField(
            model_name='sportif',
            name='categorie',
            field=models.CharField(default='', max_length=100),
        ),
    ]
