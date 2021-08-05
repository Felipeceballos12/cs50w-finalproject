let btnAddProductsToCart = document.getElementsByClassName("btnAddCart");

let localStorageData = localStorage.getItem("addProductsInCart");
// if defined then parse stored data or use empty array
let productsInCart = localStorageData ? JSON.parse(localStorageData) : [];

for (let i = 0; i < btnAddProductsToCart.length; i++) {
    let btnAddProductToCart = btnAddProductsToCart[i];
    
    btnAddProductToCart.addEventListener('click', function(event) {
        let productClicked = event.target;
        let productItem = productClicked.id == "btnCart"
                        ? productClicked.parentElement.parentElement
                        : productClicked.parentElement;

        let productFind = findProductRepeatInCart(productItem);

        if (productFind != true) {
            // Adding items to variable keeping track of local storage
            productsInCart.push(getProductValues(productItem));
        }
        console.log('hello');
        // Saving the new item into the local storage
        localStorage.setItem('addProductsInCart', JSON.stringify(productsInCart));

        addCartCounter();    
    });
}

function getProductValues(productItem) {

    let id = productItem.getElementsByClassName("product_items")[0].id;
    let img = productItem.getElementsByClassName("img_p")[0].src;
    let title = productItem.getElementsByClassName("title_p")[0].innerText;
    let price = productItem.getElementsByClassName("price_p")[0].innerText;
    let amount  = 1;

    return {
        id,
        img,
        title,
        price,
        amount
    };
}

function findProductRepeatInCart(productItemClicked) {
    let productFind = false;
    let indice = 0;
    let productId = productItemClicked.getElementsByClassName("product_items")[0].id;

    while(indice < productsInCart.length && productFind == false){
        if (productsInCart[indice].id == productId) {
            productsInCart[indice].amount += 1;
            productFind = true;
        }

        indice++;
    }

    return productFind;
}

function addCartCounter() {
    let cartLink = document.getElementsByClassName("link3")[0];
    let count = 0;

    if (productsInCart) {
        productsInCart.forEach(productInCart => {
            count += productInCart.amount;
        });
        cartLink.innerHTML = `CART(${count})`;
    }
}

addCartCounter();

/*
    - CART PAGE SECTION
    
    NOTA: Esta seccion deberia estar separada de store?
*/

let containerCartPage = document.getElementById("cartContainer");

if (localStorageData) {
    
    // Creando los elementos a usar en cart page
    let titlePage = document.createElement('h3');
    let countItems = document.createElement('p');
    let containerProducts = document.createElement('div');
    
    // Agregando los datos a los elementos
    let countProducts = 0;
    
    productsInCart.forEach(productInCart => {
        countProducts += productInCart.amount;
    });

    titlePage.innerHTML = "SHOPPING BAG";
    countItems.innerHTML = `${countProducts} ITEM(S)`;
    containerProducts.className = "containerCartproducts";
    
    // Agregando elementos a su padre
    containerCartPage.appendChild(titlePage);
    containerCartPage.appendChild(countItems);
    containerCartPage.appendChild(containerProducts);

    productsInCart.forEach(productInCart => {
        
        let containerProduct = document.createElement('div');

        containerProduct.innerHTML = `
                        <img class="imgCartProduct img_p" src="${ productInCart.img }" alt="Zara">
                        <div class="description_cart_product">
                            <p class="titleCartProduct title_p">${ productInCart.title }</p>
                            <p class="priceCartProduct price_p">${ productInCart.price }</p>
                            <a class="btnRemove">
                                <img src="https://img.icons8.com/material-outlined/16/000000/trash--v2.png"/>
                            </a>    
                        </div>    
        `;

        containerProducts.appendChild(containerProduct);
        containerProduct.className = 'containerCartProduct';
    });


} else {
    
    let menssage = document.createElement('p');
    menssage.id = "noProductsInBasket";
    menssage.innerHTML = "Your basket is empty";
    
    containerCartPage.appendChild(menssage);
}