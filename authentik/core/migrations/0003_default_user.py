# Generated by Django 3.0.6 on 2020-05-23 16:40
from os import environ

from django.apps.registry import Apps
from django.conf import settings
from django.db import migrations, models
from django.db.backends.base.schema import BaseDatabaseSchemaEditor


def create_default_user(apps: Apps, schema_editor: BaseDatabaseSchemaEditor):
    # We have to use a direct import here, otherwise we get an object manager error
    from authentik.core.models import User

    db_alias = schema_editor.connection.alias

    akadmin, _ = User.objects.using(db_alias).get_or_create(
        username="akadmin", email="root@localhost", name="authentik Default Admin"
    )
    if "TF_BUILD" in environ or "AK_ADMIN_PASS" in environ or settings.TEST:
        akadmin.set_password(environ.get("AK_ADMIN_PASS", "akadmin"), signal=False)  # noqa # nosec
    else:
        akadmin.set_unusable_password()
    akadmin.save()


class Migration(migrations.Migration):

    dependencies = [
        ("authentik_core", "0002_auto_20200523_1133"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="is_superuser",
        ),
        migrations.RemoveField(
            model_name="user",
            name="is_staff",
        ),
        migrations.RunPython(create_default_user),
        migrations.AddField(
            model_name="user",
            name="is_superuser",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="user", name="is_staff", field=models.BooleanField(default=False)
        ),
    ]
