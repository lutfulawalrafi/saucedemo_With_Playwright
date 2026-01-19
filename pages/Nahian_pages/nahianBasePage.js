import logger from '../../helpers/logger.js';
import globalProperties from '../../utils/nahian_globalProperties.js';

/**
 * BasePage - Base class for all Page Objects
 * Contains common methods and utilities used across all pages
 * Implements safe interaction methods with built-in waits and error handling
 */
export default class BasePage {
    /**
     * Constructor
     * @param {import('@playwright/test').Page} page - Playwright page object
     */
    constructor(page) {
        this.page = page;
        this.logger = logger;
    }

    /**
     * Navigate to a URL
     * @param {string} url - URL to navigate to (can be relative or absolute)
     */
    async goto(url) {
        try {
            logger.step(`Navigating to: ${url}`);
            await this.page.goto(url);
            logger.pass(`Successfully navigated to: ${url}`);
        } catch (error) {
            logger.fail(`Failed to navigate to ${url}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Safe click with wait and error handling
     * @param {string} locator - Element locator
     * @param {Object} options - Click options
     */
    async safeClick(locator, options = {}) {
        try {
            logger.step(`Clicking element: ${locator}`);
            await this.page.locator(locator).click(options);
            logger.pass(`Successfully clicked: ${locator}`);
        } catch (error) {
            logger.fail(`Failed to click ${locator}: ${error.message}`);
            await this.takeScreenshot(`click-error-${Date.now()}`);
            throw error;
        }
    }

    /**
     * Safe fill/type with wait and error handling
     * @param {string} locator - Element locator
     * @param {string} text - Text to type
     * @param {Object} options - Fill options
     */
    async safeFill(locator, text, options = {}) {
        try {
            logger.step(`Filling element ${locator} with: ${text}`);
            await this.page.locator(locator).fill(text, options);
            logger.pass(`Successfully filled ${locator}`);
        } catch (error) {
            logger.fail(`Failed to fill ${locator}: ${error.message}`);
            await this.takeScreenshot(`fill-error-${Date.now()}`);
            throw error;
        }
    }

    /**
     * Wait for URL to match pattern
     * @param {string|RegExp} urlPattern - URL pattern to wait for
     * @param {Object} options - Wait options
     */
    async waitForURL(urlPattern, options = {}) {
        try {
            logger.step(`Waiting for URL: ${urlPattern}`);
            await this.page.waitForURL(urlPattern, { timeout: 10000, ...options });
            logger.pass(`URL matched: ${urlPattern}`);
        } catch (error) {
            logger.fail(`URL wait timeout for ${urlPattern}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Wait for element to be visible
     * @param {string} locator - Element locator
     * @param {number} timeout - Timeout in milliseconds
     */
    async waitForElement(locator, timeout = globalProperties.global_wait) {
        try {
            logger.step(`Waiting for element: ${locator}`);
            await this.page.locator(locator).waitFor({ state: 'visible', timeout });
            logger.pass(`Element visible: ${locator}`);
        } catch (error) {
            logger.fail(`Element not visible ${locator}: ${error.message}`);
            await this.takeScreenshot(`element-wait-error-${Date.now()}`);
            throw error;
        }
    }

    /**
     * Take screenshot on demand
     * @param {string} name - Screenshot name
     */
    async takeScreenshot(name) {
        try {
            const screenshotPath = `test-results/screenshots/${name}.png`;
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
            logger.info(`Screenshot saved: ${screenshotPath}`);
        } catch (error) {
            logger.warn(`Failed to take screenshot: ${error.message}`);
        }
    }

    /**
     * Get current page title
     * @returns {Promise<string>} Page title
     */
    async getTitle() {
        try {
            const title = await this.page.title();
            logger.info(`Page title: ${title}`);
            return title;
        } catch (error) {
            logger.fail(`Failed to get page title: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get current URL
     * @returns {string} Current URL
     */
    getCurrentURL() {
        const url = this.page.url();
        logger.info(`Current URL: ${url}`);
        return url;
    }

    /**
     * Get element text content
     * @param {string} locator - Element locator
     * @returns {Promise<string>} Element text
     */
    async getTextContent(locator) {
        try {
            logger.step(`Getting text from: ${locator}`);
            const text = await this.page.locator(locator).textContent();
            logger.pass(`Text retrieved: ${text}`);
            return text;
        } catch (error) {
            logger.fail(`Failed to get text from ${locator}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Check if element is visible
     * @param {string} locator - Element locator
     * @returns {Promise<boolean>} True if visible
     */
    async isVisible(locator) {
        try {
            const visible = await this.page.locator(locator).isVisible();
            logger.info(`Element ${locator} visible: ${visible}`);
            return visible;
        } catch (error) {
            logger.warn(`Error checking visibility of ${locator}: ${error.message}`);
            return false;
        }
    }

    /**
     * Wait for page load state
     * @param {string} state - Load state ('load', 'domcontentloaded', 'networkidle')
     */
    async waitForLoadState(state = 'load') {
        try {
            logger.step(`Waiting for page load state: ${state}`);
            await this.page.waitForLoadState(state);
            logger.pass(`Page load state reached: ${state}`);
        } catch (error) {
            logger.fail(`Failed to reach load state ${state}: ${error.message}`);
            throw error;
        }
    }
}
