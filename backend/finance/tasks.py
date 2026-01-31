from celery import shared_task
from django.utils import timezone
from finance.models import Installment, History

@shared_task
def auto_pay_installments():
    today = timezone.now().date()

    installments = Installment.objects.filter(
        paid=False,
        due_date__month=today.month,
        due_date__year=today.year,
        due_date__lte=today
    )

    for installment in installments:
        installment.paid = True
        installment.paid_at = today
        installment.save(update_fields=['paid', 'paid_at'])

        History.objects.create(
            user=installment.expense.user,
            action='PAY',
            description=(
                f'Parcela {installment.number} paga automaticamente '
                f'da despesa "{installment.expense.description}"'
            )
        )