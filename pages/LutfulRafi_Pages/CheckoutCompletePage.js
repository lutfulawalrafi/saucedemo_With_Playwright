import { expect } from '@playwright/test';

export class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Checkout: Complete!"
    this.confirmationMsg = page.locator('.complete-header'); // "Thank you for your order!"
    this.completeIcon = page.locator('.pony_express'); // image/icon
    this.backHomeButton = page.locator('#back-to-products');
  }

  async getTitleText() {
    return (await this.title.innerText()).trim();
  }

  async getConfirmationMessage(text) {
    return (await this.confirmationMsg.innerText()).trim();
  }

  async isIconVisible() {
    return await this.completeIcon.isVisible();
  }

  async backToHome() {
    await this.backHomeButton.click();
  }
}
