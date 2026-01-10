from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .models import (
    Category,
    SubCategory,
    Expense,
    Installment,
    FixedCommitment,
    PersonDebt,
    History
)

from .serializers import (
    CategorySerializer,
    SubCategorySerializer,
    ExpenseSerializer,
    InstallmentSerializer,
    FixedCommitmentSerializer,
    PersonDebtSerializer,
    HistorySerializer
)

class CategoryViewSet(ModelViewSet):
    queryset = Category.objects.filter(active=True)
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

class SubCategoryViewSet(ModelViewSet):
    serializer_class = SubCategorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SubCategory.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        expense = serializer.save(user=self.request.user)
        expense.generate_installments()

class InstallmentViewSet(ModelViewSet):
    serializer_class = InstallmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Installment.objects.filter(expense__user=self.request.user)

class FixedCommitmentViewSet(ModelViewSet):
    serializer_class = FixedCommitmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return FixedCommitment.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PersonDebtViewSet(ModelViewSet):
    serializer_class = PersonDebtSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PersonDebt.objects.filter(user=self.request.user)

class HistoryViewSet(ModelViewSet):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return History.objects.filter(user=self.request.user)