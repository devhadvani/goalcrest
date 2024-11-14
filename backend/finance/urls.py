from django.urls import path, include
from .views import (
    home,
    test_task_view,
    IncomeListCreateAPIView,
    IncomeDetailAPIView,
    ExpenseListCreateAPIView,
    ExpenseDetailAPIView,
    CategoryListAPIView,
    BudgetListCreateAPIView,
    TransactionListCreateAPIView,
    GPayTransactionUploadView
)

urlpatterns = [
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.authtoken")),
    path("auth/", include("djoser.urls.jwt")),
    path("", home),
    path("test-task/", test_task_view, name="test_task"),
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
    path('upload-transactions/', GPayTransactionUploadView.as_view(), name='upload-transactions'),
]

