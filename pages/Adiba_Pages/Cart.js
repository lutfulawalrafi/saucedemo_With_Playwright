export class Cart {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');
    this.quantity = page.locator('[data-test="item-quantity"]');
    this.cartProduct = page.locator('[data-test="item-5-title-link"]');
    this.price = page.locator('[data-test="inventory-item-price"]');
    this.checkout = page.locator('[data-test="checkout"]');
  }

  async checkoutProdcut() {
    await this.checkout.click();
  }
}