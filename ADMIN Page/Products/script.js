import generateProductsTable from "../Utils/Product_Utils/Create_Products_table.js";
import CheckValue from "../Utils/Universal_utils/check_value.js";

const productsContainer = document.querySelector(".products-grid");
const productBTN = document.getElementById("generate-products");
const alternateBar = document.getElementById("alternate-bar");

// Sidebar inputs
const productIdInput = document.getElementById("product-id-input");
const productNameInput = document.getElementById("product-name-input");
const productPriceInput = document.getElementById("product-price-input");
const productStockInput = document.getElementById("product-stock-input");
const productDescriptionInput = document.getElementById("product-description-input");
const productImageInput = document.getElementById("product-image-input");
const productActiveInput = document.getElementById("product-active-input");
const saveChangesBtn = document.getElementById("save-changes");

// Pagination
const lastPage = document.getElementById("last-page");
const currentPage = document.getElementById("page");
const nextPage = document.getElementById("next-page");

// Sidebar
const verticalBar = document.querySelector(".vertical-bar");
const main = document.querySelector("main");

let page = 0;
let currentProduct = null;

// Toggle sidebar visibility
alternateBar.addEventListener("click", () => {
    verticalBar.classList.toggle("hidden");
    main.classList.toggle("sidebar-hidden");
});

// Load products
productBTN.addEventListener("click", async () => {
    const apiUrl = "http://localhost:5218/products/all"; // Adjust your API endpoint
    await generateProductsTable(productsContainer, apiUrl);
    
    // Add click event to product boxes for editing
    const productBoxes = document.querySelectorAll(".product-box");
    productBoxes.forEach(box => {
        box.addEventListener("click", (e) => {
            const productId = box.id.replace("product-", "");
            const product = {
                id: productId,
                name: box.querySelector("#product-infos")?.textContent || "",
                price: 0,
                stock: 0
            };
            loadProductForEdit(box);
        });
    });
});

// Load product data into sidebar for editing
function loadProductForEdit(productBox) {
    try {
        const infosDiv = productBox.querySelector("#product-infos");
        const descDiv = productBox.querySelector("#product-description");
        const statusDiv = productBox.querySelector("#product-status");
        const createdAtDiv = productBox.querySelector("#product-created-at");
        const imageDiv = productBox.querySelector("#product-image");

        // Extract data from the product box (you'll need to store data attributes on creation)
        const productId = productBox.id.replace("product-", "");
        
        productIdInput.value = productId;
        
        // Try to extract values from the box (this depends on how the data is displayed)
        if (infosDiv) {
            const text = infosDiv.textContent;
            // Parse the info - this is a simplified approach
            // You might want to add data attributes to the product box instead
        }
        
        // Scroll sidebar to top
        verticalBar.scrollTop = 0;
    } catch (error) {
        console.error("Error loading product for edit:", error);
    }
}

// Save product changes
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
        const updateData = {};
        
        if (productNameInput.value.trim()) updateData.name = productNameInput.value.trim();
        if (productPriceInput.value) updateData.price = parseFloat(productPriceInput.value);
        if (productStockInput.value) updateData.stock = parseInt(productStockInput.value);
        if (productDescriptionInput.value.trim()) updateData.description = productDescriptionInput.value.trim();
        if (productImageInput.value.trim()) updateData.imageUrl = productImageInput.value.trim();
        updateData.isActive = productActiveInput.checked;

        try {
            const response = await fetch(`http://localhost:5218/api/admin/products/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Id: productId,
                    ...updateData
                })
            });

            if (!response.ok) {
                alert("Something went wrong. Please try again.");
            } else {
                alert("Product updated successfully!");
                clearProductForm();
                // Reload products
                await generateProductsTable(productsContainer, "http://localhost:5218/api/products");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Error updating product: " + error.message);
        }
    }
});

// Clear form
function clearProductForm() {
    productIdInput.value = "";
    productNameInput.value = "";
    productPriceInput.value = "";
    productStockInput.value = "";
    productDescriptionInput.value = "";
    productImageInput.value = "";
    productActiveInput.checked = false;
}

// Pagination (placeholder - add logic as needed)
lastPage.addEventListener("click", () => {
    if (page > 0) {
        page--;
        currentPage.textContent = page;
        // Load products for this page
    }
});

nextPage.addEventListener("click", () => {
    page++;
    currentPage.textContent = page;
    // Load products for this page
});
