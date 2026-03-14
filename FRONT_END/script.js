const NameInput = document.getElementById("name");
const Email = document.getElementById("email");
const Password = document.getElementById("password");
const LoginBtn = document.getElementById("login");
const Error_Text = document.getElementById("error");

function Send(){
    const NameValue = NameInput.value;
    const EmailValue = Email.value;
    const PasswordValue = Password.value;
    
    fetch("http://localhost:5218/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            Name: NameValue,
            Email: EmailValue,
            Password: PasswordValue
        })
    })
    .then(response => {
        if(response.status == 409){
         Error_Text.innerHTML =""   
         Error_Text.textContent = "Vixi, parece que o usuario ja existe."
        }


        return response.json()
    })
    .then(data => {
        console.log("Login response:", data);
    })
    .catch(error => {
        console.log("an error ocurred:"+ error);
    });
}

LoginBtn.addEventListener("click", Send);