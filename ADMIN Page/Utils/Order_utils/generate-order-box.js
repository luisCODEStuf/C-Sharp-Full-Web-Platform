export default function createOrderBox(order) {

    const orderBox = document.createElement('div');
    orderBox.className = 'order-box';
    orderBox.id = `order-${order.id}`;


    const orderInfos = document.createElement('div');
    orderInfos.id = 'order-infos';
    const orderIdLabel = document.createElement('label');
    orderIdLabel.textContent = 'Order id:';
    const orderIdP = document.createElement('p');
    orderIdP.textContent = order.id;
    const totalLabel = document.createElement('label');
    totalLabel.textContent = 'Total:';
    const totalP = document.createElement('p');
    totalP.textContent = `R$ ${order.total.toFixed(2)}`;
    orderInfos.appendChild(orderIdLabel);
    orderInfos.appendChild(orderIdP);
    orderInfos.appendChild(totalLabel);
    orderInfos.appendChild(totalP);


    const userLabel = document.createElement('label');
    userLabel.textContent = 'User';


    const userInfos = document.createElement('div');
    userInfos.id = 'user-infos';
    
    const userIdDiv = document.createElement('div');
    const userIdLabel = document.createElement('label');
    userIdLabel.textContent = 'Id:';
    const userIdP = document.createElement('p');
    userIdP.textContent = order.user.id;
    userIdDiv.appendChild(userIdLabel);
    userIdDiv.appendChild(userIdP);
    
    const userEmailDiv = document.createElement('div');
    const userEmailLabel = document.createElement('label');
    userEmailLabel.textContent = 'Email:';
    const userEmailP = document.createElement('p');
    userEmailP.textContent = order.user.email;
    userEmailDiv.appendChild(userEmailLabel);
    userEmailDiv.appendChild(userEmailP);
    
    userInfos.appendChild(userIdDiv);
    userInfos.appendChild(userEmailDiv);


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
    const statusP = document.createElement('p');
    const statusSpan = document.createElement('span');
    statusSpan.className = `status-${order.status.toLowerCase()}`;
    const statusText = document.createTextNode(order.status);
    statusP.appendChild(statusSpan);
    statusP.appendChild(statusText);
    orderState.appendChild(statusP);


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


    const prodIdDiv = document.createElement('div');
    const prodIdLabel = document.createElement('label');
    prodIdLabel.textContent = 'Id:';
    const prodIdP = document.createElement('p');
    prodIdP.textContent = product.productIdentifer;
    prodIdDiv.appendChild(prodIdLabel);
    prodIdDiv.appendChild(prodIdP);
    
    const prodNameDiv = document.createElement('div');
    const prodNameLabel = document.createElement('label');
    prodNameLabel.textContent = 'Name:';
    const prodNameP = document.createElement('p');
    prodNameP.textContent = product.productName;
    prodNameDiv.appendChild(prodNameLabel);
    prodNameDiv.appendChild(prodNameP);
    
    const prodPriceDiv = document.createElement('div');
    const prodPriceLabel = document.createElement('label');
    prodPriceLabel.textContent = 'Price:';
    const prodPriceP = document.createElement('p');
    prodPriceP.textContent = `R$ ${product.productPrice.toFixed(2)}`;
    prodPriceDiv.appendChild(prodPriceLabel);
    prodPriceDiv.appendChild(prodPriceP);
    
    const prodStockDiv = document.createElement('div');
    const prodStockLabel = document.createElement('label');
    prodStockLabel.textContent = 'Stock:';
    const prodStockP = document.createElement('p');
    prodStockP.textContent = product.productStock;
    prodStockDiv.appendChild(prodStockLabel);
    prodStockDiv.appendChild(prodStockP);
    
    productDiv.appendChild(prodIdDiv);
    productDiv.appendChild(prodNameDiv);
    productDiv.appendChild(prodPriceDiv);
    productDiv.appendChild(prodStockDiv);

    return productDiv;
}