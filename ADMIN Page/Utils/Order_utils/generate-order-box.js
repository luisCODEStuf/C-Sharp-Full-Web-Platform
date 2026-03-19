export default function createOrderBox(order) {

    const orderBox = document.createElement('div');
    orderBox.className = 'order-box';
    orderBox.id = `order-${order.id}`;


    const orderInfos = document.createElement('div');
    orderInfos.id = 'order-infos';
    orderInfos.innerHTML = `
        <label>Order id:</label>
        <p>${order.id}</p>

        <label>Total:</label>
        <p>R$ ${order.total.toFixed(2)}</p>
    `;


    const userLabel = document.createElement('label');
    userLabel.textContent = 'User';


    const userInfos = document.createElement('div');
    userInfos.id = 'user-infos';

    userInfos.innerHTML = `
        <div>
            <label>Id:</label>
            <p>${order.user.id}</p>
        </div>

        <div>
            <label>Email:</label>
            <p>${order.user.email}</p>
        </div>
    `;


    const productsLabel = document.createElement('label');
    productsLabel.textContent = 'Products';


    const orderProducts = document.createElement('div');
    orderProducts.id = 'order-products';


    const visibleProducts = order.products.slice(0, 3);
    const hiddenProducts = order.products.slice(3);


    visibleProducts.forEach((product, index) => {
        const productDiv = createProductDiv(product, index + 1);
        orderProducts.appendChild(productDiv);
    });


    if (hiddenProducts.length > 0) {

        const details = document.createElement('details');

        const summary = document.createElement('summary');
        summary.textContent = `see more (${hiddenProducts.length} more)`;

        details.appendChild(summary);

        hiddenProducts.forEach((product, index) => {
            const productDiv = createProductDiv(product, index + 4);
            details.appendChild(productDiv);
        });

        orderProducts.appendChild(details);
    }


    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Status';


    const orderState = document.createElement('div');
    orderState.id = 'order-state';

    orderState.innerHTML = `
        <p>
            <span class="status-${order.status.toLowerCase()}"></span>
            ${order.status}
        </p>
    `;


    orderBox.appendChild(orderInfos);
    orderBox.appendChild(userLabel);
    orderBox.appendChild(userInfos);
    orderBox.appendChild(productsLabel);
    orderBox.appendChild(orderProducts);
    orderBox.appendChild(statusLabel);
    orderBox.appendChild(orderState);

    return orderBox;
}



function createProductDiv(product, index) {

    const productDiv = document.createElement('div');
    productDiv.className = 'product-item';


    productDiv.innerHTML = `
        <div>
            <label>Id:</label>
            <p>${product.productIdentifer}</p>
        </div>

        <div>
            <label>Name:</label>
            <p>${product.productName}</p>
        </div>

        <div>
            <label>Price:</label>
            <p>R$ ${product.productPrice.toFixed(2)}</p>
        </div>

        <div>
            <label>Stock:</label>
            <p>${product.productStock}</p>
        </div>
    `;

    return productDiv;
}