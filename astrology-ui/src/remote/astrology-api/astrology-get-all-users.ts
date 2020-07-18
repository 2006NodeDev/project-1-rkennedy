import { astrologyClient } from ".";

export const astrologyGetAllUsers = async () =>{
    try{
        let response = await astrologyClient.get('/users')
        return response.data
    }catch(e){
        console.log(e);
        console.log('We should probably handle this');
    }
}