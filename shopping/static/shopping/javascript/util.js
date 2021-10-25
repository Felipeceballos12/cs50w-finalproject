// Function to add counter to the cart link on the header
export function addCartCounter(localData) {
    let cartLink = document.getElementsByClassName("link3")[0];
    let count = 0;
    
    if (localData) {
        localData.forEach(productInCart => {
            if (count < productInCart.amountTotalOfProduct) {
                count += productInCart.amount;
            }
        });
        cartLink.innerHTML = `CART(${count})`;
    }
}