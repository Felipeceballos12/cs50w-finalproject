# Overview

**shopping** is an ecommerce inspired by the Zara website in which you can register or log in to search and buy clothes according to your tastes.

This website was a great challenge for me, since all the design was done in CSS without using any framework. I was able to achieve the design that I wanted and also make the website completely responsive. Also, I built the functionality of the shopping cart completely in JavaScript, which is different to anything that we have seen on the course.

# Distinctiveness and Complexity

According to the specification, my project must adhere to the following guidelines:

> Your web application must be sufficiently distinct from the other projects in this course (and, in addition, may not be based on the old CS50W Pizza project), and more complex than those. A project that appears to be an e-commerce site is strongly suspected to be indistinct from Project 2, and your README.md file should be very clear as to why it’s not. Failing that, it should not be submitted; it will be rejected.

My project is different from Commerce, and more complex than the other projects, for the following reasons:

1. The home page has a dynamic menu, built using JavaScript. When we click on one of the three images (children, woman and man) it will display the product categories depending on which image has been clicked.

2. I built shopping cart functionality from scratch using JavaScript and LocalStorage, which was a big challenge for me. The functionality works in the following way:

- When the user clicks on "Add to basket", the user is able to add items to the basket dynamically using JavaScript and LocalStorage. In LocalStorage, we store an array containing objects of each product added to the cart with all of the relevant product information. The page is updated dynamically to show the total items in the top-right corner.

- On the shopping cart page, there are buttons to increase and decrease the units of the same product. The visibility of these buttons is according to the availability of the product (saved in LocalStorage). The page is updated to reflect the changes the user makes without reloading the page.

- On the shopping cart page, the user is able to delete a product from their basket completely which deletes the product from the LocalStorage array and updates the page dynamically. The array is rearranged completely in order to not leave an empty space in the array. This was a very complex part of the build.

3. When a user processes an order, the data is passed from LocalStorage to the database using JavaScript and a POST request to the /orderdetails route.

4. The website has two user types: standard and admin. The website has a separate admin view (for users with the isAdmin flag set to true in the User model), where users can add new products to the database. This page is blocked for standard users.

5. I built the entire project using custom CSS, without Bootstrap, making mockups of the design in Adobe XD as part of my process.

> Your web application must utilize Django (including at least one model) on the back-end and JavaScript on the front-end.

My application was built using Django, including 5 models on the back-end and uses 7 different JavaScript scripts to make dynamic updates on the front-end.

> Your web application must be mobile-responsive

Every page and feature of the web application is mobile-responsive and this is achieved using just CSS.

In the following section I will explain what is in every file.

# Files and directories

- `shopping` - application main directory.
  - `models` - contains all the models used in the application.
  - `urls` - all urls used in the application.
  - `views` - contains all application views.
  - `admin` - Here the Super User was added to make use of it in models
  - `static/shopping` - Contains all static content.
    - `imgs` - images used on the homepage.
    - `javascript` - all JavaScript files in the project.
      - `activeCounterToThePages.js` - call the function "addCartCounter" into the all pages.
      - `btnMenuHeader.js` - contains the code for the menu button and the display of the links.
      - `cartStore.js` - contains all the logic for the shopping cart page.
      - `localStorageData.js` - creation of the Local Storage to add the products to the cart.
      - `product_view.js` - logic to add products to the cart and "proceed to order", when the cart is added for the first time.
      - `search.js` - small change in the background color of the header and padding bottom.
      - `util.js` - function that is used in most scripts.
    - `style.css` - CSS files.
  - `template/shopping` - all application templates.
    - `admin.html` - page to add new clothing products, although only admin users have access to the page.
    - `cart.html` - page of the products added to the cart.
    - `index.html` - home page
    - `invoice.html` - page where all the purchases made by the user are shown.
    - `layout.html` - layout page used in all other pages.
    - `login.html` - page to start session, if you have an account
    - `order.html` - page where the user can buy the products.
    - `personal_details.html` - page where user information can be modified.
    - `profile.html` - page that opens the Invoice menu, personal details and logout.
    - `register.html` - page where you can register a user who does not have an account.
    - `search.html` - page where we can search for a product of our interest according to the name.
    - `view_product.html` - page where the selected product is displayed from the category of your interest.
    - `view_products.html` - page where all the products are displayed according to the category selected by the user.

# Routes

### Login `/login`

This page contains the login section on the left-hand side which has validation in case the user tries to enter invalid data.

### Register `/register`

This page contains the form with the necessary data so that the user can create their own account to make purchases on the website.

### Logout `/logout`

This function closes the session of the user who is logged in.

### Index `/`

This page contains three clickable images (children, woman and man). If you click on an image you will get to see the menu and the categories of what you just clicked (children, woman or man).

### Products `/products/gender/category`

This page will have all the products registered according to the genre and the category selected in the menu. For each product, we display the image of the product, the name and the price.

If a user clicks on a product, they will see a larger view of the details of the product itself.

### Product `/product/product*id`

This page is divided into two very important parts:

1. Product details: product name, description, price and "Add to Basket" button:

   - Clicking on the "Add to Basket" button for the first time will activate the "Process to order" button.

2. Other products: Randomly shows two other products. Each product displays an image, the price and "Add to Basket" button:

   - Clicking on the "Add to Basket" button for the first time will change button color for reference that has been added.

### Cart `/cart`

This page only contains the nav bar and a div in the HTML. All the rest of the page is created in JavaScript i.e. the title, the number of items added to the cart, the images of the products, the names, the prices, the total value to pay of the products in cart, the button to make the purchase, etc.

### Order Details `/orderDetails`

This page contains the invoice of the purchase made by the user.

### Admin Section `/adminSection`

This page is only visible to admin users and contains a form that can add a new product into the store.

### Search `/search`

Here the user will be able to search a product by name.

### User Menu `/user/menu`

This page contains the user menu where you will have three links:

- Personal info
- Invoice
- Logout

### User Personal Info `/user/personal-info`

This page contains all the information of the user which was entered at the time of registration. On this page, you can update the information.

### User Invoice `/user/invoice`

This page contains all the purchases made by the user in the past.

# How to run the application

1. Copy the repo to your system.
2. Verify you have Python and Django installed on your system. If not you will need to install them.
3. Run the following to start up the Django web server:
   > python manage.py runserver
4. Visit the website in your browser.
5. Go to Login.

- Use the following credentials to log in as a admin:

  > username: felipe@test.com,
  > password: 12345

- Use the following credentials to log in as a client:

  > username: marcela@test.com,
  > password: 23456

- Or, create a new user account by clicking CREATE ACCOUNT in the Login page.
