import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js'; 
import DashboardPage from '../pages/Nahian_pages/nahianDashboardPage.js';
import CartPage from '../pages/CartPage.js';
import CheckoutPage from '../pages/Nahian_pages/nahianCheckoutPage.js';
import excelReader from '../utils/excelReader.js';

test.describe('POM-Task Tests', () => {

    let login;
    let dashboard;
    let cart;
    let checkout

    test.beforeEach(async ({page}) => {
        login = new LoginPage(page);
        dashboard = new DashboardPage(page);
        cart = new CartPage(page);
        checkout = new CheckoutPage(page);
    });

    test('Navigate To Application', async() => {
        
        await login.navigateToLoginPage();
        const isLoginPageDisplayed = await login.isLoginPageDisplayed();
        expect(isLoginPageDisplayed).toBeTruthy();
    });

    test('Login to Application', async() =>{
        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.enterUsername(credentials.username);
        await login.enterPassword(credentials.password);
        await login.clickLoginButton();
        
        const isDashboardVisible = await dashboard.verifyDashboardVisible();
        expect(isDashboardVisible).toBeTruthy();

    });

    test('Verify Product Availability on Inventory Page', async() =>{
        
        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');

        const isProductDisplayed = await dashboard.isProductDisplayed(product.productName);
        expect(isProductDisplayed).toBeTruthy();
    });

    test('Add Product to Cart', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');

        await dashboard.addProductToCartByName(product.productName);
        const isRemoveSwitched = await dashboard.addToCartSwitchedToRemove(product.productName);
        expect(isRemoveSwitched).toBeTruthy();

        await dashboard.clickCartIcon();
        const isProductInCart = await cart.isProductInCart(product.productName);
        expect(isProductInCart).toBeTruthy();
    });

    test('Verify Cart Badge Increment', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');

        const before_count = await dashboard.getCartBadgeCount();
        await dashboard.addProductToCartByName(product.productName);
        const after_count = await dashboard.getCartBadgeCount();

        let count_bool = false;
        if((after_count - before_count) == 1) count_bool = true;
        expect(count_bool).toBeTruthy();
    });

    test('Navigate to Cart Page', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);

        await dashboard.clickCartIcon();
        const isCartPageVisible = await cart.verifyCartPageVisible();
        expect(isCartPageVisible).toBeTruthy();
    });

    test('Verify Product Details on Cart Page', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');
        const dashboardPrice = await dashboard.getProductPrice(product.productName);
        await dashboard.addProductToCartByName(product.productName);

        await dashboard.clickCartIcon();

        const cartProductDetails = await cart.getProductDetails(product.productName);
        expect(cartProductDetails.name).toBe(product.productName);
        expect(cartProductDetails.quantity).toBe('1');
        const cartProductPrice = cartProductDetails.price;
        expect(cartProductPrice).toBe(dashboardPrice)

    });

    test('Proceed to Checkout', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');
        
        await dashboard.addProductToCartByName(product.productName);
        await dashboard.clickCartIcon();
        await cart.clickCheckout();

        const isCheckoutYourInfoVisible = await checkout.verifyCheckOutInfoPageVisible();
        expect(isCheckoutYourInfoVisible).toBeTruthy();
    });

    test('Fill Checkout Information', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');
        
        await dashboard.addProductToCartByName(product.productName);
        await dashboard.clickCartIcon();
        await cart.clickCheckout();

        await checkout.fillInformation('Shaikh', 'Nahian', '1214');

        const isSummaryFormVisible = await checkout.verifySummaryFormVisible();
        expect(isSummaryFormVisible).toBeTruthy();
    });

    test('Verify Checkout Overview Details', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');
        const productQuantity = '1';
        
        const dashboardPrice = await dashboard.getProductPrice(product.productName);
        await dashboard.addProductToCartByName(product.productName);
        await dashboard.clickCartIcon();
        await cart.clickCheckout();

        await checkout.fillInformation('Shaikh', 'Nahian', '1214');
        const productDetails = await checkout.getProductDetails(product.productName);
        expect (productDetails.name).toBe(product.productName);
        expect (productDetails.quantity).toBe(productQuantity);
        expect (productDetails.price).toBe(dashboardPrice);

        const isTotalCorrect = await checkout.isItemTotalCorrect();
        expect(isTotalCorrect).toBeTruthy();
    });

    test('Complete the Order', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');
    
        await dashboard.addProductToCartByName(product.productName);
        await dashboard.clickCartIcon();
        await cart.clickCheckout();

        await checkout.fillInformation('Shaikh', 'Nahian', '1214');
        await checkout.clickFinish();
        
        const isCheckoutComplete = await checkout.isCheckOutCompleteVisible();
        expect(isCheckoutComplete).toBeTruthy();
    });

    test('Verify Order Completion Page', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');
    
        await dashboard.addProductToCartByName(product.productName);
        await dashboard.clickCartIcon();
        await cart.clickCheckout();

        await checkout.fillInformation('Shaikh', 'Nahian', '1214');
        await checkout.clickFinish();
        
        const isOrderComplete = await checkout.isOrderComplete();
        expect(isOrderComplete).toBeTruthy();
    });

    test('Navigate Back to Dashboard', async() =>{

        await login.navigateToLoginPage();
        const credentials = excelReader.getLoginCredentials(0);
        await login.doLogin(credentials.username, credentials.password);
        const product = excelReader.getProductByName('Sauce Labs Fleece Jacket');
    
        await dashboard.addProductToCartByName(product.productName);
        await dashboard.clickCartIcon();
        await cart.clickCheckout();

        await checkout.fillInformation('Shaikh', 'Nahian', '1214');
        await checkout.clickFinish();
        
        await checkout.clickBackHomeButton();
        const isDashboardVisible = await dashboard.verifyDashboardVisible();
        expect(isDashboardVisible).toBeTruthy();

        const badgeCount = await dashboard.getCartBadgeCount();
        expect(badgeCount).toBe(0);
    });








});