import logging
from django.shortcuts import render

from django.http import HttpResponse


logger = logging.getLogger(__name__)


def home(request):
    logger.info("hello")
    print("hello")
    return render(request, "about.html")


from rest_framework import generics
from .models import Income, Expense, Category, Budget, Transaction
from .serializers import (
    IncomeSerializer,
    ExpenseSerializer,
    CategorySerializer,
    BudgetSerializer,
    TransactionSerializer,
)
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date


class IncomeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the logged-in user
        user = self.request.user

        # Fetch query params (e.g., date=2023-10-14)
        date_param = self.request.query_params.get("date", None)

        # Filter by user and optionally by date
        queryset = Income.objects.filter(user=user)
        if date_param:
            date = parse_date(date_param)
            if date:
                queryset = queryset.filter(date=date)

        return queryset

    def perform_create(self, serializer):
        # Assign the current logged-in user to the income
        serializer.save(user=self.request.user)


class IncomeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure the user can only access their own income entries
        return Income.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
        # Ensure the user is correctly set during update and remains unchanged
        print("i had been here")
        serializer.save(user=self.request.user)


class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get the logged-in user
        user = self.request.user

        # Fetch query params (e.g., date=2023-10-14)
        date_param = self.request.query_params.get("date", None)

        # Filter by user and optionally by date
        queryset = Expense.objects.filter(user=user)
        if date_param:
            date = parse_date(date_param)
            if date:
                queryset = queryset.filter(date=date)

        return queryset

    def perform_create(self, serializer):
        # Assign the current logged-in user to the expense
        serializer.save(user=self.request.user)


class ExpenseDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure the user can only access their own expense entries
        return Expense.objects.filter(user=self.request.user)


class CategoryListAPIView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]


class BudgetListCreateAPIView(generics.ListCreateAPIView):
    queryset = Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter budget entries for the logged-in user
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the current logged-in user to the budget
        serializer.save(user=self.request.user)


class TransactionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter transactions for the logged-in user
        return Transaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the current logged-in user to the transaction
        serializer.save(user=self.request.user)
