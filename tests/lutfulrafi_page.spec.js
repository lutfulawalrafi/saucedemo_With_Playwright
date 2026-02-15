import {test,expect} from '@playwright/test';
import {PRODUCT_NAMES,CHECKOUT_DATA,CART_COUNT} from '../utils/lutful_constants.js'


import excelReader from '../utils/excelReader';

import {LoginPage} from '../pages/LutfulRafi_Pages/LoginPage.js';
import {InventoryPage} from '../pages/LutfulRafi_Pages/InventoryPage.js';
import {CartPage} from '../pages/LutfulRafi_Pages/CartPage.js';
import {CheckoutInfoPage} from '../pages/LutfulRafi_Pages/CheckoutInfoPage.js';
import {CheckoutOverviewPage} from '../pages/LutfulRafi_Pages/CheckoutOverviewPage.js';
import {CheckoutCompletePage} from '../pages/LutfulRafi_Pages/CheckoutCompletePage.js';

test('Buy Sauce Labs Fleece Jacket',async({page})=> {


    const { username, password } = excelReader.getLoginCredentials(0);

    const login=new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkoutinfo = new CheckoutInfoPage(page);
    const checkoutoverview = new CheckoutOverviewPage(page);
    const checkoutcomplete = new CheckoutCompletePage(page);

    
    await login.goto();
    await expect(login.usernameInput).toBeVisible();
    await expect(login.passwordInput).toBeVisible();
    await expect(login.loginButton).toBeVisible();
    await login.login(username, password);
    
    await expect(inventory.getProductCard(PRODUCT_NAMES.FLEECE_JACKET)).toBeVisible();
    const inventoryPrice = await inventory.getProductPrice(PRODUCT_NAMES.FLEECE_JACKET);
    await inventory.addToCart(PRODUCT_NAMES.FLEECE_JACKET);
    await expect(inventory.getRemoveButton(PRODUCT_NAMES.FLEECE_JACKET)).toBeVisible();
    await expect(inventory.getCartBadge()).toHaveText(String(CART_COUNT));


    await inventory.goToCart();
    
    await expect(cart.getTitle()).toHaveText('Your Cart');
    await expect(cart.getItemName(PRODUCT_NAMES.FLEECE_JACKET)).toHaveText(PRODUCT_NAMES.FLEECE_JACKET);
    await expect(cart.getItemQty(PRODUCT_NAMES.FLEECE_JACKET)).toHaveText(String(CART_COUNT));
    await expect(cart.getItemPrice(PRODUCT_NAMES.FLEECE_JACKET)).toHaveText(inventoryPrice);
    await cart.checkout();
    
    await expect(checkoutinfo.getTitle()).toHaveText('Checkout: Your Information');
    await checkoutinfo.fillAndContinue(CHECKOUT_DATA.firstname,CHECKOUT_DATA.lastname,CHECKOUT_DATA.zipcode);
    
    await expect(checkoutoverview.getTitle()).toHaveText('Checkout: Overview');
    await expect(checkoutoverview.getOverviewItemName(PRODUCT_NAMES.FLEECE_JACKET)).toHaveText(PRODUCT_NAMES.FLEECE_JACKET);
    await expect(checkoutoverview.getOverviewItemQty(PRODUCT_NAMES.FLEECE_JACKET)).toHaveText(String(CART_COUNT));
    await expect(checkoutoverview.getOverviewItemPrice(PRODUCT_NAMES.FLEECE_JACKET)).toHaveText(inventoryPrice);
    await expect(await checkoutoverview.getItemTotalPrice()).toBe(inventoryPrice);
    await checkoutoverview.finish();

    await expect(await checkoutcomplete.getTitleText()).toBe('Checkout: Complete!');
    await expect(await checkoutcomplete.getConfirmationMessage()).toBe('Thank you for your order!');
    await expect(await checkoutcomplete.isIconVisible()).toBe(true);
    await checkoutcomplete.backToHome();
    await expect(inventory.getTitle()).toHaveText('Products');


    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

});





