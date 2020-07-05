import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { User } from "../models/User";
import { UserDTOtoUserConverter } from "../utils/UserDTO-to-User-convertor";
import { UserNotFoundError } from "../errors/UserNotFoundError"
import { UserInputError } from "../errors/UserInputError";
import { AuthenticationError } from '../errors/AuthenticationError';

//Login
export async function loginByUsernameAndPassword(username:string, password:string):Promise<User> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select u."user_id", 
                                            u."username", 
                                            u."password", 
                                            u."first_name", 
                                            u."last_name", 
                                            u."email", 
                                            r."role_id", 
                                            r."roles" from fluffers_reimbursement.users u
                                        left join fluffers_reimbursement.roles  r 
                                        on u."roles" = r."role_id"
                                        where u."username" = $1 
                                            and u."password" = $2;`,
                                        [username, password])
        if(results.rowCount === 0) {
            throw new Error('User Not Found')
        }
        return UserDTOtoUserConverter(results.rows[0])
    } catch (e) {
        if(e.message === 'User Not Found') {
            throw new AuthenticationError()
        }
        console.log(e);
        throw new Error('Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}

// Get all Users
export async function getAllUsers():Promise<User[]>{
    let client:PoolClient
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select u.user_id, 
                                                            u.username, 
                                                            u.password, 
                                                            u.first_name, 
                                                            u.last_name, 
                                                            u.email, 
                                                            r.role_id, 
                                                            r."roles" 
                                                        from fluffers_reimbursement.users u
                                                        join fluffers_reimbursement.roles r on u.roles = r.role_id
                                                        group by u.user_id, 
                                                                 u.username, 
                                                                 u.first_name, 
                                                                 u.last_name, 
                                                                 u.email, 
                                                                 r.role_id, 
                                                                 r."roles"
                                                        order by u.user_id;`);
        
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

/*export async function getByUsernameAndPassword(username:string, password:string):Promise<User>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results = await client.query(`select u.user_id, u.username, u.password, u.first_name, u.last_name, u.email, r.role_id, r.roles 
                                            from fluffers_reimbursement.users u
                                            join fluffers_reimbursement.Role s r on u.roles = r.role_id
                                            where u."username" = $1 and u."password" = $2
                                            group by u.user_id, u.username, u.first_name, u.last_name, u.email, r.role_id, r.roles`,
                                            [username, password]); // paramaterized queries, pg auto sanitizes

        if (results.rowCount === 0){
            throw new Error('User Not Found');
        }
        return UserDTOtoUserConverter(results.rows[0]);
        
    } catch (error) {
        throw new AuthenticationError();
    } finally{
        client && client.release();
    }
}*/

// Get Users by Id

export async function getUserById(id:number):Promise<User>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select u.user_id,
                                                             u.username,
                                                             u.password, 
                                                             u.first_name,
                                                             u.last_name, 
                                                             u.email, 
                                                             r.role_id, 
                                                             r.roles 
                                                        from fluffers_reimbursement.users u
                                                        join fluffers_reimbursement.roles r on u.roles = r.role_id
                                                        where u.user_id = $1`, [id]);

        return UserDTOtoUserConverter(results.rows[0]);

    } catch (error) {
        if (error.message === 'User Not Found'){
            console.log(error);
            throw new UserNotFoundError()
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}

// Update User

export async function updateOneUser(updatedUser:User):Promise<User>{
    let client:PoolClient
    try{
        client = await connectionPool.connect()
        await client.query(`update fluffers_reimbursement.User 
                                            set "username" = $1, "password" = $2, "first_name" = $3, "last_name" = $4, "email" = $5, roles = $6
                                            where user_id = $7 returning "user_id" `,
                                            [updatedUser.username, updatedUser.password, updatedUser.first_name, updatedUser.last_name, updatedUser.email, updatedUser.role.role_id, updatedUser.user_id])
        return getUserById(updatedUser.user_id);

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
        let role_id = await client.query(`select r."role_id" 
                                        from fluffers_reimbursement.roles r 
                                        where r.roles = $1`,
                                        [newUser.role])
        if(role_id.rowCount === 0) {
            throw new Error('Role Not Found')
        }
        role_id = role_id.rows[0].role_id
        let results = await client.query(`insert into fluffers_reimbursement.User 
                                        ("username", "password", 
                                            "first_name", "last_name", 
                                            "email", roles)
                                        values($1,$2,$3,$4,$5,$6) 
                                        returning "user_id"`,
                                        [newUser.username, newUser.password, 
                                            newUser.first_name, newUser.last_name, 
                                            newUser.email, role_id])
        newUser.user_id = results.rows[0].user_id
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