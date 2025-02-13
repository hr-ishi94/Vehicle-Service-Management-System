from django.urls import path
from . import views

urlpatterns = [
    
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('components/', views.ComponentListCreateView.as_view(), name='component-list-create'),
    path('components/<int:pk>/', views.ComponentRetrieveUpdateDestroyView.as_view(), name='component-detail'),
    path('vehicles/', views.VehicleListCreateView.as_view(), name='vehicle-list-create'),
    path('vehicles/<int:pk>/', views.VehicleRetrieveUpdateDestroyView.as_view(), name='vehicle-detail'),
    path('issues/', views.IssueListCreateView.as_view(), name='issue-list-create'),
    path('issues/<int:pk>/', views.IssueRetrieveUpdateDestroyView.as_view(), name='issue-detail'),
    path('repairs/', views.RepairListCreateView.as_view(), name='repair-list-create'),
    path('repairs/<int:pk>/', views.RepairRetrieveUpdateDestroyView.as_view(), name='repair-detail'),
    path('revenues/', views.RevenueListCreateView.as_view(), name='revenue-list-create'),
    path('revenues/<int:pk>/', views.RevenueRetrieveUpdateDestroyView.as_view(), name='revenue-detail'),
    path('graph/revenue/', views.RevenueListView.as_view(), name='revenue-list'),

]
