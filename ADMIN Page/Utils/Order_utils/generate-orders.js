import createOrderBox from "../Order_utils/generate-order-box.js";

export default async function generateOrderBoxes(container, apiUrl) {
    try {

        container.innerHTML = '<p class="loading">Loading orders...</p>';

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        container.innerHTML = '';

        console.log(result);
        console.log(result.ordersData);


        // ✅ usar ordersData
        if (!result.ordersData || result.ordersData.length === 0) {
            container.innerHTML = '<p class="no-orders">📭 No orders found</p>';
            return;
        }


        result.ordersData.forEach(order => {
            const orderBox = createOrderBox(order);
            container.appendChild(orderBox);
        });


        console.log(`✅ Loaded ${result.ordersData.length} orders`);


        if (result.pagination) {
            showPaginationInfo(container, result.pagination);
        }

    } catch (error) {

        console.error('❌ Error loading orders:', error);

        container.innerHTML = `
            <p class="error">
                ❌ Error loading orders: ${error.message}
            </p>
        `;
    }
}


function showPaginationInfo(container, pagination) {

    const paginationDiv = document.createElement('div');

    paginationDiv.className = 'pagination-info';

    paginationDiv.innerHTML = `
        <p>
            Showing ${pagination.currentPage} of ${pagination.totalPages} pages
            (${pagination.totalCount} total orders)
        </p>
    `;

    container.appendChild(paginationDiv);
}