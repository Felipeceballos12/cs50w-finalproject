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
    path("cart/<int:product_id>/<int:url_id>$", views.add_cart, name="add_cart"),
    path("search", views.search, name="search")
]