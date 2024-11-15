import logging
from django.shortcuts import render
from django.http import HttpResponse
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
from .serializers import GPayTransactionUploadSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
logger = logging.getLogger(__name__)

def home(request):
    logger.info("hello")
    print("hello")
    return render(request, "about.html")

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



from django.http import JsonResponse
from .tasks import add

def test_task_view(request):
    result = add.delay(4, 6)
    return JsonResponse({"task_id": result.id})

from bs4 import BeautifulSoup
from datetime import datetime
from .models import Income, Expense
from django.utils import timezone
import re


def parse_gpay_html(file_content, start_date, end_date, user, exclude_gt, exclude_lt):
    MAX_LENGTH = 100  
    print("egt", exclude_gt)
    print("elt", exclude_lt)
    

    exclude_gt = exclude_gt if exclude_gt is not None else float('inf')  # Default to infinity if not provided
    exclude_lt = exclude_lt if exclude_lt is not None else float('-inf')  # Default to negative infinity if not provided

    start_date = datetime.combine(start_date, datetime.min.time())
    end_date = datetime.combine(end_date, datetime.max.time())

    soup = BeautifulSoup(file_content, 'lxml')
    transactions = soup.find_all("div", class_="outer-cell mdl-cell mdl-cell--12-col mdl-shadow--2dp")
    date_pattern = re.compile(r'\d{1,2} \w{3,4} \d{4}, \d{2}:\d{2}:\d{2}')
    amount_pattern = re.compile(r'₹([\d,]+(\.\d{1,2})?)')

    for transaction in transactions:
        transaction_info = transaction.find("div", class_="content-cell mdl-cell mdl-cell--6-col mdl-typography--body-1")
        
        if transaction_info:
            details = transaction_info.text.strip()
            date_match = date_pattern.search(details)
            if date_match:
                date_text = date_match.group(0)
                date_text = date_text.replace("Sept", "Sep")
                try:
                    transaction_date = datetime.strptime(date_text, '%d %b %Y, %H:%M:%S')
                    print("td", transaction_date)
                    if not (start_date <= transaction_date <= end_date):
                        continue

                    # Determine transaction type
                    if "Received" in details:
                        transaction_type = "income"
                    elif "Paid" in details or "Sent" in details:
                        transaction_type = "expense"
                    else:
                        transaction_type = "unknown"

                    # Extract amount
                    amount_match = amount_pattern.search(details)
                    amount = float(amount_match.group(1).replace(',', '')) if amount_match else 0.0

                    # Extract recipient or source
                    if transaction_type == "income":
                        recipient = "Received from"
                    elif "to" in details:
                        recipient = details.split(' to ')[1].split('\n')[0].strip()
                    elif "using" in details:
                        recipient = details.split(' using ')[0].split(' ')[-1].strip()
                    else:
                        recipient = "Unknown"

                    recipient = recipient[:MAX_LENGTH]
                    description = details[:MAX_LENGTH]

                    print("amount", amount)

                    duplicate_exists = False
                    
                    # Filter transactions based on exclude_gt and exclude_lt
                    if exclude_lt <= amount <= exclude_gt:
                        if transaction_type == "income":
                            duplicate_exists = Income.objects.filter(
                                user=user,
                                amount=amount,
                                date=transaction_date,
                                income_source=recipient,
                                description=details
                            ).exists()
                            if not duplicate_exists:
                                Income.objects.create(
                                    user=user,
                                    amount=amount,
                                    date=transaction_date,
                                    income_source=recipient,
                                    description=details
                                )
                        elif transaction_type == "expense":
                            duplicate_exists = Expense.objects.filter(
                                user=user,
                                amount=amount,
                                date=transaction_date,
                                recipient=recipient,
                                description=details
                            ).exists()
                            if not duplicate_exists:
                                Expense.objects.create(
                                    user=user,
                                    amount=amount,
                                    date=transaction_date,
                                    recipient=recipient,
                                    description=details
                                )
                except ValueError:
                    continue


class GPayTransactionUploadView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = GPayTransactionUploadSerializer(data=request.data)
        if serializer.is_valid():
            file = serializer.validated_data['file']
            start_date = serializer.validated_data['start_date']
            end_date = serializer.validated_data['end_date']
            exclude_gt = serializer.validated_data.get('exclude_gt')  # Default to None if not provided
            exclude_lt = serializer.validated_data.get('exclude_lt')  # Default to None if not provided

            file_content = file.read().decode('utf-8')
            parse_gpay_html(file_content, start_date, end_date, request.user,exclude_gt,exclude_lt)

            return Response({"message": "Transactions added successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)