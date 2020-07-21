import { astrologyClient } from "."

export const astrologyLogin = async (username: String, password: String) =>{
    let credentials = {
        username,
        password
    }
    try {
        let response = await astrologyClient.post('/login', credentials)
        console.log(response);
        return response.data //user?
    } catch (e) {
        console.log(e)
        return ("This is an error")
    }
}