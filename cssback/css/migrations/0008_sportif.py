# Generated by Django 2.1.5 on 2020-06-08 22:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('css', '0007_auto_20200608_1329'),
    ]

    operations = [
        migrations.CreateModel(
            name='Sportif',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(default='', max_length=100)),
                ('prenom', models.CharField(default='', max_length=100)),
                ('mobile', models.CharField(default='', max_length=100)),
                ('mail', models.TextField(default='')),
                ('categorie_id', models.CharField(default='', max_length=100)),
            ],
        ),
    ]
