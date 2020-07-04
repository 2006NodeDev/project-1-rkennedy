import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { UserDTOtoUserConverter } from "../utils/UserDTO-to-User-convertor";
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
        let results:QueryResult = await client.query(`select u.userid, u.username, u.password, u.firstname, u.lastname, u.email, r.roleid, r."role" 
                                                        from fluffers_reimbursement."User" u
                                                        join fluffers_reimbursement."Role" r on u."role" = r.roleid
                                                        group by u.userid, u.username, u.firstname, u.lastname, u.email, r.roleid, r."role"
                                                        order by u.userid;`);
        
        if (results.rowCount === 0){
            throw new Error('No Users Found');
        }
        return results.rows.map(UserDTOtoUserConverter);
        
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
        let results = await client.query(`select u.userid, u.username, u.password, u.firstname, u.lastname, u.email, r.roleId, r."role" 
                                            from fluffers_reimbursement.users u
                                            join fluffers_reimbursement.roles r on u."role" = r.roleid
                                            where u."username" = $1 and u."password" = $2
                                            group by u.userid, u.username, u.firstname, u.lastname, u.email, r.roleid, r."role"`,
                                            [username, password]); // paramaterized queries, pg auto sanitizes

        if (results.rowCount === 0){
            throw new Error('User Not Found');
        }
        return UserDTOtoUserConverter(results.rows[0]);
        
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
        let results:QueryResult = await client.query(`select u.userid, u.username, u.password, u.firstname, u.lastname, u.email, r.roleid, r."role" 
        from fluffers_reimbursement.users u
        join fluffers_reimbursement.roles r on u."role" = r.roleid
        where u.userid = $1`, [id]); // parameterized queries

        return UserDTOtoUserConverter(results.rows[0]);

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
                                            set "username" = $1, "password" = $2, "firstName" = $3, "lastname" = $4, "email" = $5, "role" = $6
                                            where userid = $7 returning "userid" `,
                                            [updatedUser.username, updatedUser.password, updatedUser.firstname, updatedUser.lastname, updatedUser.email, updatedUser.role.roleid, updatedUser.userid])
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
        let roleid = await client.query(`select r."roleid" 
                                        from fluffers_reimbursement.roles r 
                                        where r."role" = $1`,
                                        [newUser.role])
        if(roleid.rowCount === 0) {
            throw new Error('Role Not Found')
        }
        roleid = roleid.rows[0].roleid
        let results = await client.query(`insert into fluffers_reimbursement.users 
                                        ("username", "password", 
                                            "firstName", "lastname", 
                                            "email", "role")
                                        values($1,$2,$3,$4,$5,$6) 
                                        returning "userid"`,
                                        [newUser.username, newUser.password, 
                                            newUser.firstname, newUser.lastname, 
                                            newUser.email, roleid])
        newUser.userid = results.rows[0].userid
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