import BasePage from './FardinBasePage';

/**
 * CheckoutOverviewPage - Page Object for SauceDemo Shopping Checkout: Overview Page
 * Handles all interactions with the checkout overview page
 */
export default class CheckoutOverviewPage extends BasePage {
    /**
     * Constructor
     * @param {import('@playwright/test').Page} page - Playwright page object
     */
    constructor(page) {
        super(page);

        // Define locators for cart page elements
        this.locators = {
            pageTitle : '.title' ,
            checkoutSummaryContainer : '#checkout_summary_container' ,
            checkoutItemQuantity : '.cart_quantity',
            checkoutItemName : '.inventory_item_name',
            checkoutItemPrice : '.inventory_item_price',
            checkoutItem : '.cart_item',
            checkoutItemDescription: '.inventory_item_desc',
            finishButton : '#finish',
            cancelButton : '#cancel'
        };
    }


    /**
     * Verify user is on Checkout: Overview page
     * @returns {Promise<boolean>} True if on cart page
     */
    async isOnCheckoutOverviewPage() {
        const expectedUrl = 'checkout-step-two.html' ;
        const pageName = 'Checkout Overview' ;

        return await this.isOnPage(expectedUrl, pageName);
    }

    /**
     * Verify checkout overview page is visible
     * @returns {Promise<boolean>} True if checkout overview page is visible
     */
    async verifyCheckoutOverviewPageVisible() {
        this.logger.step('Verifying checkout overview page is visible');
        
        return await this.isPageVisible(
            this.locators.pageTitle,                  
            this.locators.checkoutSummaryContainer,  
            'Checkout Overview'
        );
    }

    /**
     * Get checkout product details from checkout overview page
     * @param {string} productName - Name of the product
     * @returns {Promise<Object>} Product details (name, description, price, quantity)
     */
    async getCheckoutProductDetails(productName) {
        try {
            this.logger.step(`Getting details for checkout product "${productName}"`);

            // Find the checkout item containing this product
            const checkoutItem = this.page.locator(this.locators.checkoutItem)
                .filter({ has: this.page.locator(this.locators.checkoutItemName, { hasText: productName }) });

            // Get product details
            const name = await checkoutItem.locator(this.locators.checkoutItemName).textContent();
            const description = await checkoutItem.locator(this.locators.checkoutItemDescription).textContent();
            const price = await checkoutItem.locator(this.locators.checkoutItemPrice).textContent();
            const quantity = await checkoutItem.locator(this.locators.checkoutItemQuantity).textContent();

            const details = {
                name: name?.trim(),
                description: description?.trim(),
                price: price?.trim(),
                quantity: quantity?.trim()
            };

            this.logger.pass(`Retrieved checkout details for "${productName}"`);
            this.logger.info(`Checkout Details: ${JSON.stringify(details)}`);

            return details;

        } catch (error) {
            this.logger.fail(`Failed to get checkout product details: ${error.message}`);
            throw error;
        }
    }

    /**
     * Click continue button
     */
    async clickFinishButton() {
        try {
            this.logger.step('Clicking finish button');
            await this.safeClick(this.locators.finishButton);
            this.logger.pass('Navigated to checkout complete page');
        } catch (error) {
            this.logger.fail(`Failed to click finish button: ${error.message}`);
            throw error;
        }
    }


    /**
     * Click cancel button
     */
    async clickCancelButton() {
        try {
            this.logger.step('Clicking cancel button');
            await this.safeClick(this.locators.cancelButton);
            this.logger.pass('Navigated back to dashboard page');
        } catch (error) {
            this.logger.fail(`Failed to click cancel shopping: ${error.message}`);
            throw error;
        }
    }

}
