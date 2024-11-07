"""this is models file"""
from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from dateutil.relativedelta import relativedelta

class CustomUserManager(BaseUserManager):
    """Manager for custom user creation with email validation."""

    def email_validator(self, email):
        """email validator"""
        try:
            validate_email(email)
        except ValidationError as exc:
            raise ValueError(_("You must provide a valid email")) from exc

    def create_user(self, first_name, last_name, email, password, **extra_fields):
        """Creates a regular user with provided details."""
        if not first_name:
            raise ValueError(_("Users must submit a first name"))
        if not last_name:
            raise ValueError(_("Users must submit a last name"))
        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Base User: an email address is required"))

        user = self.model(first_name=first_name, last_name=last_name, email=email, **extra_fields)
        user.set_password(password)
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        user.save()
        return user

    def create_superuser(self, first_name, last_name, email, password, **extra_fields):
        """Creates a superuser with all permissions."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superusers must have is_superuser=True"))
        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superusers must have is_staff=True"))

        if email:
            email = self.normalize_email(email)
            self.email_validator(email)
        else:
            raise ValueError(_("Admin User: an email address is required"))

        user = self.create_user(first_name, last_name, email, password, **extra_fields)
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model extending AbstractBaseUser."""
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

    def __str__(self):
        return self.email

    @property
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"




class Category(models.Model):
    """Defines income and expense categories."""
    CATEGORY_TYPES = (("income", "Income"), ("expense", "Expense"))
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=10, choices=CATEGORY_TYPES)

    def __str__(self):
        return self.name

class Income(models.Model):
    """Tracks user income with recurrence options."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    income_source = models.CharField(max_length=100, blank=True, null=True)  # Income Source
    date = models.DateField(default=timezone.now)
    is_recurring = models.BooleanField(default=False)
    recurrence_interval = models.CharField(
        max_length=20, choices=[("daily", "Daily"), ("weekly", "Weekly"), ("monthly", "Monthly"), ("yearly", "Yearly")],
        blank=True, null=True
    )
    end_date = models.DateField(blank=True, null=True)  # End Date for recurring income
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, limit_choices_to={"type": "income"}
    )
    sub_category = models.CharField(max_length=100, blank=True, null=True)  # Sub-Category
    received_by = models.CharField(max_length=50, blank=True, null=True)  # Received By
    description = models.TextField(blank=True, null=True)  # Notes
    attachments = models.FileField(upload_to='income_attachments/', blank=True, null=True)  # Attachments
    next_occurrence = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.is_recurring and not self.next_occurrence:
            if self.recurrence_interval == "daily":
                self.next_occurrence = self.date + relativedelta(days=1)
            elif self.recurrence_interval == "weekly":
                self.next_occurrence = self.date + relativedelta(weeks=1)
            elif self.recurrence_interval == "monthly":
                self.next_occurrence = self.date + relativedelta(months=1)
            elif self.recurrence_interval == "yearly":
                self.next_occurrence = self.date + relativedelta(years=1)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Income {self.amount} - {self.user} - on {self.date}"


class Expense(models.Model):
    """Tracks user expenses with recurrence options."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    recipient = models.CharField(max_length=100, blank=True, null=True)  # Recipient / Payee
    date = models.DateField(default=timezone.now)
    is_recurring = models.BooleanField(default=False)
    recurrence_interval = models.CharField(
        max_length=20,
        choices=[("daily", "Daily"), ("weekly", "Weekly"), ("monthly", "Monthly"), ("yearly", "Yearly")],
        blank=True, null=True
    )
    end_date = models.DateField(blank=True, null=True)  # End Date for recurring expense
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, limit_choices_to={"type": "expense"}
    )
    sub_category = models.CharField(max_length=100, blank=True, null=True)  # Sub-Category
    payment_method = models.CharField(max_length=50)  # Payment Method
    tags = models.CharField(max_length=100, blank=True, null=True)  # Tags
    description = models.TextField(blank=True, null=True)  # Notes
    attachments = models.FileField(upload_to='expense_attachments/', blank=True, null=True)  # Attachments
    next_occurrence = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.is_recurring and not self.next_occurrence:
            if self.recurrence_interval == "daily":
                self.next_occurrence = self.date + relativedelta(days=1)
            elif self.recurrence_interval == "weekly":
                self.next_occurrence = self.date + relativedelta(weeks=1)
            elif self.recurrence_interval == "monthly":
                self.next_occurrence = self.date + relativedelta(months=1)
            elif self.recurrence_interval == "yearly":
                self.next_occurrence = self.date + relativedelta(years=1)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Expense {self.amount} - {self.user} - on {self.date}"

class Budget(models.Model):
    """User-defined budgets for categories."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_from = models.DateField()
    date_to = models.DateField()

    def __str__(self):
        return f"Budget for {self.category.name} - {self.user}"


class Transaction(models.Model):
    """Logs each income or expense transaction."""
    TRANSACTION_TYPES = (("income", "Income"), ("expense", "Expense"))
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(default=timezone.now)
    description = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.transaction_type.capitalize()} {self.amount} - {self.user}"


class RecurringTransaction(models.Model):
    """Tracks individual recurring transactions instances for record-keeping."""
    income = models.ForeignKey(Income, on_delete=models.CASCADE, null=True, blank=True)
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"Recurring {'Income' if self.income else 'Expense'} - {self.amount} on {self.date}"