import generateOrderBoxes from "../../Utils/Order_utils/generate-orders.js";
const orderContainer = document.querySelector(".orders");
const orderBTN = document.getElementById("generate-orders");

const lastPage = document.getElementById("last-page")
const currentPage = document.getElementById("page")
const nextPage = document.getElementById("next-page")

let page = 0;

orderBTN.addEventListener("click",()=>{
    generateOrderBoxes(orderContainer,"http://localhost:5218/api/admin/orders/all")
})

lastPage.addEventListener("click",()=>{
    page--
    currentPage.innerHTML = page
    generateOrderBoxes(orderContainer,`http://localhost:5218/api/admin/orders/all/${page}`)

})
nextPage.addEventListener("click",()=>{
    page++
    currentPage.innerHTML = page
    generateOrderBoxes(orderContainer,`http://localhost:5218/api/admin/orders/all/${page}`)

})
