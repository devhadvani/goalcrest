# goalcrest/celery.py
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "goalcrest.settings")

app = Celery("goalcrest")

app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


@app.task(bind=True)
def debug_task(self):
    print("Request: {0!r}".format(self.request))


app.conf.beat_schedule = {
    'add-recurring-income-daily-midnight': {
        'task': 'finance.tasks.add_recurring_income',
        'schedule': crontab(hour=0, minute=0),  
    },
}