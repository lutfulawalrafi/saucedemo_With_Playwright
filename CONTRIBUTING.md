# Contributing to SauceDemo Playwright Framework

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)

---

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

---

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button on GitHub to create your own copy of the repository.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/saucedemo.git
cd saucedemo
```

### 3. Add Upstream Remote

```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/saucedemo.git
```

### 4. Install Dependencies

```bash
npm install
npx playwright install
```

### 5. Verify Setup

```bash
npm test
```

---

## 🔄 Development Workflow

### 1. Sync Your Fork

Before starting new work, sync with upstream:

```bash
git checkout main
git pull upstream main
git push origin main
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

**Branch Naming Convention:**
- `feature/` - New features (e.g., `feature/add-cart-page`)
- `fix/` - Bug fixes (e.g., `fix/login-timeout`)
- `docs/` - Documentation (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-waits`)
- `test/` - Test additions (e.g., `test/add-checkout-tests`)

### 3. Make Changes

- Write clean, readable code
- Follow existing code structure
- Add comments for complex logic
- Update documentation as needed

### 4. Test Your Changes

```bash
# Run all tests
npm test

# Run smoke tests
npm run test:smoke

# Run specific test
npx playwright test tests/your-test.spec.js
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: Add your feature description"
```

See [Commit Message Guidelines](#commit-message-guidelines) below.

### 6. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

---

## 📝 Pull Request Process

### Step 1: Create Pull Request

1. Go to your fork on GitHub
2. Click **"Compare & pull request"**
3. Select base repository and branch
4. Fill in the PR template

### Step 2: PR Template

Use this template for your pull request:

```markdown
## 📋 Description

Brief description of what this PR does and why.

## 🔧 Type of Change

- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📝 Documentation update
- [ ] ♻️ Code refactoring
- [ ] ✅ Test addition/update

## 🎯 Changes Made

- Added CartPage.js with locators and methods
- Created cart.spec.js with 5 test cases
- Updated README with cart testing documentation
- Added cart test data to Excel file

## 🧪 Testing Done

- [ ] All existing tests pass
- [ ] New tests added and passing
- [ ] Tested on Chromium
- [ ] Tested on Firefox
- [ ] Tested on WebKit
- [ ] Manual testing completed

## 📸 Screenshots (if applicable)

[Add screenshots of test results or new features]

## ✅ Checklist

- [ ] My code follows the project's coding standards
- [ ] I have added tests that prove my fix/feature works
- [ ] I have updated the documentation accordingly
- [ ] All tests are passing
- [ ] I have added JSDoc comments for new methods
- [ ] I have updated test data if needed
```

### Step 3: Code Review

- Maintainers will review your PR
- Address feedback and comments
- Make requested changes:

```bash
# Make changes based on feedback
git add .
git commit -m "fix: Address review comments"
git push origin feature/your-feature-name
```

### Step 4: Merge

Once approved, your PR will be merged into the main branch.

---

## 💻 Coding Standards

### JavaScript Style

```javascript
// ✅ Good: Use ES6+ features
const credentials = excelReader.getLoginCredentials(0);
const { username, password } = credentials;

// ❌ Bad: Avoid var
var username = 'test';

// ✅ Good: Use arrow functions
const login = async (index) => {
  await loginPage.doLogin(username, password);
};

// ✅ Good: Use template literals
logger.step(`Logging in with user: ${username}`);

// ❌ Bad: String concatenation
logger.step('Logging in with user: ' + username);
```

### Naming Conventions

```javascript
// Classes: PascalCase
class LoginPage extends BasePage {}

// Functions/Methods: camelCase
async doLogin(username, password) {}

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Variables: camelCase
const isLoginSuccessful = true;
```

### File Structure

```javascript
// 1. Imports
import { test, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';

// 2. Constants
const TIMEOUT = 30000;

// 3. Helper functions
function formatDate(date) {}

// 4. Main code
test.describe('Test Suite', () => {
  // tests here
});
```

### JSDoc Comments

```javascript
/**
 * Perform login action
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 * @returns {Promise<void>}
 */
async doLogin(username, password) {
  // implementation
}
```

---

## 🧪 Testing Guidelines

### Test Structure (AAA Pattern)

```javascript
test('should do something', async ({ page }) => {
  // ARRANGE - Set up test data and preconditions
  const testData = getTestData();
  
  // ACT - Perform the action being tested
  await page.click('#button');
  
  // ASSERT - Verify the expected outcome
  expect(await page.textContent('#result')).toBe('Success');
});
```

### Test Naming

```javascript
// ✅ Good: Descriptive test names
test('should display error message when login fails with invalid credentials', async () => {});

// ❌ Bad: Vague test names
test('test login', async () => {});
```

### Using Fixtures

```javascript
// ✅ Good: Use fixtures for common setup
test('my test', async ({ loginPage, dashboardPage, login }) => {
  await login(0);
  await dashboardPage.verifyDashboardVisible();
});

// ❌ Bad: Duplicate setup in every test
test('my test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLoginPage();
  // ... repeated setup
});
```

### Test Data

```javascript
// ✅ Good: Use Excel data
const credentials = excelReader.getLoginCredentials(0);

// ❌ Bad: Hard-coded data
const username = 'standard_user';
const password = 'secret_sauce';
```

---

## 📝 Commit Message Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(cart): Add CartPage object and cart tests"

# Bug fix
git commit -m "fix(login): Fix timeout issue on slow networks"

# Documentation
git commit -m "docs(readme): Update installation instructions"

# Test
git commit -m "test(checkout): Add checkout flow tests"

# Refactor
git commit -m "refactor(pages): Optimize wait strategies"
```

### Good Commit Messages

```bash
✅ feat(dashboard): Add product filtering functionality
✅ fix(login): Handle locked out user error correctly
✅ docs(contributing): Add PR process guidelines
✅ test(cart): Add tests for cart operations
```

### Bad Commit Messages

```bash
❌ update
❌ fix bug
❌ changes
❌ wip
```

---

## 🎯 What to Contribute

### High Priority

- 🔴 Bug fixes
- 🔴 Test coverage improvements
- 🔴 Documentation improvements

### Medium Priority

- 🟡 New page objects (Cart, Checkout, etc.)
- 🟡 Additional test scenarios
- 🟡 Performance optimizations

### Low Priority

- 🟢 Code refactoring
- 🟢 Additional utilities
- 🟢 CI/CD improvements

---

## 📚 Resources

### Framework Documentation

- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick reference guide
- [LOGIN_FLOW.md](LOGIN_FLOW.md) - Login flow explanation
- [CART_TEST_FLOW.md](CART_TEST_FLOW.md) - Cart test flow explanation

### External Resources

- [Playwright Documentation](https://playwright.dev)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Git Documentation](https://git-scm.com/doc)

---

## ❓ Questions?

If you have questions:

1. Check existing documentation
2. Search existing issues
3. Create a new issue with the `question` label
4. Join discussions on GitHub Discussions

---

## 🎉 Thank You!

Thank you for contributing to this project! Your efforts help make this framework better for everyone.

---

**Happy Contributing! 🚀**
