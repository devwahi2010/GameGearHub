# Generated by Django 4.2 on 2025-06-25 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_chat_receiver_chat_request'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='device_images/'),
        ),
    ]
