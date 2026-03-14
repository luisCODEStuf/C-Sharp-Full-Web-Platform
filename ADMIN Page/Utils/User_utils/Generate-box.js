export default function Generate_box(Parent_Continer,Id,Name,Email,Roles,Date){
     
     const User_box = document.createElement("div")
     User_box.classList.add("User-box")

     const U_Id = document.createElement("abbr")
     U_Id.id = "U-Id";

     const U_Name = document.createElement("abbr")
     U_Name.id = "U-Name"

     const U_Email = document.createElement("abbr")
     U_Email .id = "U-Email"

     
     const U_Roles = document.createElement("abbr")
     U_Roles.id = "U-roles"

     const U_Date = document.createElement("abbr")
     U_Date.id = "U-Date"
    
     
     Parent_Continer.append(User_box);
     User_box.appendChild(U_Id);
     User_box.appendChild(U_Name);
     User_box.appendChild(U_Email);
     User_box.appendChild(U_Roles);
     User_box.appendChild(U_Date);

     U_Id.textContent = Id
     
     U_Name.textContent = Name
     U_Name.setAttribute("title",U_Name.textContent)

     U_Email.textContent = Email
     U_Email.setAttribute("title",U_Email.textContent)

     U_Roles.textContent = Roles

     U_Date.textContent = Date
     U_Date.setAttribute("title",U_Date.textContent)

}