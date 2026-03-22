export default function Generate_box(Parent_Continer,Id,Name,Email,Roles,Date){
     
     const User_box = document.createElement("div")

     const div1 = document.createElement('div')
     const div2 = document.createElement('div')
     const div3 = document.createElement('div')
     const div4 = document.createElement('div')

     const h3Id = document.createElement('h3')
     const h3Name = document.createElement('h3')
     const h3Email = document.createElement('h3')
     const h3Roles = document.createElement('h3')
     const h3CreatedAt = document.createElement('h3')

     User_box.classList.add("User-box")


     const U_Id = document.createElement("abbr")
     U_Id.id = "U-Id";
     div1.appendChild(U_Id)

     div1.id = "non-changeble-div";

     
     const U_Name = document.createElement("abbr")
     U_Name.id = "U-Name"
     div2.appendChild(U_Id)

     div2.id = "other-divs";

     const U_Email = document.createElement("abbr")
     U_Email .id = "U-Email"
     div3.appendChild(U_Id)

     div3.id = "other-divs";
     
     const U_Roles = document.createElement("abbr")
     U_Roles.id = "U-roles"
     div4.appendChild(U_Id)

     div4.id = "other-divs";


     const U_Date = document.createElement("abbr")
     U_Date.id = "U-Date"
     div1.appendChild(U_Date)
     div1.id = "non-changeble-div";

     
     h3Id.textContent = "Id:"
     h3Name.textContent = "Name:"
     h3Email.textContent = "Email:"
     h3Roles.textContent = "Roles:"
     h3CreatedAt.textContent = "CreatedAt:"


     Parent_Continer.append(User_box)
     User_box.appendChild(div1);
     User_box.appendChild(div2);
     User_box.appendChild(div3);
     User_box.appendChild(div4);



     div1.appendChild(h3Id)
     div1.appendChild(U_Id);

     div2.appendChild(h3Name)
     div3.appendChild(h3Email)
     div4.appendChild(h3Roles)



     div1.appendChild(h3CreatedAt)
     div1.appendChild(U_Date);

     div2.appendChild(U_Name);
     div3.appendChild(U_Email);
     div4.appendChild(U_Roles);




     U_Id.textContent = Id
     
     U_Name.textContent = Name
     U_Name.setAttribute("title",U_Name.textContent)

     U_Email.textContent = Email
     U_Email.setAttribute("title",U_Email.textContent)

     U_Roles.textContent = Roles

     U_Date.textContent = Date
     U_Date.setAttribute("title",U_Date.textContent)

}