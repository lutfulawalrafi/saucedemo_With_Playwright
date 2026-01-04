import { test, expect } from '@playwright/test';

test('Add Sauce Labs Bolt T-Shirt to cart and verify', async ({ page }) => {
  

  //login using username and password
  await page.goto('https://www.saucedemo.com/');
  await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
  await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
  await page.getByRole('button', { name: 'Login' }).click();

  //click and add to cart
  await page.getByText('Sauce Labs Bolt T-Shirt', { exact: true }).click();  
  await page.getByRole('button', { name: 'Add to cart' }).click();

  //  Open the shopping cart and verify
  await page.locator('[data-test="shopping-cart-link"]').click();
  await expect(page.getByText('Sauce Labs Bolt T-Shirt', { exact: true }))
    .toHaveText('Sauce Labs Bolt T-Shirt');  

});