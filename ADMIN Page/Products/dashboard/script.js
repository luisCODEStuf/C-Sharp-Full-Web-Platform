import generateProductsTable from "../../Utils/Product_Utils/Create_Products_table.js";
import CheckValue from "../../Utils/Universal_utils/check_value.js";

const productsContainer = document.querySelector(".products-grid");
const productBTN = document.getElementById("generate-products");
const alternateBar = document.getElementById("alternate-bar");


const productIdInput = document.getElementById("product-id-input");
const productNameInput = document.getElementById("product-name-input");
const productPriceInput = document.getElementById("product-price-input");
const productStockInput = document.getElementById("product-stock-input");
const productDescriptionInput = document.getElementById("product-description-input");
const productImageInput = document.getElementById("product-image-input");
const productActiveInput = document.getElementById("product-active-input");
const saveChangesBtn = document.getElementById("save-changes");


const lastPage = document.getElementById("last-page");
const currentPage = document.getElementById("page");
const nextPage = document.getElementById("next-page");


const verticalBar = document.querySelector(".vertical-bar");
const main = document.querySelector("main");

let page = 0;
let currentProduct = null;
let currentProducts = [];


async function attachProductClickListeners() {
    const productBoxes = document.querySelectorAll(".product-box");
    
    productBoxes.forEach(box => {
        box.addEventListener("click", function() {
            const product = currentProducts.find(p => `product-${p.productId}` === box.id);
            if (product) {
                productIdInput.value = product.productId || '';
                productNameInput.value = product.productName || '';
                productPriceInput.value = product.productPrice || '';
                productStockInput.value = product.productStock || '';
                productDescriptionInput.value = product.productDescription || '';
                productImageInput.value = product.ProductImageUrl || product.productImageUrl || '';
                productActiveInput.value = product.productIsActive ? "active" : "notactive";
            }
        });
    });
}


alternateBar.addEventListener("click", () => {
    verticalBar.classList.toggle("hidden");
    main.classList.toggle("sidebar-hidden");
});


productBTN.addEventListener("click", async () => {
    try {
        const response = await fetch(apiUrl);
        if (response.ok) {
            const result = await response.json();
            currentProducts = result.data || result.products || result;
            attachProductClickListeners();
        }
    } catch (error) {
        console.error("Error loading products:", error);
    }json();
    currentProducts = result.data || result.products || result;
    
    attachProductClickListeners();
});
if (isSubmittingProduct) return;
    
    const productId = productIdInput.value.trim();
    
    if (!productId) {
        alert("Please select a product or enter a product ID");
        return;
    }

    const isIdValid = CheckValue(productId, "check_number");
    if (!isIdValid) {
        alert("Product ID must be a valid number");
        return;
    }

    const confirmAlert = confirm(`Are you sure you want to update product ${productId}?`);
    
    if (confirmAlert) {
        const updateData = {
            Id: parseInt(productId),
            Name: null,
            Price: null,
            Stock: null,
            Description: null,
            ImageUrl: null,
            IsActive: null
        };
        
        const nameValue = productNameInput.value.trim();
        if (nameValue && nameValue.length <= 500) updateData.Name = nameValue;
        
        if (productPriceInput.value) {
            const price = parseFloat(productPriceInput.value);
            if (!isNaN(price) && price >= 0 && price <= 999999.99) {
                updateData.Price = price;
            } else {
                alert("Invalid price (must be between 0 and 999999.99)");
                return;
            }
        }
        
        if (productStockInput.value) {
            const stock = parseInt(productStockInput.value);
            if (!isNaN(stock) && stock >= 0 && stock <= 999999) {
                updateData.Stock = stock;
            } else {
                alert("Invalid stock (must be between 0 and 999999)");
                return;
            }
        }
        
        const descValue = productDescriptionInput.value.trim();
        if (descValue && descValue.length <= 5000) updateData.Description = descValue;
        else if (descValue && descValue.length > 5000) {
            alert("Description is too long (max 5000 characters)");
            return;
        }
        
        const imageValue = productImageInput.value.trim();
        if (imageValue) {
            if (!isValidImageUrl(imageValue)) {
                alert("Invalid image URL");
                return;
            }
            updateData.ImageUrl = imageValue;
        }
        
        const activeValue = productActiveInput.value.trim().toLowerCase();
        if (activeValue === "active") {
            updateData.IsActive = "active";
        } else if (activeValue === "notactive") {
            updateData.IsActive = "notactive";
        }

        isSubmittingProduct = true;
        saveChangesBtn.disabled = true;
        
        try {
            const response = await fetch(`http://localhost:5218/api/admin/products/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...updateData
                })
            });

            if (!response.ok) {
                alert("Something went wrong. Please try again.");
            } else {
                alert("Product updated successfully!");
                clearProductForm();
                
                await generateProductsTable(productsContainer, `http://localhost:5218/products/all/${page || 1}`);
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product: " + error.message);
        }
    }


function clearProductForm() {
    productIdInput.value = "";
    productNameInput.value = "";
    productPriceInput.value = "";
    productStockInput.value = "";
    productDescriptionInput.value = "";
    productImageInput.value = "";
    productActiveInput.value = "";
}


lastPage.addEventListener("click", async () => {
    if (page > 0) {
        page--;
        currentPage.textContent = page;
        const apiUrl = `http://localhost:5218/products/all/${page}`; 
        await generateProductsTable(productsContainer, apiUrl);
        
        const response = await fetch(apiUrl);
        const result = await response.json();
        currentProducts = result.data || result.products || result;
        attachProductClickListeners();
    }
});

nextPage.addEventListener("click", async () => {
    page++;
    currentPage.textContent = page;
    const apiUrl = `http://localhost:5218/products/all/${page}`; 
    await generateProductsTable(productsContainer, apiUrl);
    
    const response = await fetch(apiUrl);
    const result = await response.json();
    currentProducts = result.data || result.products || result;
    attachProductClickListeners();
});
