from django.db.models.aggregates import Count
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

from django.contrib.auth import authenticate, get_permission_codename, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.contrib import messages
from .models import User, Product, Category
from django.db import IntegrityError
from django import forms
from django.contrib.auth.decorators import login_required
import random

# Create your views here.

def index(request):
    return render(request, "shopping/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in (CS50)
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)
        print(user)
        # Check if authenticate successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "shopping/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "shopping/login.html") 

def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))   

def register(request):
    if request.method == "POST":

        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        cedula = request.POST["cedula"]
        phone_number = request.POST["phone_number"]
        address = request.POST["address"]
        city = request.POST["city"]
        country = request.POST["country"]

        # Password Matches password_confirmation?
        password = request.POST["password"]
        password_confirmation = request.POST["password_confirmation"]

        if password != password_confirmation:
            return render(request, "shopping/register.html", {
                "message": "Password must match"
            })

        try:
            user = User.objects.create_user(email, email, password)
            user.first_name = first_name
            user.last_name = last_name
            user.cedula = cedula
            user.phone_number = phone_number
            user.address = address
            user.city = city
            user.country = country
            #Save a user
            user.save()
        except IntegrityError:
            return render(request, "shopping/register.html", {
                "message": "Email already taken"
            })        
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "shopping/register.html")


def products(request, gender, category):

    category_products = Category.objects.get(name=category)
    products = Product.objects.filter(gender=gender).filter(category=category_products.id)

    if not products:
        return render(request, "shopping/view_products.html", {
            "message_alert": "Not in stock."
        })

    return render(request, "shopping/view_products.html", {
        "products": products
    })

def product(request, product_id):

    product = Product.objects.get(id=product_id)
    other_products = Product.objects.filter(gender=product.gender)[0:2]

    if request.user.is_authenticated:
        in_cart_product = product.in_cart(request.user)
    else:
        in_cart_product = False
   
    return render(request, "shopping/view_product.html", {
        "product": product,
        "other_products": other_products,
        "in_cart_product": in_cart_product,
        "isProduct": False
    })

class NewProductsForm(forms.Form):
    title = forms.CharField(label="Title:", widget=forms.TextInput(attrs={'class': 'inputCreateProducts'}))
    img = forms.CharField(label="Imagen:", widget=forms.TextInput(attrs={'class': 'inputCreateProducts'}))
    category = forms.ModelChoiceField(queryset=Category.objects.all(), widget=forms.Select(attrs={'class': 'inputCreateProducts'}))
    price = forms.DecimalField(label="Price:", widget=forms.NumberInput(attrs={'class': 'inputCreateProducts'}))
    description = forms.CharField(widget=forms.Textarea(attrs={'class': 'inputCreateProducts', 'rows': '2'}))
    amount = forms.IntegerField(widget=forms.NumberInput(attrs={'class': 'inputCreateProducts'}))
    gender = forms.CharField(widget=forms.TextInput(attrs={'class': 'inputCreateProducts'}))


@login_required(login_url='index')
def adminSection(request):
    is_admin = User.objects.filter(username=request.user).filter(isAdmin=True)
    
    if is_admin:
        if request.method == "POST":
            create_product = NewProductsForm(request.POST)

            if create_product.is_valid():

                # Cleaned_data
                Title = create_product.cleaned_data["title"]
                Img = create_product.cleaned_data["img"]
                Category = create_product.cleaned_data["category"]
                Price = create_product.cleaned_data["price"]
                Description = create_product.cleaned_data["description"]
                Amount = create_product.cleaned_data["amount"]
                Gender = create_product.cleaned_data["gender"]
                Created_by = request.user

                # saving the datas in db
                save_product = Product(title=Title, description=Description, price=Price, created_by=Created_by, category=Category, gender=Gender, amount=Amount, img_url=Img)
                save_product.save()

                return HttpResponseRedirect(reverse("adminSection"))
        else:    
            return render(request, "shopping/admin.html", {
                "formProduct": NewProductsForm()
            })
    else:
        return HttpResponseRedirect(reverse("index"))       

def cart(request):

    if request.user.is_authenticated:    
        products = request.user.cart.all()
    else:
        products = False

    return render(request, "shopping/cart.html", {
        "product_carts": products
    })
    

@login_required(login_url='register')
def add_cart(request, product_id, url_id):
    
    if request.method == "POST":

        product = Product.objects.get(id=product_id)
        customer = User.objects.get(username=request.user)

        if not product.in_cart(request.user):
            customer.cart.add(product) 

        return HttpResponseRedirect(reverse("product", args=(url_id,)))    