export default function createProductBox(product) {

    const productBox = document.createElement('div');
    productBox.className = 'product-box';
    productBox.id = `product-${product.productId}`;


    const productInfos = document.createElement('div');
    productInfos.id = 'product-infos';
    productInfos.innerHTML = `
        <div id="product-texts-infos">
        <label>Product ID:</label>
        <p>${product.productId}</p>

        <label>Name:</label>
        <p>${product.productName}</p>

        <label>Price:</label>
        <p>R$ ${product.productPrice}</p>

        <label>Stock:</label>
        <p>${product.productStock}</p>
        </div>

        <div id="product-image">
         <img src="${product.productImageUrl}" alt="${product.productName}" />     
        <div/>
    `;


    const descriptionLabel = document.createElement('label');
    descriptionLabel.textContent = 'Description';

    const descriptionDiv = document.createElement('div');
    descriptionDiv.id = 'product-description';
    descriptionDiv.innerHTML = `
        <p>${product.productDescription}</p>
    `;




    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Status';

    const statusDiv = document.createElement('div');
    statusDiv.id = 'product-status';
    statusDiv.innerHTML = `
        <p>${product.productIsActive ? '✅ Active' : '❌ Inactive'}</p>
    `;


    const createdAtLabel = document.createElement('label');
    createdAtLabel.textContent = 'Created At';

    const createdAtDiv = document.createElement('div');
    createdAtDiv.id = 'product-created-at';
    createdAtDiv.innerHTML = `
        <p>${product.productCreatedAt}</p>
    `;


    productBox.appendChild(productInfos);
    productBox.appendChild(descriptionLabel);
    productBox.appendChild(descriptionDiv);
    productBox.appendChild(statusLabel);
    productBox.appendChild(statusDiv);
    productBox.appendChild(createdAtLabel);
    productBox.appendChild(createdAtDiv);

    return productBox;
}
