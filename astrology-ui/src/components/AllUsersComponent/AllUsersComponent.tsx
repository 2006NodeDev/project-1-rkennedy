import React, { FunctionComponent, useState, useEffect } from "react"
import { UserDisplayComponent } from '../UserDisplayComponent/UserDisplayComponent'
import { User } from '../../models/User'
import { astrologyGetAllUsers } from "../../astrology-api/astrology-get-all-users"

export const AllUsersComponent:FunctionComponent<any> = (props) => {

    //fetch all the user information
    let [allUsers, changeAllUsers] = useState<User[]>([])
    useEffect(()=>{//runs on every single rerender

        const getUsers = async ()=>{
                let response = await astrologyGetAllUsers()
                changeAllUsers(response)
        }
        if(allUsers.length === 0){
            //get the users if func hasn't been called already
            //update the state with users
            getUsers()
        }
    })

    //map data into components and then put them into the jsx 
    let userDisplays = allUsers.map((user)=>{
        //give the components keys so that react can tell them apart
        return <UserDisplayComponent key={'user-key-' + user.userId} user={user}/>
    })

    return(
        <div>
            {userDisplays}
        </div>
    )
}