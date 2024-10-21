import logging
from django.shortcuts import render

from django.http import HttpResponse


logger = logging.getLogger(__name__)

def home(request):
    logger.info("hello")
    print("hello")
    return render(request,'about.html')
from rest_framework import generics
from .models import Income, Expense, Category, Budget, Transaction
from .serializers import IncomeSerializer, ExpenseSerializer, CategorySerializer, BudgetSerializer, TransactionSerializer
from rest_framework.permissions import IsAuthenticated

class IncomeListCreateAPIView(generics.ListCreateAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter income entries for the logged-in user
        return Income.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Assign the current logged-in user to the income
        print("ser",self.request.user)
        serializer.save(user=self.request.user)

class IncomeDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure the user can only access their own income entries
        return Income.objects.filter(user=self.request.user)

class ExpenseListCreateAPIView(generics.ListCreateAPIView):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter expense entries for the logged-in user
        return Expense.objects.filter(user=self.request.user)

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
