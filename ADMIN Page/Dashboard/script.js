import Generate_Users_Table from "../Utils/User_utils/Generate-Users.js";
import CheckValue from "../Utils/Universal_utils/check_value.js";

const MainContainer = document.querySelector(".users")
const GenUsers = document.getElementById("generate-users")
const LastPageBTN = document.getElementById("last-page")
const NextPageBTN = document.getElementById("next-page")
const PageNumber = document.getElementById("page")

const Main = document.querySelector("main")
const verticalBar = document.querySelector(".vertical-bar")

const idInput = document.getElementById('Id-input');
const changeName = document.getElementById('change-Name');
const changeEmail = document.getElementById('change-Email');
const changeRoles = document.getElementById('change-Roles');
const saveChangesBtn = document.getElementById('Save-changes');
export const errorMessage = document.getElementById("email-error-message")

const alternateBarBtn = document.getElementById('alternate-bar');

let isSubmittingUser = false;

alternateBarBtn.addEventListener("click",()=>{
  Main.classList.toggle("sidebar-hidden")
  verticalBar.classList.toggle("hidden")
})

async function changeClient(){
    if (isSubmittingUser) return;
    
    errorMessage.textContent = "";
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
    
    if(clientEmail !== ""){
    const isEmailValid = CheckValue(clientEmail,"check_email");
    if(!isEmailValid){
        errorMessage.textContent = "email invalido"
        errorMessage.style.color = "red"
        return;
    }
    }

    let IsAdmin = null;
    const roleNormalized = clientRoles.trim().toLowerCase();
    if(roleNormalized === "admin"){
      IsAdmin = true
    }else if (roleNormalized === "not admin" || roleNormalized === "false"){
        IsAdmin = false
    }

    const confirmResult = confirm(`Are you sure to change the datas of the user ${clientId} ?`)
    if(confirmResult){
      if (IsAdmin === null) {
        alert("Please select a valid role: 'Admin' or 'Not admin'");
        return;
      }
      
      isSubmittingUser = true;
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
        isSubmittingUser = false;
        saveChangesBtn.disabled = false;
      }
    }
}

saveChangesBtn.addEventListener("click",()=>{
    changeClient()
})



let page = 1;

LastPageBTN.addEventListener('click',()=>{
    if (page > 1) {
        page--;
        PageNumber.textContent = page
        Generate_Users_Table(MainContainer,`http://localhost:5218/Users/all/filter/page${page}`)
    }
})

NextPageBTN.addEventListener('click',()=>{
    if (page < 1000) {
        page++;
        PageNumber.textContent = page
        Generate_Users_Table(MainContainer,`http://localhost:5218/Users/all/filter/page${page}`)
    }
})


GenUsers.addEventListener('click',()=>{
    Generate_Users_Table(MainContainer,`http://localhost:5218/Users/all/filter/page${page}`)
})

