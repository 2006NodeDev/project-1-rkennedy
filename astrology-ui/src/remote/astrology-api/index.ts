//this index is going to be for setting up the base axios client
import axios from 'axios'
import { astrologyBaseUrl } from '../../environment'



// we will use this object to send off all of the other request we make to the astrology api
export const astrologyClient = axios.create({
    baseURL:astrologyBaseUrl,
    headers:{
        'Content-Type': 'application/json'
    },
    withCredentials:true
})