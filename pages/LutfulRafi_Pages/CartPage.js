import { expect } from '@playwright/test';

export class CartPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title');
    this.checkoutButton = page.locator('#checkout');
    this.cartItems = page.locator('.cart_item');

    this.itemName = '.inventory_item_name';
    this.itemQty = '.cart_quantity';
    this.itemPrice = '.inventory_item_price';
  }

    getTitle() {
  return this.title;
  }

  cartItemByName(name) {
    return this.cartItems.filter({ hasText: name });
  }
 
  getItemName(name) {
    return this.cartItemByName(name).locator(this.itemName);
  }

  getItemQty(name) {
    return this.cartItemByName(name).locator(this.itemQty);
  }

  getItemPrice(name) {
    return this.cartItemByName(name).locator(this.itemPrice);
  }

  async checkout() {
    await this.checkoutButton.click();
  }

}