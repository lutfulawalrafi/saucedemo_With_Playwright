import { expect } from '@playwright/test';
import { extractPrice } from '../../helpers/lutful_helper.js'


export class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Checkout: Overview"
    this.finishButton = page.locator('#finish');
    this.itemTotal = page.locator('.summary_subtotal_label'); // "Item total: $xx.xx"
  }

  getTitle() {
    return this.title;
  }

  overviewItemByName(name) {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  getOverviewItemName(name) {
    return this.overviewItemByName(name).locator('.inventory_item_name');
  }

  getOverviewItemQty(name) {
    return this.overviewItemByName(name).locator('.cart_quantity');
  }

  getOverviewItemPrice(name) {
    return this.overviewItemByName(name).locator('.inventory_item_price');
  }

  getItemTotal() {
    return this.itemTotal;
  }

  async getItemTotalPrice() {
    const totalText = (await this.itemTotal.innerText()).trim(); // "Item total: $49.99"
    return extractPrice(totalText);
  }

  async finish() {
    await this.finishButton.click();
  }
}