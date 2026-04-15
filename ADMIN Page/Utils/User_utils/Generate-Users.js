import Generate_box from "./Generate-box.js";

export default async function Generate_Users_Table(Main_container,fetchString){
  const resp = await fetch(fetchString)
  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status}`);
  }
  const result = await resp.json()
  const data = result["data"];
  Main_container.replaceChildren()
  if (Array.isArray(data)) {
    data.forEach(u => {
      Generate_box(Main_container,u.id,u.name,u.email,u.isAdmin,u.createdAt)
    });
  }
}