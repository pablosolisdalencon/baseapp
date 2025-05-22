export default function jsonPure(jsonObject) {
    const jsonObjectX = new String(jsonObject);
    return(jsonObjectX.replace(/```json/g, "").replace(/```/g, ""))  
}