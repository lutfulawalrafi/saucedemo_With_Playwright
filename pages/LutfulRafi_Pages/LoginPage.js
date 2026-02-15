import { expect } from '@playwright/test';
import { BASE_URL } from '../../utils/lutful_constants';


export class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#user-name');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async goto() {
    await this.page.goto(BASE_URL); 
  }

  async login(username, password) {
    if (!username || !password) {
      throw new Error('Username/password is missing. Check Excel data.');
    }
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
