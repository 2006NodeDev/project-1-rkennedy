import { astrologyClient } from "."

export const astrologyGetUserById = async (userId:number) =>{ 
    try {
        let response = await astrologyClient.get(`/users/${userId}`)
        return response.data
    } catch(e) {
        console.log(e);
        console.log("We should probably handle this");
        
    }
}