export default function createProductBox(product) {

    const productBox = document.createElement('div');
    productBox.className = 'product-box';
    productBox.id = `product-${product.productId}`;


    const productInfos = document.createElement('div');
    productInfos.id = 'product-infos';
    
    const textsDiv = document.createElement('div');
    textsDiv.id = 'product-texts-infos';
    
    const idLabel = document.createElement('label');
    idLabel.textContent = 'Product ID:';
    const idP = document.createElement('p');
    idP.textContent = product.productId;
    
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    const nameP = document.createElement('p');
    nameP.textContent = product.productName;
    
    const priceLabel = document.createElement('label');
    priceLabel.textContent = 'Price:';
    const priceP = document.createElement('p');
    priceP.textContent = `R$ ${product.productPrice}`;
    
    const stockLabel = document.createElement('label');
    stockLabel.textContent = 'Stock:';
    const stockP = document.createElement('p');
    stockP.textContent = product.productStock;
    
    textsDiv.appendChild(idLabel);
    textsDiv.appendChild(idP);
    textsDiv.appendChild(nameLabel);
    textsDiv.appendChild(nameP);
    textsDiv.appendChild(priceLabel);
    textsDiv.appendChild(priceP);
    textsDiv.appendChild(stockLabel);
    textsDiv.appendChild(stockP);
    
    const imageDiv = document.createElement('div');
    imageDiv.id = 'product-image';
    const img = document.createElement('img');
    img.src = product.productImageUrl;
    img.alt = product.productName;
    imageDiv.appendChild(img);
    
    productInfos.appendChild(textsDiv);
    productInfos.appendChild(imageDiv);


    const descriptionDiv = document.createElement('div');
    descriptionDiv.id = 'product-description';
    const descLabel = document.createElement('label');
    descLabel.textContent = 'Description:';
    const descP = document.createElement('p');
    descP.textContent = product.productDescription;
    descriptionDiv.appendChild(descLabel);
    descriptionDiv.appendChild(descP);

    const statusDiv = document.createElement('div');
    statusDiv.id = 'product-status';
    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Status:';
    const statusP = document.createElement('p');
    statusP.textContent = product.productIsActive ? '✅ Active' : '❌ Inactive';
    statusDiv.appendChild(statusLabel);
    statusDiv.appendChild(statusP);

    const createdAtDiv = document.createElement('div');
    createdAtDiv.id = 'product-created-at';
    const createdLabel = document.createElement('label');
    createdLabel.textContent = 'Created At:';
    const createdP = document.createElement('p');
    createdP.textContent = product.productCreatedAt;
    createdAtDiv.appendChild(createdLabel);
    createdAtDiv.appendChild(createdP);


    productBox.appendChild(productInfos);
    productBox.appendChild(descriptionDiv);
    productBox.appendChild(statusDiv);
    productBox.appendChild(createdAtDiv);

    return productBox;
}
