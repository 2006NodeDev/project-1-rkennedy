import { astrologyClient } from "."
import { User } from "../../models/user";

export const astrologyLogin = async (username:string, password:string) => {
    let credentials = {
        username,
        password
    }
    try{
        let response = await astrologyClient.post('/login', credentials)
        console.log(response);
        return response.data//should be the user object
    } catch(e){
        console.log(e);
        //should probably do something if we get an error
    }
}