import { expect } from '@playwright/test';

export class CheckoutInfoPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Checkout: Your Information"
    this.firstName = page.locator('#first-name');
    this.lastName = page.locator('#last-name');
    this.postalCode = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
  }

  async expectLoaded() {
    await expect(this.title).toHaveText('Checkout: Your Information');
  }

  async fillAndContinue(first, last, zip) {
    await this.firstName.fill(first);
    await this.lastName.fill(last);
    await this.postalCode.fill(zip);
    await this.continueButton.click();
  }
}