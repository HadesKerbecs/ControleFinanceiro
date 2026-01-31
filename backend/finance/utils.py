from .tasks import update_installments_status

def sync_installments():
    update_installments_status.delay()