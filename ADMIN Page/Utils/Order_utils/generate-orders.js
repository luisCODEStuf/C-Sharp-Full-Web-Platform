import createOrderBox from "../Order_utils/generate-order-box.js";

export default async function generateOrderBoxes(container, apiUrl) {
    try {

        const loadingP = document.createElement('p');
        loadingP.className = 'loading';
        loadingP.textContent = 'Loading orders...';
        container.replaceChildren(loadingP);

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        container.replaceChildren();

        console.log(result);
        console.log(result.ordersData);


        // ✅ usar ordersData
        if (!result.ordersData || result.ordersData.length === 0) {
            const noOrdersP = document.createElement('p');
            noOrdersP.className = 'no-orders';
            noOrdersP.textContent = '📭 No orders found';
            container.appendChild(noOrdersP);
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

        console.error('Error loading orders:', error);

        const errorP = document.createElement('p');
        errorP.className = 'error';
        errorP.textContent = `Error loading orders: ${error.message}`;
        container.replaceChildren(errorP);
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