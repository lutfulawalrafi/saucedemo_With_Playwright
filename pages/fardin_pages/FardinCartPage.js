import BasePage from './FardinBasePage';

/**
 * CartPage - Page Object for SauceDemo Shopping Cart Page
 * Handles all interactions with the shopping cart page
 */
export default class CartPage extends BasePage {
    /**
     * Constructor
     * @param {import('@playwright/test').Page} page - Playwright page object
     */
    constructor(page) {
        super(page);

        // Define locators for cart page elements
        this.locators = {
            pageTitle: '.title',
            cartList: '.cart_list',
            cartItem: '.cart_item',
            cartItemName: '.inventory_item_name',
            cartItemDescription: '.inventory_item_desc',
            cartItemPrice: '.inventory_item_price',
            cartQuantity: '.cart_quantity',
            removeButton: 'button[id^="remove"]',
            continueShoppingButton: '#continue-shopping',
            checkoutButton: '#checkout'
        };
    }

    /**
     * Verify cart page is visible
     * @returns {Promise<boolean>} True if cart page is visible
     */
    async verifyCartPageVisible() {
        this.logger.step(`Verifying cart page is visible`);

        return await this.isPageVisible(
            this.locators.pageTitle,                  
            this.locators.cartList,  
            'Cart'
        );
    }

    /**
     * Get cart page title
     * @returns {Promise<string>} Cart page title
     */
    async getCartPageTitle() {
        try {
            const title = await this.getTextContent(this.locators.pageTitle);
            this.logger.info(`Cart page title: ${title}`);
            return title;
        } catch (error) {
            this.logger.fail(`Failed to get cart page title: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get count of items in cart
     * @returns {Promise<number>} Number of items in cart
     */
    async getCartItemCount() {
        try {
            this.logger.step('Counting items in cart');
            const items = await this.page.locator(this.locators.cartItem).all();
            const count = items.length;
            this.logger.pass(`Found ${count} items in cart`);
            return count;
        } catch (error) {
            this.logger.fail(`Failed to count cart items: ${error.message}`);
            throw error;
        }
    }

    /**
     * Check if a specific product is in the cart
     * @param {string} productName - Name of the product to check
     * @returns {Promise<boolean>} True if product is in cart
     */
    async isProductInCart(productName) {
        try {
            this.logger.step(`Checking if product "${productName}" is in cart`);

            const productLocator = this.page.locator(this.locators.cartItemName, { hasText: productName });
            const isVisible = await productLocator.isVisible();

            if (isVisible) {
                this.logger.pass(`Product "${productName}" is in cart`);
            } else {
                this.logger.warn(`Product "${productName}" is NOT in cart`);
            }

            return isVisible;

        } catch (error) {
            this.logger.fail(`Failed to check if product is in cart: ${error.message}`);
            return false;
        }
    }

    /**
     * Get product details from cart
     * @param {string} productName - Name of the product
     * @returns {Promise<Object>} Product details (name, description, price, quantity)
     */
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

    /**
     * Get all product names in cart
     * @returns {Promise<Array<string>>} Array of product names
     */
    async getAllProductNamesInCart() {
        try {
            this.logger.step(`Getting all product names in cart`);
            const productNames = await this.page.locator(this.locators.cartItemName).allTextContents();
            this.logger.pass(`Retrieved ${productNames.length} product names from cart`);
            return productNames;
        } catch (error) {
            this.logger.fail(`Failed to get product names from cart: ${error.message}`);
            throw error;
        }
    }

    /**
     * Remove a product from cart by name
     * @param {string} productName - Name of the product to remove
     */
    async removeProductFromCart(productName) {
        try {
            this.logger.step(`Removing product "${productName}" from cart`);

            // Find the cart item containing this product
            const cartItem = this.page.locator(this.locators.cartItem)
                .filter({ has: this.page.locator(this.locators.cartItemName, { hasText: productName }) });

            // Click the remove button
            await cartItem.locator(this.locators.removeButton).click();

            this.logger.pass(`Successfully removed "${productName}" from cart`);

            // Wait a moment for the cart to update
            await this.page.waitForTimeout(500);

        } catch (error) {
            this.logger.fail(`Failed to remove product from cart: ${error.message}`);
            throw error;
        }
    }

    /**
     * Click continue shopping button
     */
    async clickContinueShopping() {
        try {
            this.logger.step(`Clicking continue shopping button`);
            await this.safeClick(this.locators.continueShoppingButton);
            this.logger.pass(`Navigated back to products page`);
        } catch (error) {
            this.logger.fail(`Failed to click continue shopping: ${error.message}`);
            throw error;
        }
    }

    /**
     * Click checkout button
     */
    async clickCheckout() {
        try {
            this.logger.step(`Clicking checkout button`);
            await this.safeClick(this.locators.checkoutButton);
            this.logger.pass(`Navigated to checkout page`);
        } catch (error) {
            this.logger.fail(`Failed to click checkout: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verify cart is empty
     * @returns {Promise<boolean>} True if cart is empty
     */
    async isCartEmpty() {
        const count = await this.getCartItemCount();
        const isEmpty = count === 0;

        if (isEmpty) {
            this.logger.pass('Cart is empty');
        } else {
            this.logger.info(`Cart has ${count} items`);
        }

        return isEmpty;
    }

    /**
     * Verify user is on cart page
     * @returns {Promise<boolean>} True if on cart page
     */
    async isOnCartPage() {
        const expectedUrl = 'cart.html' ;
        const pageName = 'Cart' ;

        return await this.isOnPage(expectedUrl, pageName);
    }
}
