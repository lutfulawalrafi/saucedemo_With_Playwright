module.exports = {
  BASE_URL: 'https://www.saucedemo.com/',
  PRODUCT_NAMES: {
    FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  },
  DEFAULT_USER: {
    username: process.env.SAUCE_USERNAME || 'standard_user',
    password: process.env.SAUCE_PASSWORD || 'secret_sauce',
  },
  CHECKOUT_USER: {
    firstName: 'Test',
    lastName: 'User',
    postalCode: '12345',
  },
};