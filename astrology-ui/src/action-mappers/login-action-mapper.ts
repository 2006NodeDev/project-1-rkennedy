import { astrologyLogin } from "../remote/astrology-api/astrology-login"

export const loginTypes = {
    SUCCESSFUL_LOGIN: 'astrology_SUCCESSFUL_LOGIN',
    INVALID_CREDENTIALS: 'astrology_INVALID_CREDENTIALS',
    INTERNAL_SERVER: 'astrology_LOGIN_INTERNAL_SERVER',
    BAD_REQUEST: 'astrology_LOGIN_BAD_REQUEST',
    RESET_ERROR: 'astrology_RESET_ERROR'
}

//when it comes to async processes, we can't just return the action object
//disptach cannot properly organize and time async events
//we have a solution called redux thunk
//we will return the async function and redux thunk sits in the middle and intercepts the function 
//and calls dispatch a second time with the real object
export const astrologyLoginActionMapper = (username:string, password:string) => async (dispatch:any) => {
    try{
        let currentUser = await astrologyLogin(username,password)
        dispatch({
            type:loginTypes.SUCCESSFUL_LOGIN,
            payload:{
                currentUser
            }
        })
    } catch(e){        
        if(e.message.includes('400')){
            dispatch({
                type:loginTypes.BAD_REQUEST
            })
        } else if (e.message.includes('401')){
            dispatch({
                type:loginTypes.INVALID_CREDENTIALS
            })
        }else {
            dispatch({
                type:loginTypes.INTERNAL_SERVER
            })
        }
        
    }
}

export const loginErrorReset = () =>{
    return{
        type:loginTypes.RESET_ERROR
    }
}