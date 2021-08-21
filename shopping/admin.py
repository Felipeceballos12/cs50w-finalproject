from django.contrib import admin
from .models import Category, Product, User, Order

class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'price', 'created_at', 'created_by', 'category', 'gender',  'active', 'amount', 'img_url')

admin.site.register(User)
admin.site.register(Category)
admin.site.register(Product, ProductAdmin)
admin.site.register(Order)