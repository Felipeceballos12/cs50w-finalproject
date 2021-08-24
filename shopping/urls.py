from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("products/<str:gender>/<str:category>", views.products, name="products"),
    path("product/<int:product_id>", views.product, name="product"),
    path("adminSection", views.adminSection, name="adminSection"),
    path("cart", views.cart, name="cart"),
    path("search", views.search, name="search"),
    path("order", views.order, name="order"),
    path("orderDetails", views.orderDetails, name="orderDetails"),
    path("user/menu", views.profile, name="profile"),
    #path("user/<str:userbox>", views.userbox, name="userbox"),
    path("user/personal-info", views.personal_info, name="personal_info"),
    path("user/invoice", views.invoice, name="invoice")
]