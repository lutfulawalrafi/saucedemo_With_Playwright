import BasePage from '../BasePage.js';

/**
 * DashboardPage - Page Object for SauceDemo Inventory/Dashboard Page
 * Handles all interactions with the main dashboard after login
 */
export default class DashboardPage extends BasePage {
    /**
     * Constructor
     * @param {import('@playwright/test').Page} page - Playwright page object
     */
    constructor(page) {
        super(page);

        // Define locators for dashboard page elements
        this.locators = {
            pageTitle: '.title',
            inventoryContainer: '.inventory_container', // Changed from #inventory_container to avoid strict mode violation
            inventoryList: '.inventory_list',
            inventoryItem: '.inventory_item',
            inventoryItemName: '.inventory_item_name',
            shoppingCartLink: '.shopping_cart_link',
            shoppingCartBadge: '.shopping_cart_badge',
            inventoryItemPrice: '.inventory_item_price',
            addToCartButton: 'button[id^="add-to-cart"]',
            removeFromCartButton: 'button[id^="remove"]',
            hamburgerMenu: '#react-burger-menu-btn',
            logoutLink: '#logout_sidebar_link',
            appLogo: '.app_logo',
            productSortContainer: '.product_sort_container'
        };
    }

    /**
     * Verify dashboard page is visible
     * @returns {Promise<boolean>} True if dashboard is visible
     */
    async verifyDashboardVisible() {
        try {
            this.logger.step('Verifying dashboard page is visible');

            // Wait for inventory container to be visible
            await this.waitForElement(this.locators.inventoryContainer, 15000);

            // Check if key elements are visible
            const titleVisible = await this.isVisible(this.locators.pageTitle);
            const inventoryVisible = await this.isVisible(this.locators.inventoryList);

            if (titleVisible && inventoryVisible) {
                this.logger.pass('Dashboard page is visible and loaded');
                return true;
            } else {
                this.logger.fail('Dashboard page elements not visible');
                return false;
            }

        } catch (error) {
            this.logger.fail(`Failed to verify dashboard: ${error.message}`);
            await this.takeScreenshot(`dashboard-verification-error-${Date.now()}`);
            throw error;
        }
    }

