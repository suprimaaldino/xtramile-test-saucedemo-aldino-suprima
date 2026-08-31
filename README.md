# SauceDemo Playwright Automation

Playwright + TypeScript E2E test automation for [SauceDemo](https://www.saucedemo.com) using Page Object Model pattern, Allure reporting, and GitHub Actions CI/CD.

---

## Quick Start

```bash
# Clone
git clone https://github.com/suprimaaldino/xtramile-test-saucedemo-aldino-suprima.git
cd xtramile-test-saucedemo-aldino-suprima

# Install
npm ci
npx playwright install

# Setup env
cp .env.example .env
# Edit .env with your credentials

# Run tests
npx playwright test
```

---

## Tech Stack

| Item | Detail |
|------|--------|
| Framework | Playwright + TypeScript |
| Pattern | Page Object Model (POM) + Custom Fixtures |
| Reporting | Allure Report + GitHub Pages |
| CI/CD | GitHub Actions (parallel sharding + Allure publish) |
| Data Strategy | External JSON fixtures + TypeScript data generator |
| Auth Strategy | Playwright Storage State (login once, reuse across all tests) |
| Secrets | `.env` + Base64 encoding — passwords encoded, decoded at runtime |

---

## Project Structure

```
├── .github/workflows/
│   ├── playwright-ci.yml            # Run tests on push/PR
│   └── allure-report.yml            # Publish Allure to GH Pages
│
├── src/
│   ├── pages/                       # Page Object Models
│   │   ├── BasePage.ts              #   Shared utilities + Allure step wrapper
│   │   ├── LoginPage.ts             #   Login interactions
│   │   ├── InventoryPage.ts         #   Product listing / sort / add-to-cart
│   │   ├── CartPage.ts              #   Cart view / remove items
│   │   ├── CheckoutStepOnePage.ts   #   Checkout: info form
│   │   ├── CheckoutStepTwoPage.ts   #   Checkout: review order + pricing
│   │   ├── CheckoutCompletePage.ts  #   Checkout: success page
│   │   └── components/Header.ts     #   Burger menu + cart icon
│   │
│   ├── fixtures/
│   │   ├── test-fixtures.ts         #   Extended test runner (POM instances)
│   │   └── auth.setup.ts           #   Storage state generator (login once)
│   │
│   ├── helpers/
│   │   ├── env.ts                   #   .env loader + Base64 password decoder
│   │   ├── allure-helpers.ts        #   Allure step annotations + metadata
│   │   ├── assertion-helpers.ts     #   Reusable custom assertions
│   │   └── data-generator.ts        #   Random data for checkout fields
│   │
│   └── types/
│       ├── user.types.ts            #   User credential interfaces
│       └── product.types.ts         #   Product data interfaces
│
├── tests/
│   ├── login/login.spec.ts
│   ├── inventory/
│   │   ├── add-to-cart.spec.ts
│   │   ├── remove-from-cart.spec.ts
│   │   └── sort-products.spec.ts
│   ├── cart/cart-validation.spec.ts
│   ├── checkout/
│   │   ├── checkout-complete-flow.spec.ts
│   │   └── checkout-customer-data.spec.ts
│   └── logout/logout.spec.ts
│
├── test-data/
│   ├── products.json
│   ├── checkout-customers.json
│   └── users.json
│
├── storage-state/                   # Generated auth state (gitignored)
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env.example
└── README.md
```

---

## Test Cases (13 TC)

| TC ID | Module | Scenario | Priority |
|-------|--------|----------|----------|
| TC-01 | Login | Successful login with valid credentials | High |
| TC-02 | Login | Login blocked for locked-out user | High |
| TC-03 | Login | Login rejected with invalid password | High |
| TC-04 | Login | Login rejected with empty credentials | Medium |
| TC-05 | Product Listing | Sort products by Price (low to high) | Medium |
| TC-06 | Product Listing | Sort products by Name (Z to A) | Low |
| TC-07 | Cart | Add multiple items + verify cart badge, price, quantity | High |
| TC-08 | Cart | Remove item from cart | Medium |
| TC-09 | Checkout | Complete checkout with pricing verification | High |
| TC-10 | Checkout | Checkout blocked when required fields missing | High |
| TC-11 | Checkout | Cancel checkout on Step Two, cart intact | Medium |
| TC-12 | Logout | Logout ends session, returns to login page | High |
| TC-13 | Logout | Browser Back after logout does not restore session | Medium |

---

## Architecture

### Storage State (No Repeated Login)

```
auth.setup.ts → login → save storage-state/{browser}.json
                              ↓
              chromium / firefox / webkit projects
              (all reuse saved session)
```

Playwright runs `auth.setup.ts` once per browser before all dependent tests. Each browser gets its own storage state file.

### Page Object Model

```
BasePage
  ├── LoginPage
  ├── InventoryPage
  ├── CartPage
  ├── CheckoutStepOnePage
  ├── CheckoutStepTwoPage
  ├── CheckoutCompletePage
  └── Header (component)
```

Every page object extends `BasePage` which provides:
- `allureStep()` — wrap actions in Allure reporting steps
- `slugify()` — convert product names to SauceDemo data-test slugs
- `navigateTo()` — base URL navigation

### Custom Fixtures

```typescript
import { test, expect } from '../src/fixtures/test-fixtures';

test('example', async ({ loginPage, inventoryPage, cartPage }) => {
  // All POM instances are auto-injected
});
```

---

## Environment Variables

### `.env` (gitignored)

```bash
SAUCE_STANDARD_USER=standard_user
SAUCE_STANDARD_PASS=c2VjcmV0X3NhdWNl           # base64 of "secret_sauce"
SAUCE_LOCKED_OUT_USER=locked_out_user
SAUCE_LOCKED_OUT_PASS=c2VjcmV0X3NhdWNl
SAUCE_INVALID_USER=standard_user
SAUCE_INVALID_PASS=d3JvbmdfcGFzc3dvcmQ=        # base64 of "wrong_password"
BASE_URL=https://www.saucedemo.com
```

### Password Encoding

```bash
# Encode
echo -n "secret_sauce" | base64        # → c2VjcmV0X3NhdWNl

# Windows PowerShell
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes("secret_sauce"))
```

`decodePassword()` in `env.ts` auto-detects Base64 and decodes at runtime. Falls back to raw value if not encoded.

### CI/CD (GitHub Secrets)

Secrets are injected as env vars in the workflow — no `.env` file in CI:

```yaml
env:
  SAUCE_STANDARD_USER: ${{ secrets.SAUCE_STANDARD_USER }}
  SAUCE_STANDARD_PASS: ${{ secrets.SAUCE_STANDARD_PASS }}
```

---

## CI/CD

### Test Execution (`playwright-ci.yml`)

- Triggers on push/PR to `main`
- 2 parallel shards × 4 workers = 8 concurrent tests
- Docker image: `mcr.microsoft.com/playwright:v1.62.1-noble`
- Uploads Allure results as artifacts

### Allure Report (`allure-report.yml`)

- Triggers when Playwright Tests workflow completes
- Downloads sharded Allure artifacts
- Generates HTML report
- Deploys to GitHub Pages via `actions/deploy-pages@v4`

**Report URL:** `https://suprimaaldino.github.io/xtramile-test-saucedemo-aldino-suprima/`

---

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm test` | Run all tests |
| `npm run test:headed` | Run in headed mode |
| `npm run test:debug` | Run in debug mode |
| `npm run test:ui` | Run with Playwright UI |
| `npm run test:login` | Run login tests only |
| `npm run test:inventory` | Run inventory tests only |
| `npm run test:cart` | Run cart tests only |
| `npm run test:checkout` | Run checkout tests only |
| `npm run test:logout` | Run logout tests only |
| `npm run test:setup` | Run auth setup only |
| `npm run test:chromium` | Run on Chromium only |
| `npm run test:firefox` | Run on Firefox only |
| `npm run test:webkit` | Run on WebKit only |
| `npm run allure:generate` | Generate Allure report |
| `npm run allure:open` | Open Allure report |

---

## Local Development

```bash
# Run specific browser
npx playwright test --project=chromium

# Run specific test file
npx playwright test tests/login/login.spec.ts

# Run with UI mode
npx playwright test --ui

# Show Allure report
npx allure serve reports/allure-results
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Missing required environment variables` | Copy `.env.example` to `.env` and fill in credentials |
| Firefox fails in CI | Ensure `HOME: /root` is set in workflow |
| Allure report empty | Check `run-id` and `github-token` in `allure-report.yml` |
| Tests timeout | Verify SauceDemo is accessible and credentials are correct |
