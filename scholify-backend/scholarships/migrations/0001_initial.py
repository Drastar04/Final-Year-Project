# Generated by Django 5.2.3 on 2025-06-28 19:45

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Scholarship',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('provider', models.CharField(max_length=200)),
                ('amount', models.CharField(max_length=100)),
                ('deadline', models.DateField()),
                ('description', models.TextField()),
                ('location', models.CharField(max_length=100)),
                ('level', models.CharField(max_length=100)),
                ('eligibility', models.JSONField(default=list)),
                ('requirements', models.JSONField(default=list)),
                ('benefits', models.JSONField(default=list)),
                ('application_process', models.JSONField(default=list)),
                ('application_url', models.URLField()),
                ('contact_email', models.EmailField(max_length=254)),
                ('contact_phone', models.CharField(max_length=20)),
                ('contact_website', models.URLField()),
                ('contact_address', models.TextField()),
                ('tags', models.JSONField(default=list)),
                ('is_saved', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
