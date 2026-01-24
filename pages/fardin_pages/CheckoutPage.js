import BasePage from './FardinBasePage.js';

/**
 * CheckoutPage - Page Object for SauceDemo Shopping Checkout Page
 * Handles all interactions with the shopping checkout page
 */
export default class CheckoutPage extends BasePage {
    /**
     * Constructor
     * @param {import('@playwright/test').Page} page - Playwright page object
     */
    constructor(page) {
        super(page);

        // Define locators for cart page elements
        this.locators = {
            pageTitle: '.title',
            firstNameInput : '#first-name',
            lastNameInput : '#last-name',
            postalCodeInput : '#postal-code',
            cancelButton : '#cancel',
            continueButton : '#continue',
            checkoutContainerInfo : '.checkout_info_container',
            errorMessage: '[data-test="error"]'
        };
    }


    /**
     * Verify user is on checkout page
     * @returns {Promise<boolean>} True if on cart page
     */
    async isOnCheckoutPage() {
        const expectedUrl = 'checkout-step-one.html' ;
        const pageName = 'Checkout' ;

        return await this.isOnPage(expectedUrl, pageName);
    }

    /**
     * Verify checkout page is visible
     * @returns {Promise<boolean>} True if cart page is visible
     */
    async verifyCheckoutPageVisible() {
        this.logger.step(`Verifying checkout page is visible`);

        return await this.isPageVisible(
            this.locators.pageTitle,                  
            this.locators.checkoutContainerInfo,  
            'Checkout'
        );
    }

    /**
     * Get checkout page title
     * @returns {Promise<string>} Checkout page title
     */
    async getCheckoutPageTitle() {
        try {
            const title = await this.getTextContent(this.locators.pageTitle);
            this.logger.info(`Checkout page title: ${title}`);
            return title;
        } catch (error) {
            this.logger.fail(`Failed to get checkout page title: ${error.message}`);
            throw error;
        }
    }

    /**
     * Enter firstname
     * @param {string} firstName - Username to enter
     */
    async enterFirstName(firstName) {
        await this.safeFill(this.locators.firstNameInput, firstName);
    }

    /**
     * Enter lastname
     * @param {string} lastName - Username to enter
     */
    async enterLastName(lastName) {
        await this.safeFill(this.locators.lastNameInput, lastName);
    }

    /**
     * Enter postalcode
     * @param {string} postalCode - Username to enter
     */
    async enterPostalCode(postalCode) {
        await this.safeFill(this.locators.postalCodeInput, postalCode);
    }

    /**
     * Click continue button
     */
    async clickContinueButton() {
        try {
            this.logger.step('Clicking continue button');
            await this.safeClick(this.locators.continueButton);
            this.logger.pass('Navigated to checkout overview page');
        } catch (error) {
            this.logger.fail(`Failed to click continue: ${error.message}`);
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
            this.logger.pass('Navigated back to cart page');
        } catch (error) {
            this.logger.fail(`Failed to click cancel shopping: ${error.message}`);
            throw error;
        }
    }

    /**
     * Perform fill the checkout information action
     * @param {string} firstname - First Name
     * @param {string} lastname - Last Name
     * @param {string} postalcode - Postal Code
     */
    async fillCheckoutInformation(firstname, lastname, postalcode) {
        this.logger.step(`Filling the checkout information`);

        try {
            await this.enterFirstName(firstname);
            await this.enterLastName(lastname);
            await this.enterPostalCode(postalcode);
            await this.clickContinueButton();

            // Wait a moment for navigation or error message
            await this.page.waitForTimeout(1000);

            // Check if filling information action was successful (no error message)
            const errorVisible = await this.isVisible(this.locators.errorMessage);

            if (errorVisible) {
                const errorText = await this.getTextContent(this.locators.errorMessage);
                this.logger.fail(`Filling Checkout Information failed with error: ${errorText}`);
                throw new Error(`Filling Checkout Info failed: ${errorText}`);
            } else {
                this.logger.pass(`Checkout filling action successful for user: ${firstname} ${lastname}`);
            }

        } catch (error) {
            this.logger.fail(`Checkout information filling process failed: ${error.message}`);
            await this.takeScreenshot(`filling-checkout-info-failure-${firstname}-${lastname}-${Date.now()}`);
            throw error;
        }
    }


}
