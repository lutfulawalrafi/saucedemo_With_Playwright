export class CheckoutOverview {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');
    this.productName = page.locator('[data-test="item-5-title-link"]');
    this.productQuantity = page.locator('[data-test="item-quantity"]');
    this.productPrice = page.locator('[data-test="inventory-item-price"]');
    this.totalPrice = page.locator('[data-test="total-label"]');

    this.finishButton = page.locator('[data-test="finish"]');
  }
  async finishBuy() {
    await this.finishButton.click();
  }
}