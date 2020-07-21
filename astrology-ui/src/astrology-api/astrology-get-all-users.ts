import { astrologyClient } from "."

export const astrologyGetAllUsers = async () => {
    try {
        let response = await astrologyClient.get(`/user-info`)
        return response.data 
    } catch(e) {
        console.log(e);
        //put in an error        
    }
}