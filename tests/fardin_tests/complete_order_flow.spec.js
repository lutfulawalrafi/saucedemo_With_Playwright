import { test, expect } from '../fixtures/authFixture.js';
import excelReader from '../../utils/excelReader.js';
import logger from '../../helpers/logger.js';
import BasePage from '../../pages/fardin_pages/FardinBasePage.js';
import LoginPage from '../../pages/LoginPage.js';
import DashboardPage from '../../pages/fardin_pages/FardinDashboardPage.js';
import CartPage from '../../pages/fardin_pages/FardinCartPage.js';
import CheckoutPage from '../../pages/fardin_pages/CheckoutPage.js';
import CheckoutOverviewPage from '../../pages/fardin_pages/CheckoutOverviewPage.js';
import CheckoutCompletePage from '../../pages/fardin_pages/CheckoutCompletePage.js';

test.describe('Complete Order and Verfiy Workflow', () => {
    test('should complete an order and verify', async ({ page }) => {

        const loginPage = new LoginPage(page);
        // Navigate to the application
        // goto the website using the url = 'https://www.saucedemo.com/';
        logger.step(`Navigating to the login page`);
        await loginPage.navigateToLoginPage();

        // Assert that the Login Page is Displayed
        const isLoginPageDisplayed = await loginPage.isLoginPageDisplayed();
        expect(isLoginPageDisplayed).toBeTruthy();


        // Read credentials from excel
        const credentialIndex = 0;        
        logger.step(`Reading credentials from Excel (index: ${credentialIndex} )`);
        const credentials = excelReader.getLoginCredentials(credentialIndex);
        
        logger.info(`Using credentials: ${credentials.username} - ${credentials.description}`);
        
        // Login to the application using valid credentials from Excel
        await loginPage.doLogin(credentials.username, credentials.password);

        const dashboardPage = new DashboardPage(page);
        
        // Assert that User is redirected to inventory (dashboard) page
        const isOnDashboard = await dashboardPage.isOnDashboard();
        expect(isOnDashboard).toBeTruthy();

        // Verify that elements of the dashboard is visible
        const isDashboardVisible = await dashboardPage.verifyDashboardVisible();
        expect(isDashboardVisible).toBeTruthy();

        // Verify products are available and being displayed on the inventory page
        const productCount = await dashboardPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);
        
        // Assert that the Product is visible in the product list
        const productName = "Sauce Labs Fleece Jacket";
        const isProductDisplayed = await dashboardPage.isProductDisplayed(productName);
        expect(isProductDisplayed).toBeTruthy();

        const previousCartBadgeCount =  await dashboardPage.getCartBadgeCount();
        // Add the product to cart
        await dashboardPage.addProductToCartByName(productName);

        const inventoryProductDetails = await dashboardPage.getProductDetails(productName);


        // Assert that Add to cart Button changes to Remove button
        const isRemoveButtonVisible = await dashboardPage.verifyRemoveButtonVisible();
        expect(isRemoveButtonVisible).toBeTruthy();

        // Verify cart badge count is increase to 1
        const isBadgeCountExpected = await dashboardPage.verifyCartBadgeCount(previousCartBadgeCount + 1);
        expect(isBadgeCountExpected).toBeTruthy();

        // click on the cart icon to  Navigate to the cart page
        await dashboardPage.clickCartIcon();

        const cartPage = new CartPage(page);

        // assert that user is redirected to cart page
        const isOnCartPage = await cartPage.isOnCartPage();
        expect(isOnCartPage).toBeTruthy();

        // Verify that cart page is visible
        const isCartPageVisible = await cartPage.verifyCartPageVisible();
        expect(isCartPageVisible).toBeTruthy();
        
        // Verify that cart is not empty
        const isCartNotEmpty = await cartPage.getCartItemCount();
        expect(isCartNotEmpty).toBeTruthy();
        
        // Verify that product is in the cart
        const isProductInCart = await cartPage.isProductInCart(productName);
        expect(isProductInCart).toBeTruthy();
        
        // Verify the product details on cart page
        const cartProductDetails = await cartPage.getProductDetails(productName);
        
        // verify the cart product name matches with the inventory product name
        expect(cartProductDetails.name).toBe(inventoryProductDetails.name);
        console.log(cartProductDetails.name);

        // verify the cart product price matches with the inventory product price
        expect(cartProductDetails.price).toBe(inventoryProductDetails.price);
        console.log(cartProductDetails.price);

        // verify the cart product quantity is 1
        expect(cartProductDetails.quantity).toBe('1');

        
        // click checkout button to Proceed to the checkout your information page
        await cartPage.clickCheckout();

        const checkoutPage = new CheckoutPage(page);

        // Assert that User is redirected to Checkout: Your Information page
        const isOnCheckoutPage = await checkoutPage.isOnCheckoutPage();
        expect(isOnCheckoutPage).toBeTruthy();

        // Verify that all the elements of  
        // the checkout your information page is visible
        const isCheckoutPageVisible = await checkoutPage.verifyCheckoutPageVisible();
        expect(isCheckoutPageVisible).toBeTruthy();

        // fill the checkout information with first name, last name, postal code
        const firstName = 'dummyfirstname';
        const lastName = 'dummylastname' ;
        const postalCode = '12345' ;
        
        await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);

        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        
        // Verify that User is redirected to Checkout: Overview page
        const isOnCheckoutOverviewPage = await checkoutOverviewPage.isOnCheckoutOverviewPage();
        expect(isOnCheckoutOverviewPage).toBeTruthy();

        // Verify that all the elements of  
        // the checkout your information page is visible
        const isCheckoutOverviewPageVisible = await checkoutOverviewPage.verifyCheckoutOverviewPageVisible();
        expect(isCheckoutOverviewPageVisible).toBeTruthy();


        // Verify the checkout overview details
        const checkoutProductDetails = await checkoutOverviewPage.getCheckoutProductDetails(productName);

        // verify the checkout product name matches with the cart product name
        expect(checkoutProductDetails.name).toBe(cartProductDetails.name);
        console.log(checkoutProductDetails.name);

        // verify the checkout product price matches with the cart product price
        expect(checkoutProductDetails.price).toBe(cartProductDetails.price);
        console.log(checkoutProductDetails.price);

        // verify the checkout product name quantity with the cart product quantity
        expect(checkoutProductDetails.quantity).toBe(cartProductDetails.quantity);
        console.log(checkoutProductDetails.quantity);


        // Assert that all checkout details are correct
        expect(checkoutProductDetails).toEqual(cartProductDetails);

        // complete the order
        // click finish button
        await checkoutOverviewPage.clickFinishButton();

        // assert that the User is redirected to Checkout Complete page
        const checkoutCompletePage = new CheckoutCompletePage(page);

        const isOnCheckoutCompletePage = await checkoutCompletePage.isOnCheckoutCompletePage();
        expect(isOnCheckoutCompletePage).toBeTruthy();

        // Verify that all the elements of  
        // the checkout complete page is visible
        const isCheckoutCompletePageVisible = await checkoutCompletePage.verifyCheckoutCompletePageVisible();
        expect(isCheckoutCompletePageVisible).toBeTruthy();


        // Verify the user is on the order completion page

        // verify confirmation message (e.g., “Thank you for your order!”)
        const isCompleteMessageVisible = await checkoutCompletePage.verifyCompleteMessageVisible();
        expect(isCompleteMessageVisible).toBeTruthy();
        

        // verify order confirmation icon/image is displayed
        const isConfirmationImageVisible = await checkoutCompletePage.verifyConfirmationImageVisible();
        expect(isConfirmationImageVisible).toBeTruthy();

        // Navigate back to dashboard

        // click Back to Home button
        await checkoutCompletePage.clickBackHomeButton();

        // assert that the User is redirected to inventory (Dashboard) page
        expect(isOnDashboard).toBeTruthy();

        const isCartEmpty = await cartPage.isCartEmpty();
        expect(isCartEmpty).toBeTruthy();
    });


});
