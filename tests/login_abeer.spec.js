const {test, expect} = require('@playwright/test');

test('First test', async ({page})=>{
    await page.goto('https://www.saucedemo.com');
    await page.getByRole('textbox', {name : 'Username'}).fill('standard_user');
    await page.getByRole('textbox', {name : 'Password'}).fill('secret_sauce');
    await page.getByRole('button', {name: 'Login'}).click();
    await page.locator('//select[@class="product_sort_container"]').selectOption('Price (low to high)');
    console.log(await page.locator('//div[@class="inventory_item_name "]').first().textContent());
    await page.locator('//div[@class="inventory_item_description"][contains(., "Backpack")]//button').click();
    await page.locator('//div[@class="inventory_item_description"][contains(., "Onesie")]//button').click();
    console.log(await page.locator('//span[@class="shopping_cart_badge"]').innerText())
    await page.locator('//a[@class="shopping_cart_link"]').click();
    console.log(await page.locator('//div[@class="inventory_item_name"]').allInnerTexts());
    await page.locator('//div[@class="cart_item_label"][contains(.,"Onesie")]//button').click();
    console.log(await page.locator('//div[@class="inventory_item_name"]').allInnerTexts());
    await page.getByRole('button', {name: 'Checkout'}).click();
    await page.getByRole('textbox', {name: 'First Name'}).fill('A');
    await page.getByRole('textbox', {name: 'Last Name'}).fill('K');
    await page.getByRole('textbox', {name: 'Zip/Postal Code'}).fill('1200');
    await page.getByRole('button', {name: 'Continue'}).click();
    await page.getByRole('button', {name: 'Finish'}).click();
    await expect(page.locator('//h2[@class= "complete-header"]')).toContainText('Thank you');
    await page.getByRole('button', {name: 'Back Home'}).click();
    await page.getByRole('button', {name: 'Open Menu'}).click();
    await page.locator('#logout_sidebar_link').click();
    if(await page.getByRole('button', {name :'Login'}).count() > 0){
        console.log("Success");
    }
});
