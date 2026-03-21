export default function CheckValue(text,check_type){
   if(check_type == "check_number"){
      const num = parseInt(text);
      return !Number.isNaN(num);
   }
   let possibleValues = ["pending","processing","shipped","delivered","cancelled"]
   if(check_type == "check_order_status"){
     if(!possibleValues.includes(text)){
        return false
     }
     return true
   }
}