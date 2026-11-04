
class InventoryPage {
    constructor(page) {
        this.page = page;

        this.inventoryItems = page.locator('.inventory_item');
        this.cartLink = page.locator('.shopping_cart_link');
        this.cartBadge = page.locator('.shopping_cart_badge');
    }

    async getMostExpensiveProduct() {
		await this.inventoryItems.first().waitFor({ state: 'visible' });
		const products = await this.inventoryItems.evaluateAll(items =>
			items.map((item, index) => ({
				index,
				name: item.querySelector('.inventory_item_name').textContent,
				price: parseFloat(
					item.querySelector('.inventory_item_price').textContent.replace('$', '')
				)
			}))
		);

    return products.reduce((mostExpensive, product) =>
        product.price > mostExpensive.price ? product : mostExpensive
    );
}

    async addMostExpensiveProductToCart() {
        const product = await this.getMostExpensiveProduct();

        await this.inventoryItems
            .nth(product.index)
            .locator('button')
            .click();

        return product;
    }

    async openCart() {
        await this.cartLink.click();
    }

    async getCartBadgeCount() {
        return Number(await this.cartBadge.textContent());
    }
}

module.exports = InventoryPage;
