import Generate_Users_Table from "../Utils/User_utils/Generate-Users.js";

const Main = document.querySelector("main");
const UserContainer = document.querySelector(".User-container")

const searchId = document.getElementById('Search-Id');
const searchName = document.getElementById('Search-Name');
const searchEmail = document.getElementById('Search-Email');
const searchFilterInput = document.getElementById('Search-Filter-ipt');

const isAdminTrue = document.getElementById('IsAdmin-True');
const isAdminFalse = document.getElementById('IsAdmin-False');

const filterDateFrom = document.getElementById('Filter-Date-From');
const filterDateTo = document.getElementById('Filter-Date-To');

const sortById = document.getElementById('SortBy-Id');
const sortByName = document.getElementById('SortBy-Name');
const sortByEmail = document.getElementById('SortBy-Email');

const orderAsc = document.getElementById("Order-Asc")
const orderDesc = document.getElementById("Order-Desc")

const verticalBar = document.querySelector(".vertical-bar")
const idInput = document.getElementById('Id-input');
const changeName = document.getElementById('change-Name');
const changeEmail = document.getElementById('change-Email');
const changeRoles = document.getElementById('change-Roles');
const saveChangesBtn = document.getElementById('Save-changes');
const successMessage = document.getElementById("success-message")

const filterBTN = document.getElementById("filter-btn")

const alternateBarBtn = document.getElementById('alternate-bar');


const LastPageBTN = document.getElementById("last-page")
const NextPageBTN = document.getElementById("next-page")
const PageNumber = document.getElementById("page")
let page = 1;




alternateBarBtn.addEventListener("click",()=>{
  Main.classList.toggle("sidebar-hidden")
  verticalBar.classList.toggle("hidden")
})

async function loadUsers() {
    try {
        UserContainer.innerHTML = ""
        const params = new URLSearchParams();
        
        if (searchFilterInput.value) {
            params.append('search', searchFilterInput.value);
        }
        
        if (isAdminTrue.checked && !isAdminFalse.checked) {
            params.append('isAdmin', 'true');
        } else if (isAdminFalse.checked && !isAdminTrue.checked) {
            params.append('isAdmin', 'false');
        }
        
        if (filterDateFrom.value) {
            params.append('dateFrom', filterDateFrom.value);
        }
        if (filterDateTo.value) {
            params.append('dateTo', filterDateTo.value);
        }
        
        if (sortById.checked) {
            params.append('sortBy', 'id');
        } else if (sortByName.checked) {
            params.append('sortBy', 'name');
        } else if (sortByEmail.checked) {
            params.append('sortBy', 'email');
        }

        if(orderAsc.checked && !orderDesc.checked){
          params.append('Order','asc')
        }else if(orderDesc.checked && !orderAsc.checked){
          params.append('Order','desc')
        }
        params.append("Page",page)
     
    
        Generate_Users_Table(UserContainer,`http://localhost:5218/api/admin/users/filter?${params}`)
        
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

async function changeClient(){
    const clientId = idInput.value
    const clientName = changeName.value;
    const clientEmail = changeEmail.value;
    const clientRoles = changeRoles.value;

    if(!Number(clientId)){
       return;
    }
    if(clientName == "" &&
        clientEmail == "" &&
        clientRoles == ""  
    )
    {
        return;
    }
    let IsAdmin;
    if(clientRoles == "Admin"){
      IsAdmin == true
    }else if (clientRoles == "Not admin"){
        IsAdmin == false
    }

    const confirmResult = confirm(`Are you sure to change the datas of the user ${clientId} ?`)
    if(confirmResult){
      const Result = await fetch("http://localhost:5218/api/admin/users/change",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: parseInt(clientId),
            name: clientName,
            email: clientEmail,
            isAdmin: IsAdmin
        })
      }) 
      if(!Result.ok){
        alert("the user with id" + clientId + "was not found")
      }else if(Result.ok){
        successMessage.textContent = "user was successfully changed!"
        setTimeout(()=>{
          successMessage.innerHTML =""
        },3000)
      } 

    }
}

saveChangesBtn.addEventListener("click",()=>{
    changeClient();
})
filterBTN.addEventListener("click",()=>{
  loadUsers()
})
LastPageBTN.addEventListener('click',()=>{
    page--;
    PageNumber.textContent = page
   loadUsers()
})

NextPageBTN.addEventListener('click',()=>{
    page++;
    PageNumber.textContent = page;
   loadUsers()    
})
