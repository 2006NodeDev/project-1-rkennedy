import { astrologyClient } from "."

export const astrologyLogOut = async () =>{
    try {
        let response = await astrologyClient.delete('/logout')
        console.log(response);
        return response.data //should be null?
    } catch (e) {
        console.log(e)
        return ("This is an error")
    }
}