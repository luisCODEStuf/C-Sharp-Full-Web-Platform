import createProductBox from "../Product_Utils/Create_product_box.js";

export default async function generateProductsTable(container, apiUrl) {
    try {

        container.innerHTML = '<p class="loading">Loading products...</p>';

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        container.innerHTML = '';

        console.log(result);

        // Check if products exist in response
        const products = result.data || result.products || result;
        
        if (!products || products.length === 0) {
            container.innerHTML = '<p class="no-products">📦 No products found</p>';
            return;
        }

        products.forEach(product => {
            const productBox = createProductBox(product);
            container.appendChild(productBox);
        });

        console.log(`✅ Loaded ${products.length} products`);

    } catch (error) {

        console.error('❌ Error loading products:', error);

        container.innerHTML = `
            <p class="error">
                ❌ Error loading products: ${error.message}
            </p>
        `;
    }
}
