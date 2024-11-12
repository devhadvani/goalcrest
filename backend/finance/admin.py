from django.contrib import admin
from .models import User

# Register your models here.
admin.site.register(User)
from django.contrib import admin
from .models import Income, Expense, Category, Budget, Transaction, Test

# Register the Category model without customization
admin.site.register(Category)
admin.site.register(Test)
# Register the Budget model without customization
admin.site.register(Budget)


# Customize the Income admin display
class IncomeAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "amount",
        "description",
        "date",
        "category",
        "is_recurring",
        "recurrence_interval",
        "next_occurrence",
        "created_at",
    )
    list_filter = ("user", "category", "is_recurring")
    search_fields = ("user__username", "description", "category__name")
    ordering = ("-date",)


# Register the Income model with custom admin
admin.site.register(Income, IncomeAdmin)


# Customize the Expense admin display
class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "amount",
        "description",
        "date",
        "category",
        "is_recurring",
        "recurrence_interval",
        "next_occurrence",
        "created_at",
    )
    list_filter = ("user", "category", "is_recurring")
    search_fields = ("user__username", "description", "category__name")
    ordering = ("-date",)


# Register the Expense model with custom admin
admin.site.register(Expense, ExpenseAdmin)


# Customize the Transaction admin display
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "transaction_type",
        "category",
        "amount",
        "date",
        "description",
    )
    list_filter = ("transaction_type", "category")
    search_fields = ("user__username", "category__name", "description")


# Register the Transaction model with custom admin
admin.site.register(Transaction, TransactionAdmin)
