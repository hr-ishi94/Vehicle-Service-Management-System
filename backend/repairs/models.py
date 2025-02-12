from django.db import models
from django.contrib.auth.models import AbstractUser,Group,Permission
from django.utils import timezone


class Custom_User(AbstractUser):
    ROLE_CHOICES =(
        ('operations','Operations User'),
        ('staff','Staff User')
    )
    role = models.CharField(max_length=20,choices=ROLE_CHOICES,default='staff')
    groups = models.ManyToManyField(Group, related_name="custom_users_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_users_permissions", blank=True)


class Component(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    image = models.ImageField(
        upload_to='components/',
        null=True,
        blank=True
        )
    created_at = models.DateTimeField(auto_now_add=True)


class Vehicle(models.Model):
    vin = models.CharField(max_length=17,unique=True)
    staff = models.ForeignKey(Custom_User,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Issue(models.Model):
    STATUS_CHOICES=[
        ('pending','Pending'),
        ('resolved','Resolved')
        ]

    vehicle = models.ForeignKey(Vehicle,on_delete=models.CASCADE,related_name='issues')
    description = models.TextField()
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

class Repair(models.Model):
    issue = models.ForeignKey(Issue,on_delete=models.CASCADE,related_name='repairs')
    component = models.ForeignKey(Component,on_delete=models.SET_NULL,null=True,blank=True)
    labor_cost = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    total_cost = models.DecimalField(max_digits=10,decimal_places=2,editable=False,default=0.00)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self,*args, **kwargs):
        if self.component:
            self.total_cost = self.component.price + self.labor_cost
        else:
            self.total_cost = self.labor_cost
        super().save(*args, **kwargs)

class Revenue(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    total_revenue = models.DecimalField(max_digits=15,decimal_places=2,default=0.00)

    @staticmethod
    def update_revenue(amount):
        revenue, created = Revenue.objects.get_or_create(date = timezone.now().date())
        revenue.total_revenue += amount
        revenue.save()


