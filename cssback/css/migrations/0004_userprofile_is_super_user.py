# Generated by Django 2.1.5 on 2020-06-07 13:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('css', '0003_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='is_super_user',
            field=models.BooleanField(default=False),
        ),
    ]
