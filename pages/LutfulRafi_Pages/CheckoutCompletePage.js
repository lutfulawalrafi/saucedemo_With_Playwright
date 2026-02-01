import { expect } from '@playwright/test';

export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Checkout: Complete!"
    this.confirmationMsg = page.locator('.complete-header'); // "Thank you for your order!"
    this.completeIcon = page.locator('.pony_express'); // image/icon
    this.backHomeButton = page.locator('#back-to-products');
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Checkout: Complete!');
  }

  async expectConfirmationMessage(text) {
    await expect(this.confirmationMsg).toHaveText(text);
  }

  async expectIconVisible() {
    await expect(this.completeIcon).toBeVisible();
  }

  async backToHome() {
    await this.backHomeButton.click();
  }
}