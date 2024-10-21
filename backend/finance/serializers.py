from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer
from .models import Income, Expense, Category, Budget, Transaction

User = get_user_model()

class CreateUserSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'google_id', 'profile_picture']


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'user', 'amount', 'description', 'date', 'category', 'is_recurring', 'recurrence_interval', 'next_occurrence', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user','created_at', 'updated_at', 'next_occurrence']

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'user', 'amount', 'description', 'date', 'category', 'is_recurring', 'recurrence_interval', 'next_occurrence', 'created_at', 'updated_at']
        read_only_fields = ['id','user', 'created_at', 'updated_at', 'next_occurrence']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type']

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'user', 'category', 'amount', 'date_from', 'date_to']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'user', 'transaction_type', 'category', 'amount', 'date', 'description']