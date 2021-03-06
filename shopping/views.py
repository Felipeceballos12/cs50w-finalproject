import json
from django.db.models.aggregates import Count
from django.http.response import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect

from django.contrib.auth import authenticate, get_permission_codename, login, logout
from django.views.decorators.csrf import csrf_exempt
from django.urls import reverse
from django.contrib import messages
from .models import Order, User, Product, Category, OrderDetails
from django.db import IntegrityError
from django import forms
from django.contrib.auth.decorators import login_required
import random

# Create your views here.


def index(request):
    print(request.user)
    return render(request, "shopping/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in (CS50)
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

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
            # Save a user
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
    products = Product.objects.filter(
        gender=gender).filter(category=category_products.id)

    if not products:
        return render(request, "shopping/view_products.html", {
            "message_alert": "Not in stock."
        })

    return render(request, "shopping/view_products.html", {
        "products": products
    })


def product(request, product_id):

    product = Product.objects.get(id=product_id)
    other_products = Product.objects.filter(
        gender=product.gender).order_by('?')[0:2]

    return render(request, "shopping/view_product.html", {
        "product": product,
        "other_products": other_products,
    })


class NewProductsForm(forms.Form):
    title = forms.CharField(label="Title:", widget=forms.TextInput(
        attrs={'class': 'inputCreateProducts'}))
    img = forms.CharField(label="Imagen:", widget=forms.TextInput(
        attrs={'class': 'inputCreateProducts'}))
    category = forms.ModelChoiceField(queryset=Category.objects.all(
    ), widget=forms.Select(attrs={'class': 'inputCreateProducts'}))
    price = forms.DecimalField(label="Price:", widget=forms.NumberInput(
        attrs={'class': 'inputCreateProducts'}))
    description = forms.CharField(widget=forms.Textarea(
        attrs={'class': 'inputCreateProducts', 'rows': '2'}))
    amount = forms.IntegerField(widget=forms.NumberInput(
        attrs={'class': 'inputCreateProducts'}))
    gender = forms.CharField(widget=forms.TextInput(
        attrs={'class': 'inputCreateProducts'}))


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
                save_product = Product(title=Title, description=Description, price=Price,
                                       created_by=Created_by, category=Category, gender=Gender, amount=Amount, img_url=Img)
                save_product.save()

                return HttpResponseRedirect(reverse("adminSection"))
        else:
            return render(request, "shopping/admin.html", {
                "formProduct": NewProductsForm()
            })
    else:
        return HttpResponseRedirect(reverse("index"))


@login_required(login_url='login')
def cart(request):
    return render(request, "shopping/cart.html")


def search(request):
    if 'q' in request.GET:
        if request.GET["q"] != '':
            name_search = request.GET['q']
            content_search = Product.objects.filter(
                title__icontains=name_search)
            if content_search:
                return render(request, "shopping/search.html", {
                    "display_btn_search": True,
                    "productsFound": content_search,
                    "name_search": name_search
                })
            else:
                return render(request, "shopping/search.html", {
                    "display_btn_search": True,
                    "no_found": "No search results found",
                    "name_search": name_search
                })
        else:
            return HttpResponseRedirect(reverse("search"))
    else:
        return render(request, "shopping/search.html", {
            "display_btn_search": True
        })


@csrf_exempt
@login_required
def order(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data_received = json.loads(request.body)
    products = [product.strip()
                for product in data_received.get("products").split(",")]
    amount_products = [amount.strip() for amount in data_received.get(
        "amount_products").split(",")]
    if products == [""] and amount_products == [""]:
        return JsonResponse({
            "error": "At least one product required."
        }, status=400)

    status = data_received.get("status", "")
    amount_to_pay = data_received.get("amount_pay", "")
    user = User.objects.get(email=request.user)
    addres_user = user.address

    order = Order(
        status=status,
        user_id=request.user,
        address=addres_user,
        amount_pay=amount_to_pay
    )

    order.save()

    for x in range(0, len(products)):

        # Update amount of products
        product = Product.objects.get(pk=products[x])
        product.amount -= int(amount_products[x])
        product.save()

        order_details = OrderDetails(
            order_id=Order.objects.get(pk=order.id),
            product_id=Product.objects.get(pk=product.id),
            amount_products=amount_products[x]
        )

        order_details.save()

    return JsonResponse({"message": "Hemos recibido el objecto"}, status=201)


@login_required(login_url='login')
def orderDetails(request):

    order = Order.objects.filter(user_id=request.user).last()
    order_details = OrderDetails.objects.filter(order_id=order.id)

    return render(request, "shopping/order.html", {
        "order": order,
        "orderDetails": order_details,
    })


@login_required(login_url="login")
def profile(request):
    return render(request, "shopping/profile.html")


@login_required(login_url="login")
def personal_info(request):
    return render(request, "shopping/personal_details.html")


def update_personal_info(request):

    if request.method == "POST":

        email = request.POST["email"]
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        cedula = request.POST["cedula"]
        phone_number = request.POST["phone_number"]
        address = request.POST["address"]
        city = request.POST["city"]
        country = request.POST["country"]

        user_info = User.objects.get(username=request.user)

        user_info.username = email
        user_info.email = email
        user_info.first_name = first_name
        user_info.last_name = last_name
        user_info.cedula = cedula
        user_info.phone_number = phone_number
        user_info.address = address
        user_info.city = city
        user_info.country = country

        user_info.save()

    return HttpResponseRedirect(reverse("personal_info"))


def invoice(request):

    orders = Order.objects.filter(user_id=request.user).order_by("-created_at")

    order_details_list = []

    def dicProductsDetails(order_detail):
        products_details = {
            "title": order_detail.product_id.title,
            "amount_product": order_detail.amount_products,
            "order_id": order_detail.order_id.id
        }

        return products_details

    for order in range(0, len(orders)):
        order_details = OrderDetails.objects.filter(order_id=orders[order].id)

        for order_detail in order_details:
            # Add products_details to order_details_list
            order_details_list.append(dicProductsDetails(order_detail))

    return render(request, "shopping/invoice.html", {
        "orders": orders,
        "orders_details": order_details_list
    })
