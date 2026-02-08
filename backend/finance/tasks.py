from celery import shared_task
from django.utils import timezone
from finance.models import Installment, History

@shared_task
def auto_pay_installments():
    today = timezone.now().date()

    installments = Installment.objects.filter(
        paid=False,
        expense__debito_automatico=True,
        payment_date__lte=today
    )

    for inst in installments:
        inst.paid = True
        inst.paid_at = today
        inst.save(update_fields=['paid', 'paid_at'])

        History.objects.create(
            user=inst.expense.user,
            action=History.ActionType.PAY,
            description=f'Parcela {inst.number} paga automaticamente'
        )