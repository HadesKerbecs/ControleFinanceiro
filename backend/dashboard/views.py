import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from datetime import date, timedelta
from users.models import Profile
from finance.models import Expense, FixedCommitment, Installment
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
            labels.append(item['expense__subcategory__category__name'] or 'Outros')
            values.append(item['total'] or Decimal('0'))

        total_gasto = sum(values, Decimal('0'))

        fixed_total = (
            FixedCommitment.objects
            .filter(user=request.user, active=True)
            .aggregate(total=Sum('value'))['total']
            or Decimal('0')
        )

        total_gasto += fixed_total

        profile = Profile.objects.filter(user=request.user).first()
        salario_liquido = profile.salario_liquido if profile else Decimal('0')
        limite_mensal = profile.limite_mensal if profile else Decimal('0')

        perc_salario = int((total_gasto / salario_liquido) * 100) if salario_liquido else 0
        perc_limite = int((total_gasto / limite_mensal) * 100) if limite_mensal else 0

        return Response({
            'labels': labels,
            'values': [money(v) for v in values],

            'general': {
                'used': money(total_gasto),
                'limit': money(limite_mensal),
                'percentage': perc_limite
            },
            'salary_based': {
                'limit': money(salario_liquido),
                'used': money(total_gasto),
                'percentage': perc_salario
            },
            'limit_based': {
                'limit': money(limite_mensal),
                'used': money(total_gasto),
                'percentage': perc_limite
            }
        })

class DashboardCategoryTotalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = (
            Installment.objects
            .filter(expense__user=request.user)
            .values('expense__subcategory__category__name')
            .annotate(total=Sum('value'))
        )

        labels = []
        values = []

        for item in data:
            labels.append(item['expense__subcategory__category__name'] or 'Outros')
            values.append(money(item['total'] or Decimal('0')))

        return Response({
            'labels': labels,
            'values': values
        })

class DashboardAlertsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
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

            due_soon = [{
                'description': i.expense.description,
                'due_date': i.due_date.strftime('%d/%m/%Y'),
                'value': money(i.value)
            } for i in installments_due_soon]

            fixed_commitments_qs = FixedCommitment.objects.filter(
                user=request.user, active=True
            )

            fixed_commitments = []
            fixed_total = Decimal('0')

            for fc in fixed_commitments_qs:
                fixed_commitments.append({
                    'name': fc.name,
                    'value': money(fc.value)
                })
                fixed_total += fc.value

            installments_month_total = (
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

            total_month = installments_month_total + fixed_total

            profile = Profile.objects.filter(user=request.user).first()
            salario = profile.salario_liquido if profile else Decimal('0')

            salary_percentage = int((total_month / salario) * 100) if salario else 0

            return Response({
                'salary_percentage': salary_percentage,
                'due_soon': due_soon,
                'fixed_commitments': fixed_commitments
            })

        except Exception:
            return Response({
                'salary_percentage': 0,
                'due_soon': [],
                'fixed_commitments': []
            })

class DashboardGoalsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        profile = Profile.objects.filter(user=request.user).first()
        monthly_limit = profile.limite_mensal if profile else Decimal('0')

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

class DashboardByCardTotalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = (
            Installment.objects
            .filter(
                expense__user=request.user,
                paid=False
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

class DashboardMonthlyRealCostFixedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()
        start_date = today.replace(day=1) - timedelta(days=365)

        # Parcelas agrupadas por mês (correto)
        installments = (
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
        )

        installments_map = {
            item['month']: item['total'] or Decimal('0')
            for item in installments
        }

        # Compromissos fixos ativos (mensal)
        fixed_monthly = (
            FixedCommitment.objects
            .filter(user=request.user, active=True)
            .aggregate(total=Sum('value'))['total']
            or Decimal('0')
        )

        labels = []
        values = []

        current = start_date.replace(day=1)

        while current <= today:
            parcel_total = installments_map.get(current, Decimal('0'))

            # 🔥 REGRA FINAL
            month_total = parcel_total + fixed_monthly

            labels.append(current.strftime('%m/%Y'))
            values.append(money(month_total))

            # próximo mês
            if current.month == 12:
                current = current.replace(year=current.year + 1, month=1)
            else:
                current = current.replace(month=current.month + 1)

        return Response({
            'labels': labels,
            'values': values
        })
    
class DashboardFuturePlanningView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            today = date.today()
            start_month = today.replace(day=1)

            last_installment = (
                Installment.objects
                .filter(
                    expense__user=request.user,
                    paid=False,
                    due_date__gte=start_month
                )
                .order_by('-due_date')
                .first()
            )

            if not last_installment:
                return Response({'labels': [], 'values': []})

            end_month = last_installment.due_date.replace(day=1)

            installments = (
                Installment.objects
                .filter(
                    expense__user=request.user,
                    paid=False,
                    due_date__gte=start_month,
                    due_date__lte=end_month
                )
                .annotate(month=TruncMonth('due_date'))
                .values('month')
                .annotate(total=Sum('value'))
            )

            installments_map = {
                i['month']: i['total'] or Decimal('0')
                for i in installments
            }

            fixed_total = (
                FixedCommitment.objects
                .filter(user=request.user, active=True)
                .aggregate(total=Sum('value'))['total']
                or Decimal('0')
            )

            labels, values = [], []
            current = start_month

            while current <= end_month:
                total = installments_map.get(current, Decimal('0')) + fixed_total
                labels.append(current.strftime('%m/%Y'))
                values.append(money(total))

                current = (
                    current.replace(year=current.year + 1, month=1)
                    if current.month == 12
                    else current.replace(month=current.month + 1)
                )

            return Response({'labels': labels, 'values': values})

        except Exception:
            return Response({'labels': [], 'values': []})

class DashboardSubcategoryTotalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = (
            Installment.objects
            .filter(expense__user=request.user)
            .values('expense__subcategory__name')
            .annotate(total=Sum('value'))
            .order_by('-total')
        )

        labels = []
        values = []

        for item in data:
            labels.append(item['expense__subcategory__name'] or 'Outros')
            values.append(money(item['total'] or Decimal('0')))

        return Response({
            'labels': labels,
            'values': values
        })

class DashboardThirdPartyGaugeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = date.today()

        # Total gasto no mês (parcelas)
        total_installments = (
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

        # Compromissos fixos
        fixed_total = (
            FixedCommitment.objects
            .filter(user=request.user, active=True)
            .aggregate(total=Sum('value'))['total']
            or Decimal('0')
        )

        total_month = total_installments + fixed_total

        # 🔥 TERCEIROS (Outros → Terceiros)
        third_party = (
            Installment.objects
            .filter(
                expense__user=request.user,
                expense__subcategory__name__iexact='Terceiros',
                expense__subcategory__category__name__iexact='Outros',
                paid=False,
                due_date__year=today.year,
                due_date__month=today.month
            )
            .aggregate(total=Sum('value'))['total']
            or Decimal('0')
        )

        # Segurança
        my_real_cost = max(total_month - third_party, Decimal('0'))

        third_party_percentage = (
            (third_party / total_month) * 100
            if total_month > 0 else Decimal('0')
        )

        my_real_percentage = (
            (my_real_cost / total_month) * 100
            if total_month > 0 else Decimal('0')
        )

        return Response({
            'total': money(total_month),

            'third_party': {
                'value': money(third_party),
                'percentage': float(third_party_percentage.quantize(Decimal('0.1')))
            },

            'my_real': {
                'value': money(my_real_cost),
                'percentage': float(my_real_percentage.quantize(Decimal('0.1')))
            }
        })
