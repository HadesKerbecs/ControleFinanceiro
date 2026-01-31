from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now

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
    filter_backends = [DjangoFilterBackend]

    filterset_fields = {
        'card': ['exact'],
        'subcategory__category': ['exact'],
        'payment_type': ['exact'],
        'concluded': ['exact'],
        'purchase_date': ['gte', 'lte'],
    }

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-purchase_date')

    def perform_create(self, serializer):
        expense = serializer.save(user=self.request.user)
        expense.generate_installments()

class InstallmentViewSet(ModelViewSet):
    serializer_class = InstallmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Installment.objects.filter(expense__user=self.request.user)
    
    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        installment = self.get_object()

        if installment.paid:
            return Response(
                {'detail': 'Parcela já está paga.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        installment.paid = True
        installment.paid_at = now().date()
        installment.save()

        expense = installment.expense

        if not expense.installments.filter(paid=False).exists():
            expense.concluded = True
            expense.save()

        History.objects.create(
            user=request.user,
            action=History.ActionType.PAY,
            description=f'Parcela {installment.number} paga da despesa "{expense.description}"'
        )

        return Response(
            {'detail': 'Parcela paga com sucesso.'},
            status=status.HTTP_200_OK
        )

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