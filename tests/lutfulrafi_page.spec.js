import {test,expect} from '@playwright/test';
import {BASE_URL,PRODUCT_NAMES,CHECKOUT_DATA,CART_COUNT} from '../utils/lutful_constants.js'


import excelReader from '../utils/excelReader';

import {LoginPage} from '../pages/LutfulRafi_Pages/LoginPage.js';
import {InventoryPage} from '../pages/LutfulRafi_Pages/InventoryPage.js';
import {CartPage} from '../pages/LutfulRafi_Pages/CartPage.js';
import {CheckoutInfoPage} from '../pages/LutfulRafi_Pages/CheckoutInfoPage.js';
import {CheckoutOverviewPage} from '../pages/LutfulRafi_Pages/CheckoutOverviewPage.js';
import {CheckoutCompletePage} from '../pages/LutfulRafi_Pages/CheckoutCompletePage.js';

test('Buy Sauce Labs Fleece Jacket',async({page})=> {

    //read username/password from excel and store it 
    const { username, password } = excelReader.getLoginCredentials(0);

    const login=new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);
    const checkoutinfo = new CheckoutInfoPage(page);
    const checkoutoverview = new CheckoutOverviewPage(page);
    const checkoutcomplete = new CheckoutCompletePage(page);

    //1. Navigate to app and login using credentials
    await login.goto();
    await login.expectLoaded();

    await login.login(username, password);
    console.log('✅ Successfully logged in');

    //3) Verify product availability
    await inventory.expectProductVisible(PRODUCT_NAMES.FLEECE_JACKET);
    console.log('✅ Fleece Jacket is visible on inventory page');

    // Capture price while still on inventory page
    const inventoryPrice = await inventory.getProductPrice(PRODUCT_NAMES.FLEECE_JACKET);
    console.log('Inventory price:', inventoryPrice);

    //4) add to cart
    await inventory.addToCart(PRODUCT_NAMES.FLEECE_JACKET);
    console.log('✅ Fleece Jacket has been added to cart');
    await inventory.expectButtonChangedToRemove(PRODUCT_NAMES.FLEECE_JACKET);
    console.log('✅ Remove button is visible');

    //5. Verify Cart Badge Increment
    await inventory.expectCartBadgeCount(CART_COUNT);
    console.log('✅ Cart badge count is 1');

    //6. Goto cart page
    await inventory.goToCart();
    await cart.expectLoaded();
    console.log('✅ Cart page opened');

    //7. Verify Product Details on Cart Page
    // Capture price to compare across pages 
    await cart.expectItemDetails(PRODUCT_NAMES.FLEECE_JACKET, CART_COUNT, inventoryPrice);
    console.log('✅ Product details displayed');

    //8) Proceed to Checkout
    await cart.checkout();
    await checkoutinfo.expectLoaded();
    console.log('✅ Checkout Page loaded successfully');

    //9. Fill Checkout Information
    await checkoutinfo.fillAndContinue(CHECKOUT_DATA.firstname,CHECKOUT_DATA.lastname,CHECKOUT_DATA.zipcode);
    await checkoutoverview.expectLoaded();
    console.log('✅ Information filled and loaded overview page');

    //10. Verify Checkout Overview Details
    await checkoutoverview.expectOverviewDetails(PRODUCT_NAMES.FLEECE_JACKET,CART_COUNT,inventoryPrice);
    await checkoutoverview.expectItemTotalEqualsPrice(inventoryPrice);
    console.log('✅ Checkout details verified');

    //11. Complete the Order
    await checkoutoverview.finish();
    await checkoutcomplete.expectLoaded();
    console.log('✅ Order Placed');

    //12. Verify Order Completion Page
    await checkoutcomplete.expectConfirmationMessage('Thank you for your order!');
    await checkoutcomplete.expectIconVisible();
    console.log('✅ Verified Order Completion');

    // 13) Back to dashboard
    await checkoutcomplete.backToHome();
    await inventory.expectLoaded();
    console.log('✅ Returned to Dashboard');

    // Postconditions: cart cleared
    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);

});




