import { expect } from '@playwright/test';

export class InventoryPage {
  constructor(page) {
    this.page = page;
    this.title = page.locator('.title'); // "Products"
    this.cartIcon = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  //checks if page is loaded
  async expectLoaded(){
    await expect(this.title).toHaveText('Products');
  }

  productCardByName(name) {
    return this.page.locator('.inventory_item').filter({ hasText: name });
  }



  async expectProductVisible(name) {
    await expect(this.productCardByName(name)).toBeVisible();
  }


  async addToCart(name) {
    const addBtn = this.productCardByName(name).getByRole('button', { name: /add to cart/i });
    await addBtn.click();
  }

  async expectButtonChangedToRemove(name) {
    const removeBtn = this.productCardByName(name).getByRole('button', { name: /remove/i });
    await expect(removeBtn).toBeVisible();
  }

  async  expectCartBadgeCount(count){
    await expect(this.cartBadge).toHaveText(String(count));
  }


  async goToCart(){
    await this.cartIcon.click();
  }

  async getProductPrice(name) {
  const price = this.productCardByName(name)
    .locator('.inventory_item_price');

  await expect(price).toBeVisible(); 

  const txt = await price.innerText();
  return txt.trim();
}



}
