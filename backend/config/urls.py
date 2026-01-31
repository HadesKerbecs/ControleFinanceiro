from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from accounts.views import UserViewSet
from cards.views import CardViewSet
from finance.views import (
    CategoryViewSet,
    SubCategoryViewSet,
    ExpenseViewSet,
    InstallmentViewSet,
    FixedCommitmentViewSet,
    PersonDebtViewSet,
    HistoryViewSet
)

router = DefaultRouter()

router.register(r'users', UserViewSet, basename='users')
router.register(r'cards', CardViewSet, basename='cards')

router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'subcategories', SubCategoryViewSet, basename='subcategories')
router.register(r'expenses', ExpenseViewSet, basename='expenses')
router.register(r'installments', InstallmentViewSet, basename='installments')
router.register(r'fixed-commitments', FixedCommitmentViewSet, basename='fixed-commitments')
router.register(r'person-debts', PersonDebtViewSet, basename='person-debts')
router.register(r'histories', HistoryViewSet, basename='histories')

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.urls')),

    path('api/', include(router.urls)),
    path('api/dashboard/', include('dashboard.urls')),
    path('api/', include('users.urls')),
]

