
import React, { FunctionComponent, useState, useEffect } from 'react';
import { User } from '../../models/User';
import { useParams} from 'react-router-dom'
import { astrologyGetUserById } from '../../astrology-api/astrology-get-user-by-id';
import { UserDisplayComponent } from '../UserDisplayComponent/UserDisplayComponent';

export const ProfileComponent:FunctionComponent<any> = (props) => {
    let [userProfile, changeUserProfile] = useState<null | User>(null)
    let {userId} = useParams()

    // this will run after every single render
    useEffect(()=>{
        //we define an async operation we want to run
        let getUser = async ()=>{
            //we await user info and then call a state updat function with it
            let userInfo = await astrologyGetUserById(userId)
            changeUserProfile(userInfo)
        }
        //if we haven't gotten a user profile yet
        if(!userProfile || userProfile.userId !== +userId){
            //go get the user
            getUser()
        }
        //else do nothing
    })
    
    //why is this not working?
    return (
        (userProfile)?
        <UserDisplayComponent user={userProfile} />
        : 
        <div>
            <h3>User Not Found</h3>
        </div>
    )
}