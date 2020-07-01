import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { UserDTOtoUserConvertor } from "../utils/UserDTO-to-User-convertor";
import { UserNotFoundError } from "../errors/UserNotFoundError"
import { UserInputError } from "../errors/UserInputError";
import { AuthFailureError } from '../errors/AuthFailureError';
//import { AuthorizationError } from '../errors/AuthorizationError';
//import { LoginInvalidCredentialsError } from "../errors/LoginInvalidCredentialsError"

// Get all Users
export async function getAllUsers():Promise<User[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select u.userid, u.username, u.password, u.firstname, u.lastName, u.email, r.roleId, r."role" 
                                                        from fluffers_reimbursement."User" u
                                                        join fluffers_reimbursement."Role" r on u."role" = r.roleId
                                                        group by u.userid, u.username, u.firstname, u.lastName, u.email, r.roleId, r."role"
                                                        order by u.userid;`);
        
        if (results.rowCount === 0){
            throw new Error('No Users Found');
        }
        return results.rows.map(UserDTOtoUserConvertor);
        
    } catch (error) {
        if (error.message === "User Not Found"){
            console.log(error);
            throw new Error(error.message);
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}

// Get by Username & Password

export async function getByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results = await client.query(`select u.userid, u.username, u.password, u.firstname, u.lastName, u.email, r.role_id, r."role" 
                                            from fluffers_reimbursement.users u
                                            join fluffers_reimbursement.roles r on u."role" = r.role_id
                                            where u."username" = $1 and u."password" = $2
                                            group by u.userid, u.username, u.firstname, u.lastName, u.email, r.roleId, r."role"`,
                                            [username, password]); // paramaterized queries, pg auto sanitizes

        if (results.rowCount === 0){
            throw new Error('User Not Found');
        }
        return UserDTOtoUserConvertor(results.rows[0]);
        
    } catch (error) {
        throw new AuthFailureError();
    } finally{
        client && client.release();
    }
}

// Get Users by Id

export async function getUserById(id:number):Promise<User>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select u.userid, u.username, u.password, u.firstname, u.lastName, u.email, r.roleId, r."role" 
        from fluffers_reimbursement.users u
        join fluffers_reimbursement.roles r on u."role" = r.roleId
        where u.userid = $1`, [id]); // parameterized queries

        return UserDTOtoUserConvertor(results.rows[0]);

    } catch (error) {
        if (error.message === "User Not Found"){
            console.log(error);
            throw new UserNotFoundError()
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}

// Update User

export async function updateUser(updatedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()

        await client.query(`update fluffers_reimbursement.users 
                                            set "username" = $1, "password" = $2, "first_name" = $3, "last_name" = $4, "email" = $5, "role" = $6
                                            where user_id = $7 returning "user_id" `,
                                            [updatedUser.username, updatedUser.password, updatedUser.firstName, updatedUser.lastName, updatedUser.email, updatedUser.role.roleId, updatedUser.userid])
        return getUserById(updatedUser.userid);

    }catch(e){
        console.log(e)
        throw new Error('An Unknown Error Occurred')
    }finally{
        client && client.release();
    }
}

// Save (Create) User

export async function saveOneUser(newUser:User):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let roleId = await client.query(`select r."role_id" 
                                        from fluffers_reimbursement.roles r 
                                        where r."role" = $1`,
                                        [newUser.role])
        if(roleId.rowCount === 0) {
            throw new Error('Role Not Found')
        }
        roleId = roleId.rows[0].role_id
        let results = await client.query(`insert into fluffers_reimbursement.users 
                                        ("username", "password", 
                                            "first_name", "last_name", 
                                            "email", "role")
                                        values($1,$2,$3,$4,$5,$6) 
                                        returning "user_id"`,
                                        [newUser.username, newUser.password, 
                                            newUser.firstName, newUser.lastName, 
                                            newUser.email, roleId])
        newUser.userid = results.rows[0].user_id
        await client.query('COMMIT;')
        return newUser
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Role Not Found') {
            throw new UserInputError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}