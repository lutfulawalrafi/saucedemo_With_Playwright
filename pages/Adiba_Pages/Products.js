export class Products {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');

    this.addToCart = page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
    this.cart = page.locator('[data-test="shopping-cart-link"]');
    this.quantity = page.locator('[data-test="item-quantity"]');
  }
 
  async locateProduct(productName) {
    const product = this.page.locator('.inventory_item').filter({
        hasText: productName
    });
    return product;
  }

  async addProductToCart(product) {
    await product.getByRole('button', { name: 'Add to cart' }).click();
  }

  async removeFromCart(product) {
    await product.getByRole('button', { name: 'Remove' }).click();
  }

  async goToCart(cartIcon) {
    await cartIcon.click();
  }
}