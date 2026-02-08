import logging
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.utils.timezone import now

logger = logging.getLogger(__name__)

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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category']

    def get_queryset(self):
        return SubCategory.objects.filter(active=True).order_by('name')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]

    filterset_fields = {
        'card': ['exact'],
        'subcategory__category__id': ['exact'],
        'payment_type': ['exact'],
        'concluded': ['exact'],
        'purchase_date': ['gte', 'lte'],
    }

    def get_queryset(self):
        return (
            Expense.objects
            .filter(user=self.request.user)
            .prefetch_related('card', 'subcategory__category')
            .order_by('-purchase_date')
        )
    
    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except Exception:
            logger.exception('ERRO AO LISTAR DESPESAS')
            raise

    def perform_create(self, serializer):
        expense = serializer.save(user=self.request.user)
        if expense.installments_quantity and expense.installments_quantity > 0:
            expense.generate_installments()

    def perform_update(self, serializer):
        old = self.get_object()

        expense = serializer.save()

        fields_that_change_installments = (
            old.purchase_date != expense.purchase_date or
            old.installments_quantity != expense.installments_quantity or
            old.total_value != expense.total_value
        )
        
        if fields_that_change_installments:
            expense.installments.all().delete()
            expense.concluded = False
            expense.save()
            expense.generate_installments()

class InstallmentViewSet(ModelViewSet):
    serializer_class = InstallmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Installment.objects.filter(expense__user=self.request.user)

        expense_id = self.request.query_params.get('expense')
        if expense_id:
            qs = qs.filter(expense_id=expense_id)

        return qs

    @action(detail=True, methods=['post'])
    def unpay(self, request, pk=None):
        installment = self.get_object()

        if not installment.paid:
            return Response(
                {'detail': 'Parcela já está pendente.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        installment.paid = False
        installment.paid_at = None
        installment.save()

        expense = installment.expense
        expense.concluded = False
        expense.save()

        History.objects.create(
            user=request.user,
            action=History.ActionType.UPDATE,
            description=f'Pagamento desfeito da parcela {installment.number} da despesa "{expense.description}"'
        )

        return Response(
            {'detail': 'Pagamento desfeito com sucesso.'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        installment = self.get_object()

        if installment.paid:
            return Response(
                {'detail': 'Parcela já está paga.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        installment.paid = True
        installment.paid_at = now()
        installment.save()

        expense = installment.expense
        if not expense.installments.filter(paid=False).exists():
            expense.concluded = True
            expense.save()

        History.objects.create(
            user=request.user,
            action=History.ActionType.PAY,
            description=f'Pagamento da parcela {installment.number} da despesa "{expense.description}"'
        )

        return Response(
            {'detail': 'Pagamento realizado com sucesso.'},
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
    
