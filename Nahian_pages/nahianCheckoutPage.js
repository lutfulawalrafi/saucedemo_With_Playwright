import BasePage from './nahianBasePage.js';

/**
 * CheckoutPage - Page Object for SauceDemo Checkout flow
 */
export default class CheckoutPage extends BasePage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        super(page);

        this.locators = {
            pageTitle: '.title',
            checkoutInfoForm: '#checkout_info_container',
            checkoutSummaryContainer: '#checkout_summary_container',
            firstNameInput: '#first-name',
            lastNameInput: '#last-name',
            postalCodeInput: '#postal-code',
            continueButton: '#continue',
            finishButton: '#finish',
            cancelButton: '#cancel',
            completeHeader: '.complete-header',
            continueShoppingButton: '#continue-shopping',
            cartItem: '.cart_item',
            cartItemName: '.inventory_item_name',
            cartItemDescription: '.inventory_item_desc',
            cartItemPrice: '.inventory_item_price',
            cartQuantity: '.cart_quantity',
            summarySubtotal: '.summary_subtotal_label',
            summaryTax: '.summary_tax_label',
            summaryTotal: '.summary_total_label',
            orderCompleteImage: '#checkout_complete_container > img',
            backHomeButton: '#back-to-products'
        };
    }

    /**
     * Fills out the checkout information form and continues
     */
    
    async verifyCheckOutInfoPageVisible() {
        try {
            await this.waitForElement(this.locators.checkoutInfoForm);
            const titleVisible = await this.isVisible(this.locators.pageTitle);
            if (titleVisible) {
                this.logger.pass('Checkout: Your Information page is visible and loaded');
                return true;
            } else {
                this.logger.fail('Checkout: Your Information page is NOT visible and loaded');
                return false;
            }
        } catch (error) {
            this.logger.fail(`Failed to view checkout info form: ${error.message}`);
            throw error;
        }
    }
    
    async fillInformation(firstName, lastName, postalCode) {
        try {
            this.logger.step(`Filling checkout information for ${firstName} ${lastName}`);
            await this.page.fill(this.locators.firstNameInput, firstName);
            await this.page.fill(this.locators.lastNameInput, lastName);
            await this.page.fill(this.locators.postalCodeInput, postalCode);
            await this.safeClick(this.locators.continueButton);
            this.logger.pass('Checkout information submitted');
        } catch (error) {
            this.logger.fail(`Failed to fill checkout info: ${error.message}`);
            await this.takeScreenshot(`Checkout-Info_Fill-error-${Date.now()}`);
            throw error;
        }
    }

    async verifySummaryFormVisible(){
        try {
            await this.waitForElement(this.locators.checkoutSummaryContainer);
            const titleVisible = await this.isVisible(this.locators.pageTitle);
            if (titleVisible) {
                this.logger.pass('Checkout: Overview page is visible and loaded');
                return true;
            } else {
                this.logger.fail('Checkout: Overview page is NOT visible and loaded');
                return false;
            }
        } catch (error) {
            this.logger.fail(`Failed to reach summary: ${error.message}`);
            throw error;
        }

    }

    async getProductDetails(productName) {
        try {
            this.logger.step(`Getting details for product "${productName}"`);

            // Find the cart item containing this product
            const cartItem = this.page.locator(this.locators.cartItem)
                .filter({ has: this.page.locator(this.locators.cartItemName, { hasText: productName }) });

            // Get product details
            const name = await cartItem.locator(this.locators.cartItemName).textContent();
            const description = await cartItem.locator(this.locators.cartItemDescription).textContent();
            const price = await cartItem.locator(this.locators.cartItemPrice).textContent();
            const quantity = await cartItem.locator(this.locators.cartQuantity).textContent();

            const details = {
                name: name?.trim(),
                description: description?.trim(),
                price: price?.trim(),
                quantity: quantity?.trim()
            };

            this.logger.pass(`Retrieved details for "${productName}"`);
            this.logger.info(`Details: ${JSON.stringify(details)}`);

            return details;

        } catch (error) {
            this.logger.fail(`Failed to get product details: ${error.message}`);
            throw error;
        }
    }

    async calculateTotalWithTaxFromSubtotal(subTotal) {
        try {
            this.logger.step(`Calculating Total with Tax for Subtotal: $${subTotal}`);
            const taxRate = 0.08;

            // 1. Calculate the tax amount
            const tax = Math.round(subTotal * taxRate * 100) / 100;

            // 2. Calculate the final total
            const total = subTotal + tax;

            // 3. Construct the details object
            const details = {
                subTotal: Number(subTotal.toFixed(2)),
                tax: Number(tax.toFixed(2)),
                total: Number(total.toFixed(2))
            };

            this.logger.step(`Calculation Complete - Tax: $${details.tax}, Total: $${details.total}`);

            return details;

        } catch (error) {
            this.logger.fail(`Failed to calculate total: ${error.message}`);
            throw error;
        }
    }

    async isItemTotalCorrect() {
        try {
            this.logger.step('Verifying Item Total Correct');

            // 1. Get the raw text from the UI
            const subTotalText = await this.page.locator(this.locators.summarySubtotal).textContent();
            const taxText = await this.page.locator(this.locators.summaryTax).textContent();
            const totalText = await this.page.locator(this.locators.summaryTotal).textContent();

            // 2. Helper to extract numbers (converts "Item total: $29.99" -> 29.99)
            const parsePrice = (text) => parseFloat(text.replace(/[^0-9.]/g, ''));

            const uiSubtotal = parsePrice(subTotalText);
            const uiTax = parsePrice(taxText);
            const uiTotal = parsePrice(totalText);

            // 3. Call your calculation function to get expected values
            const expected = await this.calculateTotalWithTaxFromSubtotal(uiSubtotal);

            // 4. Compare UI values to Calculated values
            if (uiTax === expected.tax && uiTotal === expected.total) {
                this.logger.pass(`Totals Match: Subtotal $${uiSubtotal} + Tax $${uiTax} = Total $${uiTotal}`);
                return true; 
            } else {
                this.logger.fail(`Mismatch Found! UI Tax: ${uiTax} (Exp: ${expected.tax}), UI Total: ${uiTotal} (Exp: ${expected.total})`);
                return false;
            }

        } catch (error) {
            this.logger.fail(`Error during verification: ${error.message}`);
            return false; // Return false if the elements aren't found or something breaks
        }
    }


    /**
     * Completes the purchase by clicking the Finish button
     */
    async clickFinish() {
        try {
            this.logger.step('Clicking Finish button on Overview page');
            await this.safeClick(this.locators.finishButton);
            this.logger.pass('Purchase completed');
        } catch (error) {
            this.logger.fail(`Failed to finish checkout: ${error.message}`);
            throw error;
        }
    }

    async isCheckOutCompleteVisible() {
        try {
            this.logger.step('Clicking Finish button on Overview page');
            const titleVisible = await this.isVisible(this.locators.pageTitle);
            if (titleVisible) {
                this.logger.pass('Checkout: Complete page is visible and loaded');
                return true;
            } else {
                this.logger.fail('Checkout: Complete page is NOT visible and loaded');
                return false;
            }
        } catch (error) {
            this.logger.fail(`Failed to finish checkout: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verifies if the order was successful
     * @returns {Promise<boolean>}
     */
    async isOrderComplete() {
        const message = await this.getTextContent(this.locators.completeHeader);
        const completeImageVisible = await this.isVisible(this.locators.orderCompleteImage);
        const isComplete = message === 'Thank you for your order!';

        if (completeImageVisible && isComplete) {
                this.logger.pass('ORDER SUCCESSFULLY COMPLETED');
                return true;
            } else {
                this.logger.fail('ORDER NOT COMPLETED');
                return false;
            }
    }

    async clickBackHomeButton() {
        try {
            this.logger.step('Clicking Back Home button on order complete page');
            await this.safeClick(this.locators.backHomeButton);
            this.logger.pass('Back to Products');
        } catch (error) {
            this.logger.fail(`Failed to Go Back Home: ${error.message}`);
            throw error;
        }
    }

    


    /**
     * Gets total price from the overview page
     * @returns {Promise<string>} e.g. "Total: $53.99"
     */
    async getTotalPrice() {
        return await this.getTextContent(this.locators.summaryTotal);
    }
}