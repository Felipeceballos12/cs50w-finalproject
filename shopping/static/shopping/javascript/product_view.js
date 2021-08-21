import { productsInCart, localStorageData } from './localStorageData.js';
import { addCartCounter } from './util.js';

let idFound = findIdProduct(productsInCart);
addBtnProcessOrder(idFound);

/*window.addEventListener("click", (event) => {
    console.log(event.target);
});*/

let btnAddProductsToCart = document.getElementsByClassName("btnAddCart");
let countClicks = 0;
// PART OF ADD PRODUCT TO CART
for (let i = 0; i < btnAddProductsToCart.length; i++) {
    let btnAddProductToCart = btnAddProductsToCart[i];
    
    btnAddProductToCart.addEventListener('click', function(event) {
        let productClicked = event.target;
        let productItem = productClicked.id == "btnCart"
                        ? productClicked.parentElement.parentElement
                        : productClicked.parentElement;

        let productFind = findProductRepeatInCart(productsInCart, productItem);

        if (productFind != true) {
            // Adding items to variable keeping track of local storage
            productsInCart.push(getProductValues(productItem));
        }
        
        // Saving the new item into the local storage
        localStorage.setItem('addProductsInCart', JSON.stringify(productsInCart));
        
        addCartCounter(productsInCart, localStorageData);
        
        /* 
            PART OF ADD BTN "PROCESS ORDER" WHEN THE USER CLICK ON FIRST TIME TO THE BTN "ADD TO BASKET"

            - en la decision usamos "i == 0" ya que representa el primer boton de "Add to basket"
        */
        if (i === 0 && countClicks === 0) {
            addBtnProcessOrder(true);
            countClicks++;
        }
    });
}

function getProductValues(productItem) {

    let idAndAmountOfProduct = productItem.getElementsByClassName("product_items")[0].id;
    let findIdAndAmount = idAndAmountOfProduct.match(/\d+/g);
    let id = findIdAndAmount[0];
    let amountTotalOfProduct = findIdAndAmount[1];

    let img = productItem.getElementsByClassName("img_p")[0].src;
    let title = productItem.getElementsByClassName("title_p")[0].innerText;
    let price = productItem.getElementsByClassName("price_p")[0].innerText;
    let amount  = 1;

    return {
        id,
        img,
        title,
        price,
        amount,
        amountTotalOfProduct
    };
}

function findProductRepeatInCart(localData, productItemClicked) {
    let productFind = false;
    let indice = 0;
    let productId = productItemClicked.getElementsByClassName("product_items")[0].id;
    let findId = productId.match(/\d+/g);
    productId = findId[0];

    while(indice < localData.length && productFind == false){
        if (localData[indice].id == productId) {
            localData[indice].amount += 1;
            productFind = true;
        }

        indice++;
    }

    return productFind;
}

// Part of add btnProcessOrder
function addBtnProcessOrder(idFound) {

    if (idFound) {
        document.querySelector("#btnCarPage").style.display = "block";
    }
}

function findIdProduct(storeData) {

    let productId = document.getElementsByClassName("product_items")[0].id;
    let findId = productId.match(/\d+/g);
    productId = findId[0];
    let idFound = false;
    let indice = 0;
    
    while(indice < storeData.length && idFound === false){
        if (storeData[indice].id == productId) {

            idFound = true;
        }

        indice++;
    }

    return idFound;
}

addCartCounter(productsInCart, localStorageData);