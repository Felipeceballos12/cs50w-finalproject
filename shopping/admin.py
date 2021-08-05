from django.contrib import admin
from .models import Category, OrderDetails, Product, User, Order

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Order)
admin.site.register(OrderDetails)