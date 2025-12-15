import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js'; 
import DashboardPage from '../pages/DashboardPage.js';
import CartPage from '../pages/CartPage.js';

test('Add Product to Cart', async({page}) => {
    const login = new LoginPage(page);
    await login.navigateToLoginPage();
    await login.doLogin('standard_user', 'secret_sauce');

    const productName = "Sauce Labs Bolt T-Shirt"
    const dash = new DashboardPage(page);
    await dash.addProductToCartByName(productName);
    await dash.verifyCartBadgeCount(1);
    await dash.clickCartIcon();

    const cart = new CartPage(page);
    await cart.verifyCartPageVisible();
    await cart.isProductInCart(productName); 

});