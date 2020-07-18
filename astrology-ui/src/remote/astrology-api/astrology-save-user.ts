import { astrologyClient } from ".";
import { User } from "../../models/user";

export const astrologySaveUser = async (newUser:User) => {
    
    try{
        let response = await astrologyClient.post('/users', newUser)
        console.log(response);
        return response.data//should be the user object
    } catch(e){
        console.log(e);
        //should probably do something is we get an error
    }
}