export default function createOrderBox(order) {
    const orderBox = document.createElement('div');
    orderBox.className = 'order-box';
    orderBox.id = `order-${order.id}`;
    
    const orderInfos = document.createElement('div');
    orderInfos.id = 'order-infos';
    orderInfos.innerHTML = `
        <label>Order id:</label>
        <p>${order.id}</p>
        <label>Creation date:</label>
        <p>${formatDate(order.createdAt)}</p>
    `;
    
    const userLabel = document.createElement('label');
    userLabel.textContent = 'User';
    
    const userInfos = document.createElement('div');
    userInfos.id = 'user-infos';
    userInfos.innerHTML = `
        <div id="id">
            <label>Id:</label>
            <p>${order.userId}</p>
        </div>
        <div id="name">
            <label>Name:</label>
            <p>${order.userName || 'N/A'}</p>
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
        
        hiddenProducts.forEach((product, index) => {
            const productDiv = createProductDiv(product, index + 4);
            details.appendChild(productDiv);
        });
        
        const summary = document.createElement('summary');
        summary.textContent = `see more (${hiddenProducts.length} more)`;
        details.appendChild(summary);
        
        orderProducts.appendChild(details);
    }
    
    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'status';
    
    const orderState = document.createElement('div');
    orderState.id = 'order-state';
    orderState.innerHTML = `
        <p>
            <span id="order-state-color" class="status-${order.status.toLowerCase()}"></span>
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
    productDiv.id = `pd${index}`;
    productDiv.className = 'product-item';
    
    productDiv.innerHTML = `
        <div id="id">
            <label>Id:</label>
            <p>${product.id}</p>
        </div>
        <div id="name">
            <label>Name:</label>
            <p>${product.name}</p>
        </div>
        <div id="quantity">
            <label>Qty:</label>
            <p>${product.quantity}</p>
        </div>
        <div id="price">
            <label>Price:</label>
            <p>R$ ${product.price.toFixed(2)}</p>
        </div>
    `;
    
    return productDiv;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
