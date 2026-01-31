import {test,expect} from '@playwright/test';

import excelReader from '../utils/excelReader';

import {LoginPage} from '../pages/LutfulRafi_Pages/LoginPage.js';
import {InventoryPage} from '../pages/LutfulRafi_Pages/InventoryPage.js';
import {CartPage} from '../pages/LutfulRafi_Pages/CartPage.js';

test('Buy Sauce Labs Fleece Jacket',async({page})=> {

    //read username/password from excel and store it 
    const { username, password } = excelReader.getLoginCredentials(0);
    const PRODUCT = 'Sauce Labs Fleece Jacket';

    
    const login=new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    //1. Navigate to app and login using credentials
    await login.goto();
    await login.expectLoaded();

    await login.login(username, password);

    //3) Verify product availability
    await inventory.expectProductVisible(PRODUCT);
    console.log('✅ Fleece Jacket is visible on inventory page');

    // Capture price while still on inventory page
    const inventoryPrice = await inventory.getProductPrice(PRODUCT);
    console.log('Inventory price:', inventoryPrice);

    //4) add to cart
    await inventory.addToCart(PRODUCT);
    console.log('✅ Fleece Jacket has been added to cart');
    await inventory.expectButtonChangedToRemove(PRODUCT);
    console.log('✅ Remove button is visible');

    //5. Verify Cart Badge Increment
    await inventory.expectCartBadgeCount(1);
    console.log('✅ Cart badge count is 1');

    //6. Goto cart page
    await inventory.goToCart();
    await cart.expectLoaded();
    console.log('✅ Cart page opened');

    //7. Verify Product Details on Cart Page
    // Capture price to compare across pages 
    //await inventory.expectLoaded();  **
    //const inventoryPrice = await inventory.getProductPrice(PRODUCT); **
    await cart.expectItemDetails(PRODUCT, 1, inventoryPrice);
    console.log('✅ Product details displayed');

});




