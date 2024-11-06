from django.urls import path, include
from .views import (
    home,
    IncomeListCreateAPIView,
    IncomeDetailAPIView,
    ExpenseListCreateAPIView,
    ExpenseDetailAPIView,
    CategoryListAPIView,
    BudgetListCreateAPIView,
    TransactionListCreateAPIView,
)

urlpatterns = [
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("auth/", include("djoser.urls.jwt")),
    path("", home),
    path("incomes/", IncomeListCreateAPIView.as_view(), name="income-list-create"),
    path("incomes/<int:pk>/", IncomeDetailAPIView.as_view(), name="income-detail"),
    path("expenses/", ExpenseListCreateAPIView.as_view(), name="expense-list-create"),
    path("expenses/<int:pk>/", ExpenseDetailAPIView.as_view(), name="expense-detail"),
    path("categories/", CategoryListAPIView.as_view(), name="category-list"),
    path("budgets/", BudgetListCreateAPIView.as_view(), name="budget-list-create"),
    path(
        "transactions/",
        TransactionListCreateAPIView.as_view(),
        name="transaction-list-create",
    ),
]
