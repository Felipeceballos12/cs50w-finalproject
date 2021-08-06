let btnAddProductsToCart = document.getElementsByClassName("btnAddCart");

let localStorageData = localStorage.getItem("addProductsInCart");
// if defined then parse stored data or use empty array
let productsInCart = localStorageData ? JSON.parse(localStorageData) : [];

/*
let btnCarPage = document.createElement('a');
btnCarPage.innerHTML = "Process order";
btnCarPage.href = "/cart";
btnCarPage.id = "btnCarPage";

document.querySelector(".containerDescriptionProduct").appendChild(btnCarPage);
*/

// PART OF ADD PRODUCT TO CART
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

if (localStorageData && productsInCart.length > 0) {
    
    // Creando los elementos a usar en cart page
    let countProducts = counterProdcuts(productsInCart);
    let titlePage = document.createElement('h3');
    let countItems = document.createElement('p');
    let containerProducts = document.createElement('div');
    let containerPayAction = document.createElement('div');
    let btnPayAction = document.createElement('a');
    let subContainerOfTotal = document.createElement('div');
    let totalToPay = document.createElement('h5');

    
    
    // Agregando los datos a los elementos
    titlePage.innerHTML = "SHOPPING BAG";
    countItems.innerHTML = `${countProducts} ITEM(S)`;
    btnPayAction.innerHTML = "CONTINUE";
    btnPayAction.href = "#";
    totalPayForProducts(productsInCart, totalToPay);


    // Agregando class a los elementos
    countItems.className = "countItems";
    containerProducts.className = "containerCartproducts";
    containerPayAction.className = "containerPayAction";
    subContainerOfTotal.className = "subContainerOfTotal";
    btnPayAction.className = "btnPayAction";
    
    
    // Agregando elementos a su padre containerCartPage
    containerCartPage.appendChild(titlePage);
    containerCartPage.appendChild(countItems);
    containerCartPage.appendChild(containerProducts);
    containerCartPage.appendChild(containerPayAction);

    // Agregando elementos a su padre containerPayAction
    containerPayAction.appendChild(subContainerOfTotal);
    containerPayAction.appendChild(btnPayAction);
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
                                    <img src="https://img.icons8.com/material-rounded/12/000000/minus-math--v1.png"/>
                                </a>
                                <p class="titleCartProduct amount_p">${ productInCart.amount }</p>
                                <a class="btnAddProduct">
                                    <img src="https://img.icons8.com/material-sharp/12/000000/plus-math--v1.png"/>
                                </a>
                            </div>
                            <a class="btnRemove">
                                <img src="https://img.icons8.com/material-outlined/16/000000/trash--v2.png"/>
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
            productsInCart[x].amount += 1;
            localStorage.setItem('addProductsInCart', JSON.stringify(productsInCart));

            totalPayForProducts(productsInCart, totalToPay);
            
            amountProduct[x].innerText = productsInCart[x].amount;
            console.log(amountProduct[x]);
            let countItemAfterAdd = counterProdcuts(productsInCart);
            countItems.innerHTML = `${countItemAfterAdd} ITEM(S)`;
            addCartCounter();
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
                addCartCounter();
                totalPayForProducts(productsInCart, totalToPay);
            }
        });
    }

    // DELETE ITEM FROM CART
    let btnRemove = document.getElementsByClassName("btnRemove");
    for (let i = 0; i < btnRemove.length; i++) {
        
        btnRemove[i].addEventListener("click", function(event) {
           
            /*
                Esta parte es muy importante por que con ella vamos a poder
                eliminar items del localStorage sin tener que crear una nueva variable
            */
            if (i > -1) {
                productsInCart.splice(i, 1);
                localStorage.setItem('addProductsInCart', JSON.stringify(productsInCart));
            }

            // Modificando el cuerpo del cart.html
            let productClickedRemove = event.target;
            let productItemRemove = productClickedRemove.parentElement.parentElement.parentElement;

            productItemRemove.style.display = "none";
            let countItemAfterRemove = counterProdcuts(productsInCart);

            if (countItemAfterRemove > 0) {
                countItems.innerHTML = `${countItemAfterRemove} ITEM(S)`;
                addCartCounter();
                totalPayForProducts(productsInCart, totalToPay);

            } else {
                titlePage.style.display = "none";
                countItems.style.display = "none";
                containerProducts.style.display = "none";
                containerPayAction.style.display = "none";
                addCartCounter();
                cartEmpty(containerCartPage);
            }
            
        });
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