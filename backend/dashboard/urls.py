from django.urls import path
from .views import DashboardByCardTotalView, DashboardByCardView, DashboardCategoryGoalsView, DashboardCategoryTotalView, DashboardFuturePlanningView, DashboardMonthComparisonView, DashboardMonthlyEvolutionView, DashboardMonthlyRealCostFixedView, DashboardSubcategoryTotalView, DashboardSummaryView, DashboardAlertsView, DashboardGoalsView, DashboardThirdPartyGaugeView

urlpatterns = [
    path('summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('alerts/', DashboardAlertsView.as_view(), name='dashboard-alerts'),
    path('goals/', DashboardGoalsView.as_view(), name='dashboard-goals'),
    path('categories-goals/', DashboardCategoryGoalsView.as_view(), name='dashboard-categories-goals'),
    path('categories-total/', DashboardCategoryTotalView.as_view(), name='dashboard-categories-total'),
    path('by-card-total/', DashboardByCardTotalView.as_view()),
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
    path(
        'monthly-real-cost-fixed/',
        DashboardMonthlyRealCostFixedView.as_view(),
        name='dashboard-monthly-real-cost-fixed'
    ),
    path(
        'future-planning/',
        DashboardFuturePlanningView.as_view(),
        name='dashboard-future-planning'
    ),
    path(
        'subcategories-total/',
        DashboardSubcategoryTotalView.as_view(),
        name='dashboard-subcategories-total'
    ),
    path(
        'third-party-gauge/',
        DashboardThirdPartyGaugeView.as_view()
        ),
]
