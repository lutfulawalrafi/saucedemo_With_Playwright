import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Your Cart"
    this.checkoutButton = page.locator('#checkout');
  }

  async expectLoaded(){
    await expect(this.title).toHaveText('Your Cart');
  }

  cartItemByName(name) {
    return this.page.locator('.cart_item').filter({ hasText: name });
  }
 
  async expectItemDetails(name, qty, expectedPrice) {
    const item = this.cartItemByName(name);

    await expect(item.locator('.inventory_item_name')).toHaveText(name);
    await expect(item.locator('.cart_quantity')).toHaveText(String(qty));
    await expect(item.locator('.inventory_item_price')).toHaveText(expectedPrice);
  }

  async checkout() {
    await this.checkoutButton.click();
  }

}