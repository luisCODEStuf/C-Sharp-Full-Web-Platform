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


async function ChangeOrder(){
  if (isSubmittingOrder) return;
  
  const isNumber = CheckValue(idInput.value,"check_number")
  const isStatusValid = CheckValue(stateInput.value,"check_order_status")

  if(isNumber && isStatusValid){

  let confirmAlert = confirm(`Are you sure to update the status of the order with id ${idInput.value}`)

   if (confirmAlert){
    isSubmittingOrder = true;
    SendChangesBtn.disabled = true;
    const Result = await fetch("http://localhost:5218/api/admin/orders/update",{
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": getCsrfToken()
        },
        body: JSON.stringify({
            Id: idInput.value,
            NewState: stateInput.value
        })
    })
    if(!Result.ok){
      alert("something gone wrong. you can try again")
    }else{
      alert("the order was sucessfully updated")
    }
    isSubmittingOrder = false;
    SendChangesBtn.disabled = false;
  }
  }
  if(!isNumber){
    alert("O valor do id é invalido")
  }
  if(!isStatusValid){
    alert("O status é invalido")
  }
  
}


SendChangesBtn.addEventListener("click",()=>{
  ChangeOrder()
})

orderBTN.addEventListener("click",()=>{
    generateOrderBoxes(orderContainer,"http://localhost:5218/api/admin/orders/all")
})

lastPage.addEventListener("click",()=>{
    if (page > 0) {
        page--
        currentPage.textContent = page
        generateOrderBoxes(orderContainer,`http://localhost:5218/api/admin/orders/all/${page}`)
    }
})
nextPage.addEventListener("click",()=>{
    if (page < 1000) {
        page++
        currentPage.textContent = page
        generateOrderBoxes(orderContainer,`http://localhost:5218/api/admin/orders/all/${page}`)
    }
})
