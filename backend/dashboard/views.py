import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import date, timedelta
from users.models import Profile
from finance.models import FixedCommitment, Installment
from django.db.models.functions import TruncMonth
from decimal import Decimal, ROUND_HALF_UP

logger = logging.getLogger(__name__)


def money(v: Decimal) -> float:
    return float(v.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))


class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        installments = (
            Installment.objects
            .filter(
                expense__user=request.user,
                paid=False,
                due_date__year=today.year,
                due_date__month=today.month
            )
            .values('expense__subcategory__category__name')
            .annotate(total=Sum('value'))
        )

        labels = []
        values = []

        for item in installments:
            labels.append(item.get('expense__subcategory__category__name') or 'Outros')
            values.append(item.get('total') or Decimal('0'))

        total_gasto = sum(values, Decimal('0'))

        fixed_total = (
            FixedCommitment.objects
            .filter(user=request.user, active=True)
            .aggregate(total=Sum('value'))['total']
            or Decimal('0')
        )

        total_gasto += fixed_total

        profile = Profile.objects.get(user=request.user)
        salario_liquido = profile.salario_liquido or Decimal('0')
        limite_sugerido = profile.limite_mensal or Decimal('0')

        perc_salario = int((total_gasto / salario_liquido) * 100) if salario_liquido else 0
        perc_limite = int((total_gasto / limite_sugerido) * 100) if limite_sugerido else 0

        return Response({
            'labels': labels,
            'values': [money(v) for v in values],

            'general': {
                'used': money(total_gasto),
                'limit': money(limite_sugerido),
                'percentage': perc_limite
            },
            'salary_based': {
                'limit': money(salario_liquido),
                'used': money(total_gasto),
                'percentage': perc_salario
            },
            'limit_based': {
                'limit': money(limite_sugerido),
                'used': money(total_gasto),
                'percentage': perc_limite
            }
        })


class DashboardAlertsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        next_days = today + timedelta(days=7)

        installments_due_soon = (
            Installment.objects
            .filter(
                expense__user=request.user,
                paid=False,
                due_date__gte=today,
                due_date__lte=next_days
            )
            .select_related('expense')
        )

        due_soon = [
            {
                'description': inst.expense.description,
                'due_date': inst.due_date,
                'value': money(inst.value)
            }
            for inst in installments_due_soon
        ]

        fixed_commitments = [
            {
                'name': fc['name'],
                'value': money(fc['value'])
            }
            for fc in FixedCommitment.objects
            .filter(user=request.user, active=True)
            .values('name', 'value')
        ]

        return Response({
            'salary_percentage': 0,
            'due_soon': due_soon,
            'fixed_commitments': fixed_commitments
        })


class DashboardGoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        profile = Profile.objects.get(user=request.user)
        monthly_limit = profile.limite_mensal or Decimal('0')

        used = (
            Installment.objects
            .filter(
                expense__user=request.user,
                paid=False,
                due_date__year=today.year,
                due_date__month=today.month
            )
            .aggregate(total=Sum('value'))['total']
            or Decimal('0')
        )

        percentage = int((used / monthly_limit) * 100) if monthly_limit else 0

        return Response({
            'general': {
                'limit': money(monthly_limit),
                'used': money(used),
                'percentage': percentage
            },
            'categories': []
        })


class DashboardCategoryGoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        CATEGORY_LIMIT = Decimal('500')

        data = (
            Installment.objects
            .filter(
                expense__user=request.user,
                paid=False,
                due_date__year=today.year,
                due_date__month=today.month
            )
            .values('expense__subcategory__category__name')
            .annotate(total=Sum('value'))
        )

        result = []

        for item in data:
            used = item['total'] or Decimal('0')
            percentage = int((used / CATEGORY_LIMIT) * 100) if CATEGORY_LIMIT else 0

            result.append({
                'category': item['expense__subcategory__category__name'] or 'Outros',
                'used': money(used),
                'limit': money(CATEGORY_LIMIT),
                'percentage': percentage
            })

        return Response(result)


class DashboardMonthlyEvolutionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        start_date = today.replace(day=1) - timedelta(days=180)

        data = (
            Installment.objects
            .filter(
                expense__user=request.user,
                paid=False,
                due_date__gte=start_date,
                due_date__lte=today
            )
            .annotate(month=TruncMonth('due_date'))
            .values('month')
            .annotate(total=Sum('value'))
            .order_by('month')
        )

        return Response({
            'labels': [item['month'].strftime('%m/%Y') for item in data],
            'values': [money(item['total']) for item in data]
        })


class DashboardByCardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        data = (
            Installment.objects
            .filter(
                expense__user=request.user,
                paid=False,
                due_date__year=today.year,
                due_date__month=today.month
            )
            .values('expense__card__bank_name')
            .annotate(total=Sum('value'))
        )

        return Response({
            'labels': [
                item['expense__card__bank_name'] or 'Sem cartão'
                for item in data
            ],
            'values': [
                money(item['total'] or Decimal('0'))
                for item in data
            ]
        })


class DashboardMonthComparisonView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        current_month_start = today.replace(day=1)
        previous_month_end = current_month_start - timedelta(days=1)
        previous_month_start = previous_month_end.replace(day=1)

        def total_for_period(start, end):
            return (
                Installment.objects
                .filter(
                    expense__user=request.user,
                    paid=False,
                    due_date__gte=start,
                    due_date__lte=end
                )
                .aggregate(total=Sum('value'))['total']
                or Decimal('0')
            )

        previous_total = total_for_period(previous_month_start, previous_month_end)
        current_total = total_for_period(current_month_start, today)

        return Response({
            'labels': ['Mês anterior', 'Mês atual'],
            'values': [
                money(previous_total),
                money(current_total)
            ]
        })