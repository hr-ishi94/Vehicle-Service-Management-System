import json
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.utils.timezone import now
from django.db.models import Sum
from django.db.models.functions import TruncDay, TruncMonth, TruncYear
from .serializers import *
from .models import *
from django.contrib.auth import login, logout, authenticate
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

class IsOperationsUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and getattr(request.user, 'role', None) == 'operations'


class IsReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        print(f"User: {request.user}, Method: {request.method}")

        if not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True
        return getattr(request.user, 'role', None) == 'operations'
        

    
class ComponentListCreateView(generics.ListCreateAPIView):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsReadOnly]

class ComponentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Component.objects.all()
    serializer_class = ComponentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsReadOnly]


class VehicleListCreateView(generics.ListCreateAPIView):
    serializer_class = VehicleSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Vehicle.objects.filter(staff=self.request.user)

class VehicleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]  

class IssueListCreateView(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated] 


class IssueRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated] 

class RepairListCreateView(generics.ListCreateAPIView):
    queryset = Repair.objects.all()
    serializer_class = RepairSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]  


class RepairRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Repair.objects.all()
    serializer_class = RepairSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated] 


class RevenueListCreateView(generics.ListCreateAPIView):
    queryset = Revenue.objects.all()
    serializer_class = RevenueSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOperationsUser]  


class RevenueRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Revenue.objects.all()
    serializer_class = RevenueSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOperationsUser]

class RevenueListView(generics.ListAPIView):
    serializer_class = RevenueSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsOperationsUser]

    def get_queryset(self):
        return Revenue.objects.all()

    def list(self, request, *args, **kwargs):
        today = now().date()

        daily_revenue = Revenue.objects.filter(date=today).aggregate(Sum('total_revenue'))['total_revenue__sum'] or 0

        monthly_revenue = Revenue.objects.filter(date__month=today.month, date__year=today.year).aggregate(Sum('total_revenue'))['total_revenue__sum'] or 0

        yearly_revenue = Revenue.objects.filter(date__year=today.year).aggregate(Sum('total_revenue'))['total_revenue__sum'] or 0


        daily_trend = (
            Revenue.objects.filter(date__month=today.month, date__year=today.year)
            .annotate(day=TruncDay('timestamp'))  
            .values('day')
            .annotate(total=Sum('total_revenue'))
            .order_by('day')
        )


        monthly_trend = (
            Revenue.objects.filter(date__year=today.year)
            .annotate(month=TruncMonth('date'))
            .values('month')
            .annotate(total=Sum('total_revenue'))
            .order_by('month')
        )


        yearly_trend = (
            Revenue.objects.all()
            .annotate(year=TruncYear('date'))
            .values('year')
            .annotate(total=Sum('total_revenue'))
            .order_by('year')
        )

        return Response({
            'daily_revenue': daily_revenue,
            'monthly_revenue': monthly_revenue,
            'yearly_revenue': yearly_revenue,
            'daily_trend': list(daily_trend), 
            'monthly_trend': list(monthly_trend),
            'yearly_trend': list(yearly_trend),
        })

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(username=data.get('username'), password=data.get('password'))
        
        if user:
            login(request, user)
            print(f"Authenticated User: {user}")
            
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)
            
            role = getattr(user, 'role', None)

            if role:
                return JsonResponse({
                    'message': 'Login successful',
                    'access_token': access_token,
                    'refresh_token': refresh_token,
                    'role': role,
                    'user_id': user.id
                })
            else:
                return JsonResponse({'error': 'User role is not set'}, status=400)
        
        return JsonResponse({'error': 'Invalid credentials'}, status=400)
    
@csrf_exempt
def logout_view(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Logout successful'})