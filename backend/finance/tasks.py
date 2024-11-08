# finance/tasks.py
from celery import shared_task
from django.utils import timezone
from .models import Income
from dateutil.relativedelta import relativedelta
import time
from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings

@shared_task
def send_email_async(subject, body, to):
    email = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=to,
    )
    
    try:
        email.send()
        return f"Email sent successfully to {to}"
    except Exception as e:
        return f"Failed to send email: {str(e)}"

@shared_task
def add_recurring_income():
    today = timezone.now().date()
    recurring_incomes = Income.objects.filter(is_recurring=True, next_occurrence=today)

    for income in recurring_incomes:
        Income.objects.create(
            user=income.user,
            amount=income.amount,
            income_source=income.income_source,
            date=today,
            is_recurring=False,  
            category=income.category,
            sub_category=income.sub_category,
            received_by=income.received_by,
            description=income.description,
            attachments=income.attachments,
        )

        if income.recurrence_interval == "daily":
            income.next_occurrence += relativedelta(days=1)
        elif income.recurrence_interval == "weekly":
            income.next_occurrence += relativedelta(weeks=1)
        elif income.recurrence_interval == "monthly":
            income.next_occurrence += relativedelta(months=1)
        elif income.recurrence_interval == "yearly":
            income.next_occurrence += relativedelta(years=1)

        income.save()


@shared_task
def add(x, y):
    print("i am working on this")
    time.sleep(15)
    return x + y