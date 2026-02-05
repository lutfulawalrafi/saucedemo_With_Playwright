export class Checkout {
  constructor(page) {
    this.page = page;

    this.pageTitle = page.locator('[data-test="title"]');
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.zipCode = page.locator('[data-test="postalCode"]');

    this.continueButton = page.locator('[data-test="continue"]');
  }
  async fillYourInfo(firstName, lastName, zipCode) {
    await this.firstName.click();
    await this.firstName.fill(firstName);
   
    await this.lastName.click();
    await this.lastName.fill(lastName);

    await this.zipCode.click();
    await this.zipCode.fill(zipCode);
   
    await this.continueButton.click();
  }
}