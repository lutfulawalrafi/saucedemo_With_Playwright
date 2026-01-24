import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Adiba_Pages/Login';
import { Inventory } from '../pages/Adiba_Pages/Inventory';
import { Cart } from '../pages/Adiba_Pages/Cart';
import { Checkout } from '../pages/Adiba_Pages/Checkout';
import { CheckoutOverview } from '../pages/Adiba_Pages/CheckoutOverview';
import { CheckoutComplete } from '../pages/Adiba_Pages/CheckoutComplete';

test('test', async ({ page }) => {
 
    const loginPage = new LoginPage(page);
    const inventory = new Inventory(page);
    const cart = new Cart(page);
    const checkout = new Checkout(page);
    const checkoutOverview = new CheckoutOverview(page);
    const checkoutComplete = new CheckoutComplete(page);

    //Login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
   
    await expect(inventory.pageTitle).toContainText('Products');

    //Find Product and Add to Cart
    const product = await inventory.locateProduct('Sauce Labs Fleece Jacket');    
    await inventory.addProductToCart(product);
   
    await expect(product.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(inventory.cart).toContainText('1');

    //Go to Cart
    await cart.goToCart(inventory.cart);
    await expect(cart.pageTitle).toContainText('Your Cart');
   
    //Verify Cart Information
    await expect(cart.quantity).toContainText('1');
    await expect(cart.cartProduct).toContainText('Sauce Labs Fleece Jacket');
    await expect(cart.price).toContainText('$49.99');

    // Checkout
    await cart.checkoutProdcut();
    await expect(checkout.pageTitle).toContainText('Checkout: Your Information');

    await checkout.fillYourInfo('Test', 'User', '12345');
    await expect(checkoutOverview.pageTitle).toContainText('Checkout: Overview');

    //Verify Checkout Overview Details
    await expect(checkoutOverview.productName).toContainText('Sauce Labs Fleece Jacket');
    await expect(checkoutOverview.productQuantity).toContainText('1');
    await expect(checkoutOverview.productPrice).toContainText('$49.99');
    await expect(checkoutOverview.totalPrice).toContainText('Total: $53.99');

    //Finish buying
    await checkoutOverview.finishBuy();
    await expect(checkoutComplete.pageTitle).toContainText('Checkout: Complete!');
    await expect(checkoutComplete.successMessage).toContainText('Thank you for your order!');


    //Go Back to Home (Inventory page)
    await checkoutComplete.goBackHome();
    await expect(inventory.pageTitle).toContainText('Products');
});