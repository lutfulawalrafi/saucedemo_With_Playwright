import { test, expect } from '../fixtures/authFixture.js';
import excelReader from '../../utils/excelReader.js';
import logger from '../../helpers/logger.js';
import LoginPage from '../../pages/LoginPage.js';
import DashboardPage from '../../pages/fardin_pages/FardinDashboardPage.js';
import CartPage from '../../pages/fardin_pages/FardinCartPage.js';
import CheckoutPage from '../../pages/fardin_pages/CheckoutPage.js';
import CheckoutOverviewPage from '../../pages/fardin_pages/CheckoutOverviewPage.js';
import CheckoutCompletePage from '../../pages/fardin_pages/CheckoutCompletePage.js';

test.describe('Complete Order and Verfiy Workflow', () => {
    test('should complete an order and verify', async ({ page }) => {
        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        const checkoutCompletePage = new CheckoutCompletePage(page);

        // Test Data
        const productName = "Sauce Labs Fleece Jacket";
        const firstName = 'dummyfirstname';
        const lastName = 'dummylastname';
        const postalCode = '12345';

        // goto the website using the url = 'https://www.saucedemo.com/';
        logger.step(`Navigating to the login page`);
        await loginPage.navigateToLoginPage();

        const isLoginPageDisplayed = await loginPage.isLoginPageDisplayed();
        expect(isLoginPageDisplayed).toBeTruthy();

        logger.step(`Reading credentials from Excel`);
        const credentials = excelReader.getLoginCredentials();
        logger.info(`Using credentials: ${credentials.username} - ${credentials.description}`);

        await loginPage.doLogin(credentials.username, credentials.password);

        const isOnDashboard = await dashboardPage.isOnDashboard();
        expect(isOnDashboard).toBeTruthy();

        const isDashboardVisible = await dashboardPage.verifyDashboardVisible();
        expect(isDashboardVisible).toBeTruthy();

        const productCount = await dashboardPage.getProductCount();
        expect(productCount).toBeGreaterThan(0);

        const isProductDisplayed = await dashboardPage.isProductDisplayed(productName);
        expect(isProductDisplayed).toBeTruthy();

        const previousCartBadgeCount = await dashboardPage.getCartBadgeCount();
        await dashboardPage.addProductToCartByName(productName);
        const inventoryProductDetails = await dashboardPage.getProductDetails(productName);

        const isRemoveButtonVisible = await dashboardPage.verifyRemoveButtonVisible();
        expect(isRemoveButtonVisible).toBeTruthy();

        // Verify cart badge count is increase to 1
        const isBadgeCountExpected = await dashboardPage.verifyCartBadgeCount(previousCartBadgeCount + 1);
        expect(isBadgeCountExpected).toBeTruthy();

        await dashboardPage.clickCartIcon();

        const isOnCartPage = await cartPage.isOnCartPage();
        expect(isOnCartPage).toBeTruthy();

        const isCartPageVisible = await cartPage.verifyCartPageVisible();
        expect(isCartPageVisible).toBeTruthy();

        const isCartNotEmpty = await cartPage.getCartItemCount();
        expect(isCartNotEmpty).toBeTruthy();

        const isProductInCart = await cartPage.isProductInCart(productName);
        expect(isProductInCart).toBeTruthy();

        const cartProductDetails = await cartPage.getProductDetails(productName);

        // verify the cart product name matches with the inventory product name
        expect(cartProductDetails.name).toBe(inventoryProductDetails.name);
        expect(cartProductDetails.price).toBe(inventoryProductDetails.price);

        // verify the cart product quantity is 1
        expect(cartProductDetails.quantity).toBe('1');

        await cartPage.clickCheckout();

        const isOnCheckoutPage = await checkoutPage.isOnCheckoutPage();
        expect(isOnCheckoutPage).toBeTruthy();

        const isCheckoutPageVisible = await checkoutPage.verifyCheckoutPageVisible();
        expect(isCheckoutPageVisible).toBeTruthy();

        await checkoutPage.fillCheckoutInformation(firstName, lastName, postalCode);

        const isOnCheckoutOverviewPage = await checkoutOverviewPage.isOnCheckoutOverviewPage();
        expect(isOnCheckoutOverviewPage).toBeTruthy();

        const isCheckoutOverviewPageVisible = await checkoutOverviewPage.verifyCheckoutOverviewPageVisible();
        expect(isCheckoutOverviewPageVisible).toBeTruthy();

        const checkoutProductDetails = await checkoutOverviewPage.getCheckoutProductDetails(productName);

        expect(checkoutProductDetails.name).toBe(cartProductDetails.name);
        expect(checkoutProductDetails.price).toBe(cartProductDetails.price);
        expect(checkoutProductDetails.quantity).toBe(cartProductDetails.quantity);
        expect(checkoutProductDetails).toEqual(cartProductDetails);

        await checkoutOverviewPage.clickFinishButton();

        const isOnCheckoutCompletePage = await checkoutCompletePage.isOnCheckoutCompletePage();
        expect(isOnCheckoutCompletePage).toBeTruthy();

        const isCheckoutCompletePageVisible = await checkoutCompletePage.verifyCheckoutCompletePageVisible();
        expect(isCheckoutCompletePageVisible).toBeTruthy();

        const isCompleteMessageVisible = await checkoutCompletePage.verifyCompleteMessageVisible();
        expect(isCompleteMessageVisible).toBeTruthy();

        const isConfirmationImageVisible = await checkoutCompletePage.verifyConfirmationImageVisible();
        expect(isConfirmationImageVisible).toBeTruthy();

        await checkoutCompletePage.clickBackHomeButton();

        // assert that the User is redirected to inventory (Dashboard) page
        expect(isOnDashboard).toBeTruthy();

        const isCartEmpty = await cartPage.isCartEmpty();
        expect(isCartEmpty).toBeTruthy();
    });


});
