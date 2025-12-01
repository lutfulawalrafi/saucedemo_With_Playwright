# 🚀 SauceDemo Playwright Automation Framework

[![Playwright](https://img.shields.io/badge/Playwright-1.40.0-45ba4b?logo=playwright)](https://playwright.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running Tests](#running-tests)
- [Test Data Management](#test-data-management)
- [Framework Architecture](#framework-architecture)
- [Reporting](#reporting)
- [Contributing](#contributing)
- [Pull Request Process](#pull-request-process)
- [Troubleshooting](#troubleshooting)
- [Learning Resources](#learning-resources)

---

## 📖 Overview

This is an **enterprise-grade Playwright automation framework** for testing [SauceDemo](https://www.saucedemo.com/). Built with modern JavaScript (ES Modules), this framework demonstrates industry best practices and is designed for both learning and production use.

**Target Audience:** QA Engineers, Automation Testers, Teams learning Playwright

**Application Under Test:** https://www.saucedemo.com/

---

## ✨ Key Features

### 🎯 Core Capabilities
- ✅ **Page Object Model (POM)** - Clean, maintainable page abstractions
- ✅ **Custom Fixtures** - Reusable authentication and page fixtures using `test.extend()`
- ✅ **Excel-Driven Data** - External test data management via Excel files
- ✅ **Comprehensive Logging** - Timestamped console and file logging with color coding
- ✅ **Rich Reporting** - HTML reports with embedded screenshots and videos
- ✅ **Multi-Browser Support** - Chromium, Firefox, WebKit, Mobile (Pixel 5, iPhone 12)

### 🔧 Technical Features
- ✅ **Screenshot Capture** - Automatic on failure + on-demand capability
- ✅ **Video Recording** - Full test execution videos
- ✅ **ES Modules** - Modern JavaScript with import/export
- ✅ **AAA Pattern** - Arrange-Act-Assert test structure
- ✅ **Error Handling** - Robust try-catch patterns with detailed logging
- ✅ **Modular Architecture** - Separation of concerns (pages, tests, utilities)

---

## 📁 Project Structure

```
saucedemo/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies and npm scripts
│   ├── playwright.config.js         # Playwright configuration
│   ├── .gitignore                   # Git exclusions
│   ├── README.md                    # This file
│   ├── QUICKSTART.md                # Quick reference guide
│   ├── LOGIN_FLOW.md                # Login flow explanation
│   └── CART_TEST_FLOW.md            # Cart test flow explanation
│
├── 📦 Page Object Model (POM)
│   └── pages/
│       ├── BasePage.js              # Base class with common methods
│       ├── LoginPage.js             # Login page interactions
│       ├── DashboardPage.js         # Dashboard/inventory page
│       └── CartPage.js              # Shopping cart page
│
├── 🧪 Test Infrastructure
│   └── tests/
│       ├── login.spec.js            # Login test suite (@smoke)
│       ├── cart.spec.js             # Shopping cart test suite (@smoke)
│       └── fixtures/
│           └── authFixture.js       # Custom authentication fixtures
│
├── 🛠️ Utilities
│   └── utils/
│       ├── excelReader.js           # Excel data reader utility
│       └── testData.xlsx            # Test credentials (Excel file)
│
├── 🔧 Helpers
│   └── helpers/
│       └── logger.js                # Logging utility (console + file)
│
└── 📊 Generated Artifacts (auto-created)
    ├── logs/                        # Timestamped log files
    ├── test-results/                # Screenshots & videos
    └── reports/                     # HTML test reports
```

---

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Download Link |
|-------------|---------|---------------|
| **Node.js** | v16.0.0 or higher | [Download](https://nodejs.org/) |
| **npm** | v7.0.0 or higher | Comes with Node.js |
| **Git** | Latest | [Download](https://git-scm.com/) |

**Verify Installation:**
```bash
node --version    # Should show v16+
npm --version     # Should show v7+
git --version     # Should show git version
```

---

## 📦 Installation & Setup

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd saucedemo
```

### Step 2: Install Dependencies

```bash
# Install npm packages
npm install
```

This will install:
- `@playwright/test` - Playwright test framework
- `xlsx` - Excel file handling
- `fs-extra` - Enhanced file system operations

### Step 3: Install Playwright Browsers

```bash
# Install all browsers
npx playwright install

# Or install specific browser only
npx playwright install chromium
```

### Step 4: Verify Installation

```bash
# Run a quick test
npm test

# If successful, you should see test execution results
```

---

## 🎯 Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run in headed mode (see browser)
npm run test:headed

# Run in debug mode
npm run test:debug

# Run in UI mode (interactive)
npm run test:ui
```

### Browser-Specific Execution

```bash
# Run on Chromium only
npx playwright test --project=chromium

# Run on Firefox only
npx playwright test --project=firefox

# Run on WebKit (Safari) only
npx playwright test --project=webkit

# Run on Mobile Chrome
npx playwright test --project="Mobile Chrome"
```

### Tag-Based Execution (Smoke Tests)

```bash
# Run smoke tests only
npx playwright test --grep "@smoke"

# Run smoke tests on Chromium only
npx playwright test --project=chromium --grep "@smoke"

# Run smoke tests in headed mode
npx playwright test --grep "@smoke" --headed
```

### Advanced Options

```bash
# Run specific test file
npx playwright test tests/login.spec.js

# Run tests matching pattern
npx playwright test --grep "login"

# Run with specific number of workers (e.g., 1 for sequential)
npx playwright test --workers=1

# Run with retries
npx playwright test --retries=2

# Run and update snapshots
npx playwright test --update-snapshots
```

### Generate and View Reports

```bash
# Generate HTML report
npm run test:report

# View HTML report
npm run show:report

# Or use Playwright commands directly
npx playwright test --reporter=html
npx playwright show-report
```

---

## 📊 Test Data Management

### Excel Test Data

Test credentials are stored in **`utils/testData.xlsx`**

**Current Test Data:**

| Index | Username | Password | Description | Use Case |
|-------|----------|----------|-------------|----------|
| 0 | standard_user | secret_sauce | Valid user with standard access | Positive testing |
| 1 | locked_out_user | secret_sauce | User that has been locked out | Negative testing |
| 2 | problem_user | secret_sauce | User with problem/glitchy behavior | Edge case testing |
| 3 | performance_glitch_user | secret_sauce | User with performance issues | Performance testing |
| 4 | invalid_user | wrong_password | Invalid credentials | Negative testing |

### How to Add/Modify Test Data

#### Option 1: Edit Excel File Directly
1. Open `utils/testData.xlsx` in Excel or any spreadsheet application
2. Add/modify rows with columns: `username`, `password`, `description`
3. Save the file
4. Tests will automatically use the updated data

#### Option 2: Regenerate Excel File Programmatically
1. Edit `createTestData.js` to add new credentials
2. Run: `node createTestData.js`
3. New Excel file will be generated

**Example: Adding New Test Data**

Edit `createTestData.js`:
```javascript
const testData = [
  // ... existing data ...
  {
    username: 'new_test_user',
    password: 'test_password',
    description: 'New test user for specific scenario'
  }
];
```

Then run:
```bash
node createTestData.js
```

### Using Test Data in Tests

```javascript
// Use specific credential by index
await login(0);  // Uses standard_user

await login(1);  // Uses locked_out_user

// Or get credentials directly
const credentials = excelReader.getLoginCredentials(0);
console.log(credentials.username);  // 'standard_user'
```

---

## 🏗️ Framework Architecture

### 1. Page Object Model (POM)

#### BasePage.js - Foundation Class

**Purpose:** Base class providing common methods for all page objects

**Key Methods:**
```javascript
goto(url)                          // Navigate to URL
safeClick(locator)                 // Click with wait and error handling
safeFill(locator, text)            // Fill text with wait and error handling
waitForElement(locator, timeout)   // Explicit wait for elements
takeScreenshot(name)               // Capture screenshot on demand
getTextContent(locator)            // Get element text
isVisible(locator)                 // Check element visibility
getCurrentURL()                    // Get current page URL
getTitle()                         // Get page title
```

#### LoginPage.js - Login Page Object

**Locators:**
- Username input: `#user-name`
- Password input: `#password`
- Login button: `#login-button`
- Error message: `[data-test="error"]`

**Methods:**
```javascript
navigateToLoginPage()              // Navigate to login page
doLogin(username, password)        // Complete login flow
getErrorMessage()                  // Get error message text
isErrorDisplayed()                 // Check if error is shown
clearLoginForm()                   // Clear form fields
```

#### DashboardPage.js - Dashboard Page Object

**Locators:**
- Page title: `.title`
- Inventory container: `#inventory_container`
- Product items: `.inventory_item`
- Shopping cart: `.shopping_cart_link`

**Methods:**
```javascript
verifyDashboardVisible()           // Verify dashboard loaded
getDashboardTitle()                // Get page title
getProductCount()                  // Count products displayed
getAllProductNames()               // Get all product names
logout()                           // Logout from application
isOnDashboard()                    // Verify on dashboard page
```

### 2. Custom Fixtures

**Location:** `tests/fixtures/authFixture.js`

**Available Fixtures:**

1. **`loginPage`** - Provides LoginPage instance
   ```javascript
   test('my test', async ({ loginPage }) => {
     await loginPage.navigateToLoginPage();
   });
   ```

2. **`dashboardPage`** - Provides DashboardPage instance
   ```javascript
   test('my test', async ({ dashboardPage }) => {
     await dashboardPage.verifyDashboardVisible();
   });
   ```

3. **`login(index)`** - Performs login with Excel credentials
   ```javascript
   test('my test', async ({ login }) => {
     await login(0);  // Login with first credential
   });
   ```

4. **`authenticatedPage`** - Auto-login fixture
   ```javascript
   test('my test', async ({ authenticatedPage }) => {
     // Already logged in!
     const { dashboardPage } = authenticatedPage;
   });
   ```

### 3. Logging System

**Location:** `helpers/logger.js`

**Log Levels:**
- `logger.step(message)` - Log test steps (Cyan)
- `logger.pass(message)` - Log success (Green)
- `logger.fail(message)` - Log failures (Red)
- `logger.info(message)` - Log information (White)
- `logger.warn(message)` - Log warnings (Yellow)

**Output:**
- **Console:** Color-coded output
- **File:** `logs/test-log-YYYY-MM-DD-HH-MM-SS.log`

**Example:**
```javascript
logger.step('Starting login process');
logger.pass('Login successful');
logger.fail('Element not found');
```

### 4. Excel Reader Utility

**Location:** `utils/excelReader.js`

**Methods:**
```javascript
getLoginCredentials(index)         // Get credentials by index
getCredentialsByUsername(username) // Get credentials by username
getAllData()                       // Get all test data
getDataByIndex(index)              // Get row by index
getDataByColumnValue(col, value)   // Query by column value
```

---

## 📊 Reporting

### HTML Report

**Generate Report:**
```bash
npm run test:report
npm run show:report
```

**Report Includes:**
- ✅ Test execution summary
- 📸 Screenshots (on failure)
- 🎥 Video recordings
- 📝 Detailed step logs
- ⏱️ Execution timings
- 🔍 Error stack traces

**Report Location:** `reports/index.html`

### Log Files

**Location:** `logs/test-log-YYYY-MM-DD-HH-MM-SS.log`

**View Logs:**
```bash
# View latest log
cat logs/test-log-*.log

# Or open in editor
code logs/
```

### Screenshots & Videos

**Location:** `test-results/`

**Automatic Capture:**
- Screenshots: On test failure
- Videos: On test failure (configurable)

**Manual Capture:**
```javascript
await basePage.takeScreenshot('my-screenshot');
```

---

## 🤝 Contributing

We welcome contributions! This framework is designed for learning and improvement.

### How to Contribute

1. **Fork the Repository**
2. **Create a Feature Branch**
3. **Make Your Changes**
4. **Test Your Changes**
5. **Submit a Pull Request**

### Contribution Guidelines

#### Code Standards
- ✅ Use ES6+ JavaScript features
- ✅ Follow existing code structure
- ✅ Add JSDoc comments for new methods
- ✅ Use meaningful variable/function names
- ✅ Follow POM pattern for new pages
- ✅ Add logging to new methods

#### Testing Standards
- ✅ Follow AAA pattern (Arrange-Act-Assert)
- ✅ Add `@smoke` tag for critical tests
- ✅ Use fixtures instead of direct page objects
- ✅ Add descriptive test names
- ✅ Include positive and negative scenarios

#### Documentation Standards
- ✅ Update README for new features
- ✅ Add inline comments for complex logic
- ✅ Update QUICKSTART.md if needed
- ✅ Document new test data requirements

---

## 🔄 Pull Request Process

### Step-by-Step Guide

#### 1. Fork and Clone

```bash
# Fork the repository on GitHub (click Fork button)

# Clone your fork
git clone https://github.com/YOUR_USERNAME/saucedemo.git

# Navigate to directory
cd saucedemo

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/saucedemo.git
```

#### 2. Create Feature Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Example branch names:
# feature/add-cart-page
# fix/login-timeout-issue
# docs/update-readme
```

#### 3. Make Changes

```bash
# Make your code changes
# ... edit files ...

# Test your changes
npm test

# Ensure all tests pass
npm run test:smoke
```

#### 4. Commit Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: Add CartPage object and cart tests"

# Commit message format:
# feat: New feature
# fix: Bug fix
# docs: Documentation changes
# refactor: Code refactoring
# test: Adding tests
# chore: Maintenance tasks
```

#### 5. Push to Your Fork

```bash
# Push feature branch to your fork
git push origin feature/your-feature-name
```

#### 6. Create Pull Request

1. Go to your fork on GitHub
2. Click **"Compare & pull request"**
3. Fill in PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Changes Made
- Added CartPage.js
- Created cart.spec.js with 5 test cases
- Updated README with cart testing info

## Testing Done
- [ ] All existing tests pass
- [ ] New tests added and passing
- [ ] Tested on Chromium, Firefox, WebKit

## Screenshots (if applicable)
[Add screenshots of test results]

## Checklist
- [ ] Code follows project style
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] All tests passing
```

4. Click **"Create Pull Request"**

#### 7. Code Review Process

- Maintainers will review your PR
- Address any feedback/comments
- Make requested changes:
  ```bash
  # Make changes
  git add .
  git commit -m "fix: Address review comments"
  git push origin feature/your-feature-name
  ```
- Once approved, PR will be merged

### Pull Request Best Practices

✅ **DO:**
- Keep PRs focused and small
- Write clear commit messages
- Add tests for new features
- Update documentation
- Respond to review comments promptly

❌ **DON'T:**
- Submit large PRs with multiple features
- Include unrelated changes
- Break existing tests
- Forget to update documentation

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Issue: Tests Not Running

**Solution:**
```bash
# Reinstall dependencies
npm install

# Reinstall browsers
npx playwright install --with-deps
```

#### Issue: Excel File Not Found

**Solution:**
```bash
# Regenerate test data
node createTestData.js

# Verify file exists
ls utils/testData.xlsx
```

#### Issue: Import Errors

**Solution:**
- Ensure `"type": "module"` is in `package.json`
- Check file extensions are `.js`
- Verify import paths are correct

#### Issue: Browser Not Found

**Solution:**
```bash
# Install specific browser
npx playwright install chromium

# Or install all browsers
npx playwright install
```

#### Issue: Tests Failing Intermittently

**Solution:**
- Increase timeouts in `playwright.config.js`
- Add explicit waits in page objects
- Check network stability
- Review logs for specific errors

#### Issue: Screenshots Not Captured

**Solution:**
- Verify `screenshot: 'only-on-failure'` in config
- Check `test-results/` directory permissions
- Ensure tests are actually failing

### Getting Help

1. **Check Logs:** `logs/test-log-*.log`
2. **View HTML Report:** `npx playwright show-report`
3. **Run in Debug Mode:** `npm run test:debug`
4. **Check Documentation:** `README.md`, `QUICKSTART.md`
5. **Playwright Docs:** https://playwright.dev

---

## 📚 Learning Resources

### For Beginners

- [Playwright Getting Started](https://playwright.dev/docs/intro)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [JavaScript ES6+ Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### For Intermediate

- [Playwright Fixtures](https://playwright.dev/docs/test-fixtures)
- [Test Configuration](https://playwright.dev/docs/test-configuration)
- [Reporters](https://playwright.dev/docs/test-reporters)

### For Advanced

- [Playwright API](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team & Acknowledgments

**Framework Designed For:** QA Teams learning Playwright automation

**Maintained By:** [Your Team Name]

**Special Thanks:** Playwright team for the amazing framework

---

## 📞 Contact & Support

- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-repo/discussions)
- **Email:** your-email@example.com

---

## 🎯 Quick Links

- [Installation](#installation--setup)
- [Running Tests](#running-tests)
- [Test Data](#test-data-management)
- [Contributing](#contributing)
- [Pull Requests](#pull-request-process)
- [Troubleshooting](#troubleshooting)

---

**Happy Testing! 🎉**

*Built with ❤️ using Playwright*
