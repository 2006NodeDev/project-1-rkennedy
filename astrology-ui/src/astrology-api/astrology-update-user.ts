import { astrologyClient } from ".";
import { User } from "../models/User";

export const astrologyUpdateUser = async (user:User) => {
    
    try{
        console.log(user)
        let response = await astrologyClient.patch(`/users/update/${user.userId}`, user) //for the update endpoint
        console.log(response);
        return response.data
    } catch(e){
        console.log(e);
        //insert error
    }
}