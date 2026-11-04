
class CheckoutStepTwoPage {
    constructor(page) {
        this.page = page;

        this.finishButton = page.locator('#finish');
        this.cancelButton = page.locator('#cancel');
        this.totalLabel = page.locator('.summary_total_label');
        this.itemTotalLabel = page.locator('.summary_subtotal_label');
    }

    async getTotal() {
        return this.totalLabel.textContent();
    }

    async finishPurchase() {
        await this.finishButton.click();
    }
}

module.exports = CheckoutStepTwoPage;
