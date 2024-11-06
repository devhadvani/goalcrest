from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from dateutil.relativedelta import relativedelta

# Create your models here.


class CustomUserManager(BaseUserManager):

    def email_validator(self, email):
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError(_("You must provide a valid email"))

    def create_user(self, first_name, last_name, email, password, **extra_fields):

        if not first_name:
            raise ValueError(_("Users must submit a first name"))

        if not last_name:
            raise ValueError(_("Users must submit a last name"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Base User: and email address is required"))

        user = self.model(
            first_name=first_name, last_name=last_name, email=email, **extra_fields
        )

        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)

        user.save()

        return user

    def create_superuser(self, first_name, last_name, email, password, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superusers must have is_superuser=True"))

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superusers must have is_staff=True"))

        if not password:
            raise ValueError(_("Superusers must have a password"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Admin User: and email address is required"))

        user = self.create_user(first_name, last_name, email, password, **extra_fields)

        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(_("First Name"), max_length=100)
    last_name = models.CharField(_("Last Name"), max_length=100)
    email = models.EmailField(_("Email Address"), max_length=254, unique=True)
    google_id = models.CharField(_("Google ID"), max_length=100, blank=True, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"


class Category(models.Model):
    """Model to define different categories for income and expenses"""

    CATEGORY_TYPES = (
        ("income", "Income"),
        ("expense", "Expense"),
    )
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CATEGORY_TYPES)

    def __str__(self):
        return self.name


class Income(models.Model):
    """Model to track income with support for fixed and variable income"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(default=timezone.now)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={"type": "income"},
    )
    is_recurring = models.BooleanField(default=False)
    recurrence_interval = models.CharField(
        max_length=20,
        choices=[("monthly", "Monthly"), ("yearly", "Yearly")],
        blank=True,
        null=True,
    )
    next_occurrence = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Automatically set the next occurrence for recurring income
        if self.is_recurring and not self.next_occurrence:
            if self.recurrence_interval == "monthly":
                self.next_occurrence = self.date + relativedelta(months=1)
            elif self.recurrence_interval == "yearly":
                self.next_occurrence = self.date + relativedelta(years=1)
        super(Income, self).save(*args, **kwargs)

    def __str__(self):
        return f"Expense {self.amount} - {self.user} - at {self.date}"


class Expense(models.Model):
    """Model to track expenses with category, recurrence, and customization"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=255, blank=True, null=True)
    date = models.DateField(default=timezone.now)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        limit_choices_to={"type": "expense"},
    )
    is_recurring = models.BooleanField(default=False)
    recurrence_interval = models.CharField(
        max_length=20,
        choices=[("weekly", "Weekly"), ("monthly", "Monthly"), ("yearly", "Yearly")],
        blank=True,
        null=True,
    )
    next_occurrence = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Automatically set the next occurrence for recurring income
        if self.is_recurring and not self.next_occurrence:
            if self.recurrence_interval == "monthly":
                self.next_occurrence = self.date + relativedelta(months=1)
            elif self.recurrence_interval == "yearly":
                self.next_occurrence = self.date + relativedelta(years=1)
        super(Expense, self).save(*args, **kwargs)

    def __str__(self):
        return f"Expense {self.amount} - {self.user} - at {date}"


class Budget(models.Model):
    """Model for users to define budgets for their income and expenses"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_from = models.DateField()
    date_to = models.DateField()

    def __str__(self):
        return f"Budget for {self.category.name} - {self.user.username}"


class Transaction(models.Model):
    """Model to log each transaction, both income and expense"""

    TRANSACTION_TYPES = (
        ("income", "Income"),
        ("expense", "Expense"),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    description = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"{self.transaction_type.capitalize()} {self.amount} - {self.user.username}"
        )


class RecurringIncome(models.Model):
    """Model to keep track of recurring income separately (for historical purposes)"""

    income = models.ForeignKey(Income, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"Recurring Income - {self.amount} on {self.date}"


class RecurringExpense(models.Model):
    """Model to keep track of recurring expenses separately"""

    expense = models.ForeignKey(Expense, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"Recurring Expense - {self.amount} on {self.date}"
