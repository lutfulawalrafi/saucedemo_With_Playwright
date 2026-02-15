import { expect } from '@playwright/test';

export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Products"
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }


  productCardByName(name) {
    const nameEl = this.page.locator('.inventory_item_name', { hasText: name });
    return this.page.locator('.inventory_item').filter({ has: nameEl });
  }


  getTitle() {
    return this.title;
  }

  getProductCard(name) {
    return this.productCardByName(name);
  }

  getRemoveButton(name) {
    return this.productCardByName(name).getByRole('button', { name: 'Remove' });
  }

  getCartBadge() {
    return this.cartBadge;
  }


  async addToCart(name) {
    const addBtn = this.productCardByName(name).getByRole('button', { name: /add to cart/i });
    await addBtn.click();
  }

  async goToCart(){
    await this.cartIcon.click();
  }

  async getProductPrice(name) {
  const price = this.productCardByName(name).locator('.inventory_item_price');
  const txt = await price.innerText();
  return txt.trim();
}



}
