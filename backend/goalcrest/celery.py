# goalcrest/celery.py
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from django.conf import settings
from celery.schedules import crontab
# from finance.tasks import add_recurring_income

# from finance import tasks
# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "goalcrest.settings")

# Create a single Celery instance
app = Celery("goalcrest")

# Load task modules from all registered Django app configs.
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# Define the debug task for testing
@app.task(bind=True)
def debug_task(self):
    print("Request: {0!r}".format(self.request))

# Set up the Celery beat schedule
app.conf.beat_schedule = {
    'add-recurring-income-daily-midnight': {
        'task': 'finance.tasks.add_recurring_income',
        'schedule': crontab(hour=0, minute=0),  # Runs every day at midnight
    },
}