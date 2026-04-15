export default function CheckValue(text,check_type){
   if(check_type === "check_number"){
      const num = parseInt(text);
      return !Number.isNaN(num);
   }
   
   let possibleValues = ["pending","processing","shipped","delivered","cancelled"]
   if(check_type === "check_order_status"){
     if(!possibleValues.includes(text)){
        return false
     }
     return true
   }

   if(check_type === "check_email"){
      const regex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}$/;
      if (!regex.test(text)) return false;
      if (text.split('.').some(part => part.length === 0)) return false;
      if (text.length > 254) return false;
      return true;
   }
   
   return false;
}