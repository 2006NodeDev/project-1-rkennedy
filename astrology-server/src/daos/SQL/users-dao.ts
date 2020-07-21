import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { UserDTOtoUserConverter } from "../../utilities/UserDTO-to-Users-converter";
import { User } from "../../models/User";
import { UserNotFoundError } from "../../errors/User-Not-Found-Error";
import { AuthFailureError } from "../../errors/Authentification-Failure";

export async function getAllUsers(): Promise<User[]>{
    //first, decleare a client
    let client:PoolClient
    try {
        //get connection
        client = await connectionPool.connect()
        //send query
        let results = await client.query(`select * from astrology.users u;`)
        //return results
        return results.rows.map(UserDTOtoUserConverter)
    } catch(e) {
        //if we get an error we don't know
        console.log(e);
        throw new Error ("This error can't be handled")
    } finally {
        //let the connection go back to the pool
        client && client.release()
    }
}

//find users by id
export async function findUsersById (userId: number): Promise<User> {
    let client: PoolClient 
    try{ 
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select * from astrology.users u 
                                                    where u.user_id = $1;`, [userId])
        if (results.rowCount === 0){
            throw new Error('NotFound')
        } else {
            return UserDTOtoUserConverter(results.rows[0])
        }
    } catch(e) {
        if (e.message === "NotFound"){
            throw new UserNotFoundError
        }
        console.log(e);
        throw new Error ("This error can't be handled")
    } finally { 
        client && client.release()
    }
}

//update a user info
export async function updateUser (updatedUser:User): Promise <User> {
    let client: PoolClient

    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;') //start transaction

        if (updatedUser.username){
            await client.query(`update astrology.users set username = $1 where user_id = $2;`,
                                [updatedUser.username, updatedUser.userId])
        }
        if (updatedUser.password){
            await client.query(`update astrology.users set "password" = $1 where user_id = $2;`,
                                [updatedUser.password, updatedUser.userId])
        } 
        if (updatedUser.firstName){
            await client.query(`update astrology.users set first_name = $1 where user_id = $2;`,
                                [updatedUser.firstName, updatedUser.userId])
        } 
        if (updatedUser.lastName){
            await client.query(`update astrology.users set last_name = $1 where user_id = $2;`,
                                [updatedUser.lastName, updatedUser.userId])
        } 
        if (updatedUser.email){
            await client.query(`update astrology.users set email = $1 where user_id = $2;`,
                                [updatedUser.email, updatedUser.userId])
        }
        if (updatedUser.role){ 
            await client.query(`update astrology.users set "role" = $1 where user_id = $2;`,
            [updatedUser.role, updatedUser.userId])
        }
        if (updatedUser.image){ 
            await client.query(`update astrology.users set "image" = $1 where user_id = $2;`,
            [updatedUser.image, updatedUser.userId])
        }

        await client.query('COMMIT;') //end transaction
        return findUsersById(updatedUser.userId)

    } catch(e) {
        client && client.query('ROLLBACK;') //if a js error takes place, send it back
        console.log(e);
        throw new Error ("This error can't be handled")
    } finally {
        client && client.release()
    }
}

//For login
export async function getUserByUsernameAndPassword (username:String, password:String): Promise<User>{
    let client: PoolClient 
    try{ 
        client = await connectionPool.connect()
        let results: QueryResult = await client.query(`select * from astrology.users u 
                                                    where u.username = $1 and u."password" = $2;`, [username, password])      
        if (results.rowCount === 0){
            throw new Error("NotFound")
        } 
        return UserDTOtoUserConverter(results.rows[0]) 
    } catch(e) {
        if (e.message === "NotFound"){
            throw new AuthFailureError
        }
        console.log(e);
        throw new Error ("This error can't be handled")
    } finally { 
        client && client.release()
    }
}

//Register a new user
export async function saveNewUser(newUser: User): Promise <User> {
    let client: PoolClient

    try{
        client = await connectionPool.connect()
        let results = await client.query(`insert into astrology.users ("username", "password", "first_name", "last_name", "email", "role", "image")
                                            values ($1,$2,$3,$4,$5,$6,$7) returning user_id`, 
                                            [newUser.username, newUser.password, newUser.firstName, newUser.lastName, 
                                            newUser.email, newUser.role, newUser.image])
        
        newUser.userId = results.rows[0].user_id        
        return newUser   
    } catch(e) {       
        console.log(e);
        throw new Error ("This error can't be handled")
    } finally {
        client && client.release()
    }
}