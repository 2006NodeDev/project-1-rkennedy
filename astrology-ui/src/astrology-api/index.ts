import axios from "axios"

//for setting up the base axios client
//axios allows us to build an object that holds all the base information/config for our connection to server
//thus we can call axiosObject.get /post /patch etc.

//we will use this to send all requests we make to the lightlyburnding api
export const astrologyClient = axios.create ({
    baseURL: 'http://localhost:2020',
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials:true
})