export let localStorageData = localStorage.getItem("addProductsInCart");
// if defined then parse stored data or use empty array
export let productsInCart = localStorageData ? JSON.parse(localStorageData) : [];
