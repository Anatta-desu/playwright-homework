
const { test, expect } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');
const InventoryPage = require('../pages/InventoryPage');
const CartPage = require('../pages/CartPage');
const CheckoutStepOnePage = require('../pages/CheckoutStepOnePage');
const CheckoutStepTwoPage = require('../pages/CheckoutStepTwoPage');
const CheckoutCompletePage = require('../pages/CheckoutCompletePage');

test('User can purchase the most expensive product @ui', async ({ page }) => {
    // 1. Initialize Page Objects
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOnePage = new CheckoutStepOnePage(page);
    const checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);

    // 2. Login
    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory\.html/);

    // 3. Find and add the most expensive product
    const selectedProduct = await inventoryPage.addMostExpensiveProductToCart();

    await expect(inventoryPage.cartBadge).toHaveText('1');

    // 4. Open cart and verify the selected product
    await inventoryPage.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cartPage.cartItems).toHaveCount(1);

    const cartProductName = await cartPage.getProductName();

    expect(cartProductName).toBe(selectedProduct.name);

    // 5. Start checkout
    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // 6. Fill customer information
    await checkoutStepOnePage.fillCustomerInfo(
        'Test',
        'User',
        '12345'
    );

    await checkoutStepOnePage.continueToOverview();

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // 7. Verify order total and finish purchase
    const itemTotal = await checkoutStepTwoPage.itemTotalLabel.textContent();

    expect(itemTotal).toContain(selectedProduct.price.toFixed(2));

    await expect(checkoutStepTwoPage.finishButton).toBeVisible();

    await checkoutStepTwoPage.finishPurchase();

    // 8. Verify successful purchase
    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(checkoutCompletePage.completeHeader)
        .toHaveText('Thank you for your order!');

    await expect(checkoutCompletePage.completeText)
        .toContainText('Your order has been dispatched');
});
