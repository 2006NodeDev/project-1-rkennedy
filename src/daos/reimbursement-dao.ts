import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConverter } from "../utils/ReimbursementDTO-to-Reimbursement";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { reimbursement_idInputError } from "../errors/ReimbursementInputError";

export async function getAllReimbursements():Promise<Reimbursement[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select r."reimbursement_id", 
                                                            r."author", 
                                                            r."amount", 
                                                            r."date_submitted", 
                                                            r."date_resolved", 
                                                            r."description", 
                                                            r."resolver", 
                                                            rs.status, 
                                                            rs.statusid, 
                                                            rt."type", 
                                                            rt.type_id from fluffers_reimbursement.reimbursement r
                                                        join fluffers_reimbursement.reimbursement_status rs on r.status = rs.statusid
                                                        join fluffers_reimbursement.reimbursement_type rt on r."type" = rt.type_id
                                                        order by r.date_submitted;`);       
        if (results.rowCount === 0){
            throw new Error('No Reimbursements Found');
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (error) {
        if (error.message === "Reimbursements Not Found"){
            console.log(error);
            throw new ReimbursementNotFoundError()
        }
        throw new Error('An Unknown Error Occurred');
    } finally {
        client && client.release();
    }
}
// Get Reimbursement by User Id
export async function getReimbursementByuser_id(user_id:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description", 
                                                r."resolver",
                                                rs."statusId", 
                                                rs."status",
                                                rt."type_id", 
                                                rt."type"
                                            from fluffers_reimbursement.reimbursement r 
                                            left join fluffers_reimbursement.reimbursement_statuses rs
                                                on r."status" = rs."statusid" 
                                            left join fluffers_reimbursement.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                            left join fluffers_reimbursement.users u 
                                                on r."author" = u."user_id"
                                                    where u."user_id" = $1
                                            order by r.date_submitted;`, [user_id])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}
// Get Reimbursement By Status
export async function getReimbursementByStatus(status:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursement_id", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description",
                                                r."resolver",
                                                rs."statusid", 
                                                rs."status",
                                                rt."type_id",
                                                rt."type"
                                                    from fluffers_reimbursement.reimbursement r 
                                            left join fluffers_reimbursement.reimbursement_status rs
                                                on r."status" = rs."statusid" 
                                            left join fluffers_reimbursement.reimbursement_types rt
                                                on r."type" = rt."type_id"
                                                    where r."status" = $1
                                            order by r.date_submitted;`, [status])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConverter);
    } catch (e) {
        if(e.message === 'Reimbursement Not Found') {
            throw new ReimbursementNotFoundError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}
//Submit Reimbursement
export async function submitOneReimbursement(newReim:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let type_id = await client.query(`select t."type_id" from fluffers_reimbursement.reimbursement_types t 
                                            where t."type" = $1;`,
                                        [newReim.type])
        if(type_id.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        type_id = type_id.rows[0].type_id 
        let statusId = await client.query(`select rs."statusid" from fluffers_reimbursement.reimbursement_status rs 
                                            where rs."status" = $1;`, [newReim.status])
        if(statusId.rowCount === 0) {
            throw new Error('Status Not Found')
        }
        statusId = statusId.rows[0].statusId
        let results = await client.query(`insert into fluffers_reimbursement.reimbursement ("author", "amount", 
                                        "date_submitted", "description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) 
                                        returning "reimbursement_id";`,
                                        [newReim.author, newReim.amount, newReim.date_submitted,
                                            newReim.description, newReim.status.statusId, type_id]) 
        newReim.reimbursement_id = results.rows[0].reimbursement_id
        await client.query('COMMIT;')
        return newReim
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Type Not Found' || e.message === 'Status Not Found') {
            throw new reimbursement_idInputError()
        } 
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}
// Update Reimbursement
export async function updateOneReimbursement(updatedReimbursement:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
   
        if(updatedReimbursement.author) {
            await client.query(`update fluffers_reimbursement.reimbursement set "author" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.author, updatedReimbursement.reimbursement_id])
        }
        if(updatedReimbursement.amount) {
            await client.query(`update fluffers_reimbursement.reimbursement set "amount" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.amount, updatedReimbursement.reimbursement_id])
        }
        if(updatedReimbursement.date_submitted) {
            await client.query(`update fluffers_reimbursement.reimbursements set "date_submitted" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.date_submitted, updatedReimbursement.reimbursement_id])
        }
        if(updatedReimbursement.date_resolved) {
            await client.query(`update fluffers_reimbursement.reimbursement set "date_resolved" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.date_resolved, updatedReimbursement.reimbursement_id])
        }
        if(updatedReimbursement.description) {
            await client.query(`update fluffers_reimbursement.reimbursement set "description" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.description, updatedReimbursement.reimbursement_id])
        }
        if(updatedReimbursement.resolver) {
            await client.query(`update fluffers_reimbursement.reimbursement set "resolver" = $1 
                                where "reimbursement_id" = $2;`, 
                                [updatedReimbursement.resolver, updatedReimbursement.reimbursement_id])
        }
        if(updatedReimbursement.status) {
            let statusId = await client.query(`select rs."statusid" from fluffers_reimbursement.reimbursement_status rs 
                                            where rs."status" = $1;`, [updatedReimbursement.status])
            if(statusId.rowCount === 0) {
                throw new Error('Status Not Found')
            }
            statusId = statusId.rows[0].statusId
            await client.query(`update fluffers_reimbursement.reimbursement set "status" = $1 
                                where "reimbursement_id" = $2;`, 
                                [statusId, updatedReimbursement.reimbursement_id])
        }
        if(updatedReimbursement.type) {
            let type_id = await client.query(`select rt."type_id" from fluffers_reimbursement.reimbursement_types rt 
                                            where rt."type" = $1;`, [updatedReimbursement.type])
            if(type_id.rowCount === 0) {
                throw new Error('Type Not Found')
            }
            type_id = type_id.rows[0].type_id
            await client.query(`update fluffers_reimbursement.reimbursements set "type" = $1 
                                where "reimbursement_id" = $2;`, 
                                [type_id, updatedReimbursement.reimbursement_id])
        }
        await client.query('COMMIT;')
        return updatedReimbursement
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new reimbursement_idInputError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}