import { expect } from '@playwright/test';
//import { extractPriceFromLabel, parsePrice } from '../../helpers/lutful_helper.js'


export class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Checkout: Overview"
    this.finishButton = page.locator('#finish');
    this.itemTotal = page.locator('.summary_subtotal_label'); // "Item total: $xx.xx"
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  overviewItemByName(name) {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }

  async expectOverviewDetails(name, qty, expectedPrice) {
    const item = this.overviewItemByName(name);

    await expect(item.locator('.inventory_item_name')).toHaveText(name);
    await expect(item.locator('.cart_quantity')).toHaveText(String(qty));
    await expect(item.locator('.inventory_item_price')).toHaveText(expectedPrice);
  }

  async expectItemTotalEqualsPrice(expectedPrice) {
    const totalText = (await this.itemTotal.innerText()).trim(); // "Item total: $49.99"
    await expect(this.itemTotal).toContainText(expectedPrice);

    const match = totalText.match(/\$[\d.]+/);
    expect(match && match[0]).toBe(expectedPrice);
  }

  async finish() {
    await this.finishButton.click();
  }
}