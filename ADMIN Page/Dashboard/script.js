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


alternateBarBtn.addEventListener("click",()=>{
  Main.classList.toggle("sidebar-hidden")
  verticalBar.classList.toggle("hidden")
})

// ============================================
console.log('MainContainer:', MainContainer);
console.log('GenUsers:', GenUsers);
console.log('LastPageBTN:', LastPageBTN);        // ← Provavelmente NULL
console.log('NextPageBTN:', NextPageBTN);        // ← Provavelmente NULL
console.log('PageNumber:', PageNumber);
console.log('Main:', Main);
console.log('verticalBar:', verticalBar);
console.log('idInput:', idInput);
console.log('changeName:', changeName);
console.log('changeEmail:', changeEmail);
console.log('changeRoles:', changeRoles);
console.log('saveChangesBtn:', saveChangesBtn);
console.log('errorMessage:', errorMessage);
console.log('alternateBarBtn:', alternateBarBtn);

async function changeClient(){
    errorMessage.innerHTML = "";
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
    
    if(!clientEmail !== ""){
    const isEmailValid = CheckValue(clientEmail,"check_email");
    if(!isEmailValid){
        errorMessage.textContent = "email invalido"
        errorMessage.style.color = "red"
        return;
    }
    }

    let IsAdmin;
    if(clientRoles == "Admin"){
      IsAdmin = true
    }else if (clientRoles == "Not admin"){
        IsAdmin = false
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
        alert("the user was sucessfully updated!")
      } 

    }
}

saveChangesBtn.addEventListener("click",()=>{
    changeClient()
})



let page = 1;

LastPageBTN.addEventListener('click',()=>{
    page--;
    PageNumber.textContent = page
    Generate_Users_Table(MainContainer,`http://localhost:5218/Users/all/filter/page${page}`)
})

NextPageBTN.addEventListener('click',()=>{
    page++;
    PageNumber.textContent = page
    Generate_Users_Table(MainContainer,`http://localhost:5218/Users/all/filter/page${page}`)
})


GenUsers.addEventListener('click',()=>{
    Generate_Users_Table(MainContainer,`http://localhost:5218/Users/all/filter/page${page}`)
})

