import CheckValue from "../Utils/Universal_utils/check_value.js";
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
const errorMessage = document.getElementById("error-message")


const filterBTN = document.getElementById("filter-btn")

const alternateBarBtn = document.getElementById('alternate-bar');

let isSubmittingUserFilter = false;

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
        UserContainer.textContent = '';
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
     
    
        try {
            await Generate_Users_Table(UserContainer,`http://localhost:5218/api/admin/users/filter?${params}`)
        } catch (fetchError) {
            const errorDiv = document.createElement('p');
            errorDiv.textContent = 'Error loading users: ' + fetchError.message;
            UserContainer.appendChild(errorDiv);
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

async function changeClient(){
    if (isSubmittingUserFilter) return;
    
    errorMessage.textContent = ""
    const clientId = idInput.value
    const clientName = changeName.value;
    const clientEmail = changeEmail.value;
    const clientRoles = changeRoles.value;

    if(!Number(clientId)){
       return;
    }
    if(clientName === "" &&
        clientEmail === "" &&
        clientRoles === ""  
    )
    {
        return;
    }
    let IsAdmin = null;
    const roleNormalized = clientRoles.trim().toLowerCase();
    if(roleNormalized === "admin"){
      IsAdmin = true
    }else if (roleNormalized === "not admin" || roleNormalized === "false"){
        IsAdmin = false
    }
    
    
    if(clientEmail !== ""){
    const isEmailValid = CheckValue(clientEmail,"check_email");
    if(!isEmailValid){
        errorMessage.textContent = "email invalido"
        errorMessage.style.color = "red"
        return;
    }
    }

    
      const confirmResult = confirm(`Are you sure to change the datas of the user ${clientId} ?`)
    if(confirmResult){
      if (IsAdmin === null) {
        alert("Please select a valid role: 'admin' or 'not admin'");
        return;
      }
      
      isSubmittingUserFilter = true;
      saveChangesBtn.disabled = true;
      
      try {
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
          alert("the user was sucessfully updated!")
        }
      } catch (error) {
        alert("Error updating user: " + error.message);
      } finally {
        isSubmittingUserFilter = false;
        saveChangesBtn.disabled = false;
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
    if (page > 1) {
        page--;
        PageNumber.textContent = page
        loadUsers()
    }
})
NextPageBTN.addEventListener('click',()=>{
    if (page < 1000) {
        page++;
        PageNumber.textContent = page;
        loadUsers()
    }
})
