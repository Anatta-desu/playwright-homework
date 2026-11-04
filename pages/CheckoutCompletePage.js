
class CheckoutCompletePage {
    constructor(page) {
        this.page = page;

        this.completeHeader = page.locator('.complete-header');
        this.completeText = page.locator('.complete-text');
        this.backHomeButton = page.locator('#back-to-products');
    }

    async getConfirmationMessage() {
        return this.completeHeader.textContent();
    }
}

module.exports = CheckoutCompletePage;
