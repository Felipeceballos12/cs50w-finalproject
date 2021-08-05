from django.db import models
from django.db.models.base import Model
from django.db.models.deletion import CASCADE
from django.db.models.fields import CharField

# User Abstract
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    pass
    cedula = models.CharField(max_length=30)
    address = models.CharField(max_length=1000)
    country = models.CharField(max_length=30)
    city = models.CharField(max_length=30)
    phone_number = models.CharField(max_length=30)
    isAdmin = models.BooleanField(default=False)

class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.name}"

class Product(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, blank=True)
    price = models.DecimalField(decimal_places=2, max_digits=40)
    created_at = models.DateField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=CASCADE, related_name="ProductsCreate")
    category = models.ForeignKey(Category, on_delete=CASCADE, related_name="ProductsCategories")
    gender = models.CharField(max_length=8)
    active = models.BooleanField(default=True)
    amount = models.IntegerField()
    img_url = models.CharField(max_length=10000)
    cart_by = models.ManyToManyField(User, blank=True, related_name="cart")

    def __str__(self):
        return f"{self.id} - {self.title}: {self.description}, {self.price}, {self.created_at}, {self.created_by}, {self.category}, {self.gender}, {self.active}, {self.amount}"

    def in_cart(self, user_id):
        return user_id.cart.filter(pk=self.id).exists()

    def count_cart(self):
        return self.cart.all().count()        

class Order(models.Model):
    status = models.CharField(max_length=20)
    user_id = models.ForeignKey(User, on_delete=CASCADE, related_name="CustomerOrders")
    address = models.CharField(max_length=1000)
    amount_pay = models.DecimalField(decimal_places=2, max_digits=40)
    created_at = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.id}: {self.user_id}, {self.status}, {self.address}, {self.amount_pay}, {self.created_at}"

class OrderDetails(models.Model):
    product_id = models.ForeignKey(Product, on_delete=CASCADE, related_name="Orders")
    order_id = models.ForeignKey(Order, on_delete=CASCADE, related_name="ProductOrders")
    amount = models.IntegerField()

    def __str__(self):
        return f"{self.id} - {self.order_id} : {self.product_id}, {self.amount}"


    