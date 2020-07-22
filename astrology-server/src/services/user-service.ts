import { User } from "../models/User";
import { saveProfilePicture } from "../daos/cloud-storage/user-images";
import { bucketBaseUrl } from "../daos/cloud-storage";
//import { expressEventEmitter, customExpressEvents } from "../event-listeners";
import { getAllUsers, findUsersById, saveNewUser, getUserByUsernameAndPassword, updateUser } from "../daos/SQL/users-dao";

//the most basic service function you will see (all it does is call the dao)
//its easier to expand a function that already exists instead of inserting a new function in to the mix
//(easier to edit it later)
export async function getAllUsersService(): Promise<User[]> {
    return await getAllUsers()
} //not currently actually using this, just an example

export async function getUserByIDService(id: number): Promise<User> {
    return await findUsersById(id)
}

export async function getUserByUserNameAndPasswordService(username:string, password:string): Promise<User> {
    return await getUserByUsernameAndPassword(username, password)
}

export async function saveNewUserService(newUser: User): Promise<User> {
    //two major process to manage in this function
    try {
        if (newUser.image) { //avoid splitting a void string!
            let base64Image = newUser.image
            let [dataType, imageBase64Data] = base64Image.split(';base64,')// gets us the two important parts of the base 64 string
            //we need to make sure picture is in the right format
            let contentType = dataType.split('/').pop()
            //then the pop method gets us the last thing in the array
            newUser.image = `${bucketBaseUrl}/Astrology_Profiles/${newUser.username}.${contentType}`
            //we need to add the picture path to the user data in the sql database        
            //we need to save new user data to the sql database
            //we need to save a picture to cloud storage 
            await saveProfilePicture(contentType, imageBase64Data, `Astrology_Profiles/${newUser.username}.${contentType}`)
        //spaces are ok in usernames (for file path) :D

        //with event driven design after I completed the save a user process
        //send an event saying tis done with the relevent info
        //expressEventEmitter.emit(customExpressEvents.NEW_USER, newUser)
        
        // } else {
        //     newUser.image = 'https://storage.googleapis.com/project-1-rchlriedel-bucket/LOTR_Profiles/noname.jpg'
        }
        let savedUser = await saveNewUser(newUser)

        return savedUser
    } catch (e) {
        console.log(e)
        throw e
    }
    //if we can't save the user in the db, don't save the picture
    //if we do save the user and the picture save fails - pretend that nothing happened ( you should probably update the user to set the image to null)
}

export async function updateUserService(updatedUser: User): Promise<User>{
    try {
        if (updatedUser.image) {
            //essentially the above, but we are switching the dao fucntion and the input
            let base64Image = updatedUser.image
            let [dataType, imageBase64Data] = base64Image.split(';base64,')
            let contentType = dataType.split('/').pop()

            updatedUser.image = `${bucketBaseUrl}/Astrology_Profiles/${updatedUser.username}.${contentType}`

            await saveProfilePicture(contentType, imageBase64Data, `Astrology_Profiles/${updatedUser.username}.${contentType}`)
        }
        let savedUser = await updateUser(updatedUser)
        //expressEventEmitter.emit(customExpressEvents.NEW_USER, updatedUser)
        return savedUser
    } catch (e) {
        console.log(e)
        throw e
    }   
}