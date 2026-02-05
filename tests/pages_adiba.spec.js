import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Adiba_Pages/Login';
import { Products } from '../pages/Adiba_Pages/Products';
import { Cart } from '../pages/Adiba_Pages/Cart';
import { Checkout } from '../pages/Adiba_Pages/Checkout';
import { CheckoutOverview } from '../pages/Adiba_Pages/CheckoutOverview';
import { CheckoutComplete } from '../pages/Adiba_Pages/CheckoutComplete';
import { Assertions } from '../helpers/Adiba_Helpers/assertions';


test('test', async ({ page }) => {
 
    const loginPage = new LoginPage(page);
    const products = new Products(page);
    const cart = new Cart(page);
    const checkout = new Checkout(page);
    const checkoutOverview = new CheckoutOverview(page);
    const checkoutComplete = new CheckoutComplete(page);

    const assertions = new Assertions();

    //Login
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
   
    await expect(products.pageTitle).toContainText('Products');

    //Find Product and Add to Cart
    const product = await products.locateProduct('Sauce Labs Fleece Jacket');    
    await products.addProductToCart(product);
   
    await expect(product.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(products.cart).toContainText('1');

    //Remove Product
    await products.removeFromCart(product);

    await expect(product.getByRole('button', { name: 'Add to cart' })).toBeVisible();
    await expect(products.cart).toContainText('');

    //Add to Cart again
    await products.addProductToCart(product);
   
    await expect(product.getByRole('button', { name: 'Remove' })).toBeVisible();
    await expect(products.cart).toContainText('1');

    //Go to Cart
    await products.goToCart(products.cart);
    await expect(cart.pageTitle).toContainText('Your Cart');
   
    //Verify Cart Information
    // await expect(cart.quantity).toContainText('1');
    // await expect(cart.cartProduct).toContainText('Sauce Labs Fleece Jacket');
    // await expect(cart.price).toContainText('$49.99');

    await assertions.verifyByText([
        { locator: cart.quantity, text: '1' },
        { locator: cart.cartProduct, text: 'Sauce Labs Fleece Jacket' },
        { locator: cart.price, text: '$49.99' },
    ]);

    // Checkout
    await cart.checkoutProdcut();
    await expect(checkout.pageTitle).toContainText('Checkout: Your Information');

    await checkout.fillYourInfo('Test', 'User', '12345');
    await expect(checkoutOverview.pageTitle).toContainText('Checkout: Overview');

    //Verify Checkout Overview Details
    
    // await expect(checkoutOverview.productName).toContainText('Sauce Labs Fleece Jacket');
    // await expect(checkoutOverview.productQuantity).toContainText('1');
    // await expect(checkoutOverview.productPrice).toContainText('$49.99');
    // await expect(checkoutOverview.totalPrice).toContainText('Total: $53.99');

    await assertions.verifyByText([
        { locator: checkoutOverview.productName, text: 'Sauce Labs Fleece Jacket' },
        { locator: checkoutOverview.productQuantity, text: '1' },
        { locator: checkoutOverview.productPrice, text: '$49.99' },
        { locator: checkoutOverview.totalPrice, text: 'Total: $53.99' },
    ]);

    //Finish buying
    await checkoutOverview.finishBuy();
    await expect(checkoutComplete.pageTitle).toContainText('Checkout: Complete!');
    await expect(checkoutComplete.successMessage).toContainText('Thank you for your order!');


    //Go Back to Home (Products page)
    await checkoutComplete.goBackHome();
    await expect(products.pageTitle).toContainText('Products');
});