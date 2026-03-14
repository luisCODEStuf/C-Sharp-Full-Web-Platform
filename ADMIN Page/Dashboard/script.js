import Generate_Users_Table from "../Utils/User_utils/Generate-Users.js";

const MainContainer = document.querySelector(".users")
const GenUsers = document.getElementById("generate-users")
const LastPageBTN = document.getElementById("last-page")
const NextPageBTN = document.getElementById("next-page")
const PageNumber = document.getElementById("page")


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


GenUsers.addEventListener('click',() =>{
    Generate_Users_Table(MainContainer,`http://localhost:5218/Users/all/filter/page${page}`)
})

