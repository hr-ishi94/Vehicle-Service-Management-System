from django.db import models
from django.contrib.auth.models import AbstractUser,Group,Permission
from django.utils import timezone
from django.db.models import Sum
from decimal import Decimal



class Custom_User(AbstractUser):
    ROLE_CHOICES =(
        ('operations','Operations User'),
        ('staff','Staff User')
    )
    role = models.CharField(max_length=20,choices=ROLE_CHOICES,default='staff')
    groups = models.ManyToManyField(Group, related_name="custom_users_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_users_permissions", blank=True)

    def save(self, *args, **kwargs):
        if self.pk is None or not self.password.startswith('pbkdf2_sha256$'):
            self.set_password(self.password)
        super().save(*args, **kwargs)



class Component(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    repair_price = models.DecimalField(max_digits=10,decimal_places=2,null=True,blank=True)
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    STATUS_CHOICES=[
        ('pending','Pending'),
        ('resolved','Resolved')
        ]
    vin = models.CharField(max_length=17, unique=True)
    staff = models.ForeignKey(Custom_User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    total_repair_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending' )

    def __str__(self):
        return self.vin

    def update_total_cost(self):
        self.total_repair_cost = get_vehicle_total_cost(self.id)
        self.save()


class Issue(models.Model):
    STATUS_CHOICES=[
        ('pending','Pending'),
        ('resolved','Resolved')
        ]

    vehicle = models.ForeignKey(Vehicle,on_delete=models.CASCADE,related_name='issues')
    description = models.TextField()
    status = models.CharField(max_length=20,choices=STATUS_CHOICES,default='pending')
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.description

class Revenue(models.Model):
    date = models.DateField(default=timezone.now,blank=True,null=True) 
    timestamp = models.DateTimeField(auto_now_add=True,blank=True,null=True) 
    total_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=Decimal('0.00'))

    def __str__(self):
        return f"{self.date}- {self.total_revenue}"

    @staticmethod
    def update_revenue(amount):
        amount = Decimal(str(amount))
        Revenue.objects.create(date=timezone.now().date(), total_revenue=amount)


class Repair(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
    ]

    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='repairs')
    component = models.ForeignKey(Component, on_delete=models.SET_NULL, null=True, blank=True)
    labor_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, editable=False, default=0.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.issue.description

    def save(self, *args, **kwargs):

        if self.component:
            self.total_cost = Decimal(self.component.price) + Decimal(self.labor_cost)
        else:
            self.total_cost = Decimal(self.labor_cost)
        super().save(*args, **kwargs)
        Revenue.update_revenue(self.total_cost)

        


def get_vehicle_total_cost(vehicle_id):
    total_cost = Repair.objects.filter(issue__vehicle_id=vehicle_id).aggregate(Sum('total_cost'))['total_cost__sum']
    return total_cost or 0.00

