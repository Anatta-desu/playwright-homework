
class CartPage {
    constructor(page) {
        this.page = page;

        this.cartItems = page.locator('.cart_item');
        this.checkoutButton = page.locator('#checkout');
        this.continueShoppingButton = page.locator('#continue-shopping');
    }

    async getProductName() {
        return this.cartItems.locator('.inventory_item_name').textContent();
    }

    async checkout() {
        await this.checkoutButton.click();
    }
}

module.exports = CartPage;
