import { addCartCounter } from './util.js';

let localStorageData = localStorage.getItem("addProductsInCart");
// if defined then parse stored data or use empty array
let productsInCart = localStorageData ? JSON.parse(localStorageData) : [];

/*
    - CART PAGE SECTION
    
    NOTA: Esta seccion deberia estar separada de store?
*/

addCartCounter(productsInCart, localStorageData);

let containerCartPage = document.getElementById("cartContainer");

if (localStorageData && productsInCart.length > 0) {
    
    // Creando los elementos a usar en cart page
    let countProducts = counterProdcuts(productsInCart);
    let titlePage = document.createElement('h3');
    let countItems = document.createElement('p');
    let containerProducts = document.createElement('div');
    let containerPayAction = document.createElement('div');
    let btnPayAction = document.createElement('input');
    let subContainerOfTotal = document.createElement('div');
    let totalToPay = document.createElement('h5');
    let orderForm = document.createElement('form');
    let subContainerPayAction = document.createElement('div');
    
    // Agregando los datos a los elementos
    titlePage.innerHTML = "SHOPPING BAG";
    countItems.innerHTML = `${countProducts} ITEM(S)`;
    btnPayAction.value = "BUY NOW";
    btnPayAction.type = "submit";
    totalPayForProducts(productsInCart, totalToPay);


    // Agregando class a los elementos
    countItems.className = "countItems";
    containerProducts.className = "containerCartproducts";
    containerPayAction.className = "containerPayAction";
    subContainerOfTotal.className = "subContainerOfTotal";
    btnPayAction.className = "btnPayAction";
    orderForm.id = "orderForm";
    subContainerPayAction.className = "subContainerPayAction"
    
    
    // Agregando elementos a su padre containerCartPage
    containerCartPage.appendChild(titlePage);
    containerCartPage.appendChild(countItems);
    containerCartPage.appendChild(containerProducts);
    containerCartPage.appendChild(containerPayAction);

    // Agregando elementos a su padre containerPayAction
    containerPayAction.appendChild(subContainerPayAction);
    subContainerPayAction.appendChild(subContainerOfTotal);
    subContainerPayAction.appendChild(orderForm);
    orderForm.appendChild(btnPayAction);
    subContainerOfTotal.appendChild(totalToPay);

    // Recorriendo un Loop para mostrar los productos agregados al cart
    productsInCart.forEach(productInCart => {
        
        let containerProduct = document.createElement('div');

        containerProduct.innerHTML = `
                        <img class="imgCartProduct img_p" src="${ productInCart.img }" alt="Zara">
                        <input type="hidden" class="product_items" id="${ productInCart.id }">
                        <div class="description_cart_product">
                            <p class="titleCartProduct title_p">${ productInCart.title }</p>
                            <p class="priceCartProduct price_p">${ productInCart.price }</p>
                            <div class="addLessItem">
                                <a class="btnLessProduct">
                                    <img src="https://img.icons8.com/material-rounded/12/000000/minus-math--v1.png" alt="btnless"/>
                                </a>
                                <p class="titleCartProduct amount_p">${ productInCart.amount }</p>
                                <a class="btnAddProduct">
                                    <img src="https://img.icons8.com/material-sharp/12/000000/plus-math--v1.png" alt="btnplus"/>
                                </a>
                            </div>
                            <a class="btnRemove">
                                <img id="${ productInCart.id }" class="btnDeleteItem" src="https://img.icons8.com/material-outlined/16/000000/trash--v2.png" alt="trash"/>
                            </a>    
                        </div>    
        `;

        containerProducts.appendChild(containerProduct);
        containerProduct.className = 'containerCartProduct';
        
    });

    // ADD AND REDUCER ITEMS 
    let amountProduct = document.getElementsByClassName("amount_p");
    let btnAddAmountProduct = document.getElementsByClassName("btnAddProduct");
    for (let x = 0; x < btnAddAmountProduct.length; x++) {
        btnAddAmountProduct[x].addEventListener('click', () => {
            if (productsInCart[x].amount < productsInCart[x].amountTotalOfProduct) {
                productsInCart[x].amount += 1;
                localStorage.setItem('addProductsInCart', JSON.stringify(productsInCart));

                totalPayForProducts(productsInCart, totalToPay);
                
                amountProduct[x].innerText = productsInCart[x].amount;
                let countItemAfterAdd = counterProdcuts(productsInCart);
                countItems.innerHTML = `${countItemAfterAdd} ITEM(S)`;
                addCartCounter(productsInCart, localStorageData);
            }    
        });
    }

    let btnLessAmountProduct = document.getElementsByClassName("btnLessProduct");
    for (let j = 0; j < btnLessAmountProduct.length; j++) {
        btnLessAmountProduct[j].addEventListener('click', () => {
            if (productsInCart[j].amount > 1) {
                productsInCart[j].amount -= 1;
                localStorage.setItem('addProductsInCart', JSON.stringify(productsInCart));

                amountProduct[j].innerText = productsInCart[j].amount;
                let countItemAfterReduce = counterProdcuts(productsInCart);
                countItems.innerHTML = `${countItemAfterReduce} ITEM(S)`;
                addCartCounter(productsInCart, localStorageData);
                totalPayForProducts(productsInCart, totalToPay);
            }
        });
    }

    // DELETE ITEM FROM CART
    window.addEventListener('click',  (event) => {
        let productCR = event.target;
        
        if (productCR.className === "btnDeleteItem") {
            //let productsInStore = productsInCart.filter(product => product.id != productCR.id);
            productsInCart = productsInCart.filter(product => product.id != productCR.id);
            localStorage.setItem('addProductsInCart', JSON.stringify(productsInCart));
            
            // Modificando el cuerpo del cart.html
            let productItemRemove = productCR.parentElement.parentElement.parentElement;

            productItemRemove.style.display = "none";
            let countItemAfterRemove = counterProdcuts(productsInCart);

            if (countItemAfterRemove > 0) {
                countItems.innerHTML = `${countItemAfterRemove} ITEM(S)`;
                addCartCounter(productsInCart, localStorageData);
                totalPayForProducts(productsInCart, totalToPay);
            } else {
                titlePage.style.display = "none";
                countItems.style.display = "none";
                containerProducts.style.display = "none";
                containerPayAction.style.display = "none";
                localStorage.removeItem("addProductsInCart");
                addCartCounter(productsInCart, localStorageData);
                cartEmpty(containerCartPage);
                
            }

            
        }    
    });

    document.querySelector("#orderForm").onsubmit = async function (e) {
        e.preventDefault();

        let idsProducts = [];
        let amountToPay = 0;

        productsInCart.forEach(product => {
            idsProducts.push(product.id);
            let priceProduct = product.price.slice(0, -3).trim();
            let totalForProduct = priceProduct * product.amount;
            amountToPay += totalForProduct;
        });

        let ids = idsProducts.toString();

        const response = await fetch('/order', {
            method: 'POST',
            body: JSON.stringify({
                status: "En Proceso",
                products: ids,
                amount_pay: amountToPay.toFixed(2)
            })
        });

        const dataResponse = await response.json();

        if (dataResponse.message) {
            localStorage.removeItem("addProductsInCart");
            window.location.href = "/orderDetails";
        } else {
            console.log(dataResponse.error);
        }

    }

} else {
    cartEmpty(containerCartPage);
}

function counterProdcuts(localData) {
    let countProducts = 0;
    
    localData.forEach(productInCart => {
        countProducts += productInCart.amount;
    });

    return countProducts;
}

function cartEmpty(cartContainer) {
    let menssage = document.createElement('p');
    menssage.id = "noProductsInBasket";
    menssage.innerHTML = "Your basket is empty";
    
    cartContainer.appendChild(menssage);
}

function totalPayForProducts(dataStorage, elementTotalToPay) {
    let totalPayProducts = 0;
    
    dataStorage.forEach(productPrice => {
        let priceProduct = productPrice.price.slice(0, -3).trim();
        let totalForProduct = priceProduct * productPrice.amount;
        totalPayProducts += totalForProduct;
    });

    elementTotalToPay.innerHTML = `TOTAL ${ totalPayProducts.toFixed(2) } USD`;
}