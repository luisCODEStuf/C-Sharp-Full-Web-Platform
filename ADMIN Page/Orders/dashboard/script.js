import generateOrderBoxes from "../../Utils/Order_utils/generate-orders.js";
import CheckValue from "../../Utils/Universal_utils/check_value.js";

const orderContainer = document.querySelector(".orders");
const orderBTN = document.getElementById("generate-orders");

const idInput = document.getElementById("Id-input")
const stateInput = document.getElementById("Order-input")
const SendChangesBtn = document.getElementById("Save-changes")

const lastPage = document.getElementById("last-page")
const currentPage = document.getElementById("page")
const nextPage = document.getElementById("next-page")

let page = 0;


SendChangesBtn.addEventListener("click",()=>{
  const isNumber = CheckValue(idInput.value,"check_number")
  const isStatusValid = CheckValue(stateInput.value,"check_order_status")
  if(isNumber != NaN && isStatusValid){
    fetch("http://localhost:5218/api/admin/orders/update",{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Id: idInput.value,
            NewState: stateInput.value
        })
    })
  }
  
  if(!isNumber){
    alert("O valor do id é invalido")
  }
  if(!isStatusValid){
    alert("O status é invalido")
  }
  
})




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