    /**
     * Get dashboard page title text
     * @returns {Promise<string>} Dashboard title text
     */
    async getDashboardTitle() {
        try {
            const title = await this.getTextContent(this.locators.pageTitle);
            this.logger.info(`Dashboard title: ${title}`);
            return title;
        } catch (error) {
            this.logger.fail(`Failed to get dashboard title: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get count of products displayed
     * @returns {Promise<number>} Number of products
     */
    async getProductCount() {
        try {
            this.logger.step('Counting products on dashboard');
            const products = await this.page.locator(this.locators.inventoryItem).all();
            const count = products.length;
            this.logger.pass(`Found ${count} products on dashboard`);
            return count;
        } catch (error) {
            this.logger.fail(`Failed to count products: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verify expected number of products are displayed
     * @param {number} expectedCount - Expected product count
     * @returns {Promise<boolean>} True if count matches
     */
    async verifyProductCount(expectedCount) {
        const actualCount = await this.getProductCount();
        const matches = actualCount === expectedCount;

        if (matches) {
            this.logger.pass(`Product count matches expected: ${expectedCount}`);
        } else {
            this.logger.fail(`Product count mismatch. Expected: ${expectedCount}, Actual: ${actualCount}`);
        }

        return matches;
    }

    /**
     * Check if shopping cart is visible
     * @returns {Promise<boolean>} True if cart is visible
     */
    async isShoppingCartVisible() {
        return await this.isVisible(this.locators.shoppingCartLink);
    }

    /**
     * Open hamburger menu
     */
    async openHamburgerMenu() {
        await this.safeClick(this.locators.hamburgerMenu);
        await this.waitForElement(this.locators.logoutLink);
        this.logger.pass('Hamburger menu opened');
    }

    /**
     * Logout from application
     */
    async logout() {
        try {
            this.logger.step('Logging out from application');
            await this.openHamburgerMenu();
            await this.safeClick(this.locators.logoutLink);
            this.logger.pass('Successfully logged out');
        } catch (error) {
            this.logger.fail(`Logout failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verify user is on dashboard page
     * @returns {Promise<boolean>} True if on dashboard
     */
    async isOnDashboard() {
        const url = this.getCurrentURL();
        const onInventoryPage = url.includes('inventory.html');

        if (onInventoryPage) {
            this.logger.pass('User is on dashboard/inventory page');
        } else {
            this.logger.warn('User is NOT on dashboard page');
        }

        return onInventoryPage;
    }

    /**
     * Get all product names
     * @returns {Promise<Array<string>>} Array of product names
     */
    async getAllProductNames() {
        try {
            this.logger.step('Retrieving all product names');
            const productNames = await this.page.locator('.inventory_item_name').allTextContents();
            this.logger.pass(`Retrieved ${productNames.length} product names`);
            return productNames;
        } catch (error) {
            this.logger.fail(`Failed to get product names: ${error.message}`);
            throw error;
        }
    }

    /**
     * Check if a specific product is displayed on the page
     * @param {string} productName - Name of the product to check
     * @returns {Promise<boolean>} True if product is displayed
     */
    async isProductDisplayed(productName) {
        try {
            this.logger.step(`Checking if product "${productName}" is displayed`);
            const productLocator = this.page.locator(this.locators.inventoryItemName, { hasText: productName });
            const isVisible = await productLocator.isVisible();

            if (isVisible) {
                this.logger.pass(`Product "${productName}" is displayed`);
            } else {
                this.logger.warn(`Product "${productName}" is NOT displayed`);
            }

            return isVisible;
        } catch (error) {
            this.logger.fail(`Failed to check product visibility: ${error.message}`);
            return false;
        }
    }

    /**
     * Add a specific product to cart by name
     * @param {string} productName - Name of the product to add
     */
    async addProductToCartByName(productName) {
        try {
            this.logger.step(`Adding product "${productName}" to cart`);

            // Find the product container by product name
            const productContainer = this.page.locator(this.locators.inventoryItem)
                .filter({ has: this.page.locator(this.locators.inventoryItemName, { hasText: productName }) });

            // Find and click the add to cart button within that product container
            const addToCartButton = productContainer.locator(this.locators.addToCartButton);
            await addToCartButton.click();

            this.logger.pass(`Successfully added "${productName}" to cart`);

            // Wait a moment for the cart to update
            await this.page.waitForTimeout(500);

        } catch (error) {
            this.logger.fail(`Failed to add product to cart: ${error.message}`);
            await this.takeScreenshot(`add-to-cart-error-${Date.now()}`);
            throw error;
        }
    }

    async addToCartSwitchedToRemove(productName) {
        try {
            this.logger.step(`Adding product "${productName}" to cart`);

            // Find the product container by product name
            const productContainer = this.page.locator(this.locators.inventoryItem)
                .filter({ has: this.page.locator(this.locators.inventoryItemName, { hasText: productName }) });
                
            const removeButton = productContainer.locator(this.locators.removeFromCartButton);
            const removeVisible = await removeButton.isVisible();

            if (removeVisible) {
                this.logger.pass(`For Product "${productName}" , remove button is displayed`);
            } else {
                this.logger.warn(`For Product "${productName}" , remove button is NOT displayed`);
            }

            return removeVisible;

        } catch (error) {
            this.logger.fail(`Adding to cart didn't witch to remove: ${error.message}`);
            await this.takeScreenshot(`switch-to-remove-error-${Date.now()}`);
            throw error;
        }
    }

    async getProductPrice(productName) {
        try {
            this.logger.step(`finding product price for "${productName}" in dashboard`);

            // Find the product container by product name
            const productContainer = this.page.locator(this.locators.inventoryItem)
                .filter({ has: this.page.locator(this.locators.inventoryItemName, { hasText: productName }) });

            // Find and click the add to cart button within that product container
            const productPricetext = await productContainer.locator(this.locators.inventoryItemPrice).textContent();

            this.logger.pass(`Product Price "${productPricetext}" in dashboard`);

            // Wait a moment for the cart to update
            await this.page.waitForTimeout(500);
            const productPrice= productPricetext.trim();
            return productPrice;

        } catch (error) {
            this.logger.fail(`Failed to find product price: ${error.message}`);
            await this.takeScreenshot(`add-to-cart-error-${Date.now()}`);
            throw error;
        }
    }

    /**
     * Get cart badge count
     * @returns {Promise<number>} Number of items in cart (0 if badge not visible)
     */
    async getCartBadgeCount() {
        try {
            this.logger.step('Getting cart badge count');

            const badgeVisible = await this.isVisible(this.locators.shoppingCartBadge);

            if (badgeVisible) {
                const badgeText = await this.getTextContent(this.locators.shoppingCartBadge);
                const count = parseInt(badgeText, 10);
                this.logger.pass(`Cart badge count: ${count}`);
                return count;
            } else {
                this.logger.info('Cart badge not visible (cart is empty)');
                return 0;
            }

        } catch (error) {
            this.logger.fail(`Failed to get cart badge count: ${error.message}`);
            return 0;
        }
    }

    /**
     * Verify cart badge shows expected count
     * @param {number} expectedCount - Expected cart count
     * @returns {Promise<boolean>} True if count matches
     */
    async verifyCartBadgeCount(expectedCount) {
        const actualCount = await this.getCartBadgeCount();
        const matches = actualCount === expectedCount;

        if (matches) {
            this.logger.pass(`Cart badge count matches expected: ${expectedCount}`);
        } else {
            this.logger.fail(`Cart badge count mismatch. Expected: ${expectedCount}, Actual: ${actualCount}`);
        }

        return matches;
    }

    /**
     * Click on shopping cart icon to navigate to cart page
     */
    async clickCartIcon() {
        try {
            this.logger.step('Clicking shopping cart icon');
            await this.safeClick(this.locators.shoppingCartLink);
            this.logger.pass('Navigated to cart page');
        } catch (error) {
            this.logger.fail(`Failed to click cart icon: ${error.message}`);
            throw error;
        }
    }
}

