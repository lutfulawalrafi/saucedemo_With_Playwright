import BasePage from './FardinBasePage';

/**
 * CheckoutCompletePage - Page Object for SauceDemo Shopping Checkout: Complete Page
 * Handles all interactions with the checkout overview page
 */
export default class CheckoutCompletePage extends BasePage {
    /**
     * Constructor
     * @param {import('@playwright/test').Page} page - Playwright page object
     */
    constructor(page) {
        super(page);

        // Define locators for cart page elements
        this.locators = {
            pageTitle : '.title',
            checkoutCompleteContainer : '.checkout_complete_container',
            confirmationImage : '.pony_express',
            completeMessage : '.complete-header',
            backHomeButton : '#back-to-products'
        };
    }


    /**
     * Verify user is on Checkout: Complete page
     * @returns {Promise<boolean>} True if on Checkout Complete page
     */
    async isOnCheckoutCompletePage() {
        const expectedUrl = 'checkout-complete.html' ;
        const pageName = 'Checkout Complete' ;

        return await this.isOnPage(expectedUrl, pageName);
    }

    /**
     * Verify checkout overview page is visible
     * @returns {Promise<boolean>} True if checkout overview page is visible
     */
    async verifyCheckoutCompletePageVisible() {
        this.logger.step(`Verifying checkout complete page is visible`);

        return await this.isPageVisible(
            this.locators.pageTitle,                  
            this.locators.checkoutCompleteContainer,  
            'Checkout Complete'
        );
    }

    /**
     * Verify confirmation image is visible
     * @returns {Promise<boolean>} True if confirmation image is visible
     */
    async verifyConfirmationImageVisible() {
        try {
            this.logger.step('Verifying order confirmation image is visible');

            // Wait for order confirmation image to be visible
            await this.waitForElement(this.locators.confirmationImage, 10000);

            // Check if confirmation image is visible
            const confirmationImageVisible = await this.isVisible(this.locators.confirmationImage);
  
            if (confirmationImageVisible) {
                this.logger.pass('Order Confimation Image is visible and loaded');
                return true;
            } else {
                this.logger.fail('Order Confirmation not visible');
                return false;
            }

        } catch (error) {
            this.logger.fail(`Failed to verify confirmation image: ${error.message}`);
            await this.takeScreenshot(`confirmation-image-verification-error-${Date.now()}`);
            throw error;
        }
    }


    /**
     * Verify complete message  is visible
     * @returns {Promise<boolean>} True if complete message is visible
     */
    async verifyCompleteMessageVisible() {
        try {
            this.logger.step('Verifying order complete message is visible');

            // Wait for order completion message to be visible
            await this.waitForElement(this.locators.completeMessage, 10000);

            // Check if complete message is visible
            const completeMessageVisible = await this.isVisible(this.locators.completeMessage);
  
            if (completeMessageVisible) {
                this.logger.pass('Order Complete Message is visible and loaded');
                return true;
            } else {
                this.logger.fail('Order complete message is not visible');
                return false;
            }

        } catch (error) {
            this.logger.fail('Failed to verify complete message: ${error.message}');
            await this.takeScreenshot('complete-message-verification-error-${Date.now()}');
            throw error;
        }
    }

    
    /**
     * Click back home button
     */
    async clickBackHomeButton() {
        try {
            this.logger.step('Clicking Back Home button');
            await this.safeClick(this.locators.backHomeButton);
            this.logger.pass('Navigated to checkout inventory (dashboard) page');
        } catch (error) {
            this.logger.fail(`Failed to click back home button: ${error.message}`);
            throw error;
        }
    }

}
