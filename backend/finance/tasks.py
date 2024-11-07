# myapp/tasks.py
from celery import shared_task
from django.utils import timezone
from .models import Income
from dateutil.relativedelta import relativedelta
import time
@shared_task
def add_recurring_income():
    today = timezone.now().date()
    # Get all incomes that are recurring and due today
    recurring_incomes = Income.objects.filter(is_recurring=True, next_occurrence=today)

    for income in recurring_incomes:
        # Create a new income record for today based on the recurring income details
        Income.objects.create(
            user=income.user,
            amount=income.amount,
            income_source=income.income_source,
            date=today,
            is_recurring=False,  # New record is not recurring, only this task creates it
            category=income.category,
            sub_category=income.sub_category,
            received_by=income.received_by,
            description=income.description,
            attachments=income.attachments,
        )
        
        # Update the next occurrence date for the original recurring income
        if income.recurrence_interval == "daily":
            income.next_occurrence += relativedelta(days=1)
        elif income.recurrence_interval == "weekly":
            income.next_occurrence += relativedelta(weeks=1)
        elif income.recurrence_interval == "monthly":
            income.next_occurrence += relativedelta(months=1)
        elif income.recurrence_interval == "yearly":
            income.next_occurrence += relativedelta(years=1)
        
        # Save the updated next_occurrence
        income.save()


@shared_task
def add(x, y):
    time.sleep(15)  # Simulate a delay
    return x + y