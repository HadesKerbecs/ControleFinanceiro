from django.urls import path
from .views import DashboardByCardView, DashboardCategoryGoalsView, DashboardMonthComparisonView, DashboardMonthlyEvolutionView, DashboardSummaryView, DashboardAlertsView, DashboardGoalsView

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('alerts/', DashboardAlertsView.as_view(), name='dashboard-alerts'),
    path('goals/', DashboardGoalsView.as_view(), name='dashboard-goals'),
    path('categories-goals/', DashboardCategoryGoalsView.as_view(), name='dashboard-categories-goals'),
    path(
        'monthly-evolution/',
        DashboardMonthlyEvolutionView.as_view(),
        name='dashboard-monthly-evolution'
    ),
    path(
        'by-card/',
        DashboardByCardView.as_view(),
        name='dashboard-by-card'
    ),
    path(
        'month-comparison/',
        DashboardMonthComparisonView.as_view(),
        name='dashboard-month-comparison'
    ),

]
