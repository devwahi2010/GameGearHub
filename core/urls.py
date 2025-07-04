from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import (
    LoginView, RegisterView, ProfileView, LogoutView,
    DeviceListCreateView, DeviceDetailView,
    CreateRentalRequestView, MyRentalsView, ManageRequestsView, ApproveRejectRentalView,
    ChatListCreateView, OwnerProfileView, AllDevicesView,
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('devices/', DeviceListCreateView.as_view(), name='device-list-create'),
    path('devices/<int:pk>/', DeviceDetailView.as_view(), name='device-detail'),

    path('rent/<int:device_id>/', CreateRentalRequestView.as_view(), name='create-rent'),
    path('my-rentals/', MyRentalsView.as_view(), name='my-rentals'),

    path('manage-requests/', ManageRequestsView.as_view(), name='manage-requests'),
    path('manage-requests/<int:pk>/<str:action>/', ApproveRejectRentalView.as_view(), name='approve-reject-action'),

    path('requests/<int:request_id>/chat/', ChatListCreateView.as_view(), name='chat'),
    path('owner/<int:owner_id>/', OwnerProfileView.as_view(), name='owner-profile'),

    path('public-devices/', AllDevicesView.as_view(), name='public-devices'),
]