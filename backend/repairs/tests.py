from django.contrib.auth import get_user_model
from django.utils.timezone import now
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Revenue
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RevenueAPITest(APITestCase):
    
    def setUp(self):    
        self.operations_user = User.objects.create_user(username="operations", password="test123", role="operations")
        self.normal_user = User.objects.create_user(username="user", password="test123", role="user")
        refresh = RefreshToken.for_user(self.operations_user)
        self.operations_token = str(refresh.access_token)
        refresh = RefreshToken.for_user(self.normal_user)
        self.user_token = str(refresh.access_token)
        self.revenue = Revenue.objects.create(date=now().date(), total_revenue=1000)

    def test_revenue_access_by_operations_user(self):
        """Operations user should be able to access revenue data"""
        
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.operations_token}')
        response = self.client.get("/api/graph/revenue/") 
        print("Response Status:", response.status_code)
        print("Response Content:", response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


    def test_revenue_access_by_normal_user(self):
        """Normal user should be denied access to revenue data"""
        
        self.client.credentials(HTTP_AUTHORIZATION = f'Bearer {self.user_token}')
        response = self.client.get("/api/graph/revenue/") 
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) 

    def test_unauthenticated_user_access(self):
        """Unauthenticated users should not access revenue API"""
        
        response = self.client.get("/api/graph/revenue/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED) 

