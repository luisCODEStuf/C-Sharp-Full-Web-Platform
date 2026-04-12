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
                productIdInput.value = product.productId;
                productNameInput.value = product.productName;
                productPriceInput.value = product.productPrice;
                productStockInput.value = product.productStock;
                productDescriptionInput.value = product.productDescription;
                productImageInput.value = product.ProductImageUrl || product.productImageUrl;
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
    const apiUrl = "http://localhost:5218/products/all"; 
    await generateProductsTable(productsContainer, apiUrl);
 
    const response = await fetch(apiUrl);
    const result = await response.json();
    currentProducts = result.data || result.products || result;
    
    attachProductClickListeners();
});




saveChangesBtn.addEventListener("click", async () => {
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
        
        if (productNameInput.value.trim()) updateData.Name = productNameInput.value.trim();
        if (productPriceInput.value) updateData.Price = parseFloat(productPriceInput.value);
        if (productStockInput.value) updateData.Stock = parseInt(productStockInput.value);
        if (productDescriptionInput.value.trim()) updateData.Description = productDescriptionInput.value.trim();
        if (productImageInput.value.trim()) updateData.ImageUrl = productImageInput.value.trim();
        const activeValue = productActiveInput.value.trim().toLowerCase();
        if (activeValue === "active") {
            updateData.IsActive = "active";
        } else if (activeValue === "notactive") {
            updateData.IsActive = "notactive";
        }

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
});


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
