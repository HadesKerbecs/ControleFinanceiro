@echo off
echo Iniciando ambiente...

start cmd /k "python manage.py runserver"
start cmd /k "celery -A config worker -l info"
start cmd /k "celery -A config beat -l info"

echo Ambiente iniciado.
