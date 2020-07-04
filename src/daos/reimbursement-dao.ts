import { PoolClient, QueryResult } from "pg";
import { connectionPool } from ".";
import { Reimbursement } from "../models/Reimbursement";
import { ReimbursementDTOtoReimbursementConvertor } from "../utils/ReimbursementDTO-to-Reimbursement";
import { ReimbursementNotFoundError } from "../errors/ReimbursementNotFoundError";
import { ReimbursementIdInputError } from "../errors/ReimbursementInputError";

export async function getAllReimbursements():Promise<Reimbursement[]>{
    let client:PoolClient;
    try {
        client = await connectionPool.connect();
        let results:QueryResult = await client.query(`select r.*, 
                                                            rs.status, 
                                                            rs.statusid, 
                                                            rt."type", 
                                                            rt.typeid from fluffers_reimbursement.reimbursement r
                                                        join fluffers_reimbursement.reimbursement_status rs on r.status = rs.statusid
                                                        join fluffers_reimbursement.reimbursement_type rt on r."type" = rt.typeid
                                                        order by r.datesubmitted;`);       
        if (results.rowCount === 0){
            throw new Error('No Reimbursements Found');
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConvertor);
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
export async function getReimbursementByuserid(userid:number):Promise<Reimbursement[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select r."reimbursementId", 
                                                r."author", r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description", r."resolver",
                                                rs."statusId", rs."status",
                                                rt."typeId", rt."type"
                                            from fluffers_reimbursement.reimbursements r 
                                            left join fluffers_reimbursement.reimbursement_statuses rs
                                                on r."status" = rs."statusId" 
                                            left join fluffers_reimbursement.reimbursement_types rt
                                                on r."type" = rt."typeId"
                                            left join fluffers_reimbursement.users u 
                                                on r."author" = u."userid"
                                                    where u."userid" = $1
                                            order by r.date_submitted;`, [userid])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConvertor);
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
        let results = await client.query(`select r."reimbursementId", 
                                                r."author", 
                                                r."amount", 
                                                r."date_submitted",
                                                r."date_resolved",
                                                r."description",
                                                r."resolver",
                                                rs."statusId", 
                                                rs."status",
                                                rt."typeId",
                                                rt."type"
                                                    from fluffers_reimbursement.reimbursements r 
                                            left join fluffers_reimbursement.reimbursement_statuses rs
                                                on r."status" = rs."statusId" 
                                            left join fluffers_reimbursement.reimbursement_types rt
                                                on r."type" = rt."typeId"
                                                    where r."status" = $1
                                            order by r.date_submitted;`, [status])
        if(results.rowCount === 0) {
            throw new Error('Reimbursement Not Found')
        }
        return results.rows.map(ReimbursementDTOtoReimbursementConvertor);
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
// Save (Create) Reimbursement
export async function saveOneReimbursement(newReim:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let typeId = await client.query(`select t."typeId" from fluffers_reimbursement.reimbursement_types t 
                                            where t."type" = $1;`,
                                        [newReim.type])
        if(typeId.rowCount === 0) {
            throw new Error('Type Not Found')
        }
        typeId = typeId.rows[0].typeId 
        let statusId = await client.query(`select rs."statusId" from fluffers_reimbursement.reimbursement_statuses rs 
                                            where rs."status" = $1;`, [newReim.status])
        if(statusId.rowCount === 0) {
            throw new Error('Status Not Found')
        }
        statusId = statusId.rows[0].statusId
        let results = await client.query(`insert into fluffers_reimbursement.reimbursements ("author", "amount", 
                                        "date_submitted", "description", "status", "type")
                                            values($1,$2,$3,$4,$5,$6) 
                                        returning "reimbursementId";`,
                                        [newReim.author, newReim.amount, newReim.datesubmitted,
                                            newReim.description, statusId, typeId]) 
        newReim.reimbursementId = results.rows[0].reimbursementId
        await client.query('COMMIT;')
        return newReim
    } catch (e) {
        client && client.query('ROLLBACK;')
        if(e.message === 'Type Not Found' || e.message === 'Status Not Found') {
            throw new ReimbursementIdInputError()
        } 
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}
// Update Reimbursement
export async function updatereimbursement(updatedReimbursement:Reimbursement):Promise<Reimbursement> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        if(updatedReimbursement.author) {
            await client.query(`update fluffers_reimbursement.reimbursements set "author" = $1 
                                where "reimbursementId" = $2;`, 
                                [updatedReimbursement.author, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.amount) {
            await client.query(`update fluffers_reimbursement.reimbursements set "amount" = $1 
                                where "reimbursementId" = $2;`, 
                                [updatedReimbursement.amount, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.datesubmitted) {
            await client.query(`update fluffers_reimbursement.reimbursements set "date_submitted" = $1 
                                where "reimbursementId" = $2;`, 
                                [updatedReimbursement.datesubmitted, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.dateresolved) {
            await client.query(`update fluffers_reimbursement.reimbursements set "date_resolved" = $1 
                                where "reimbursementId" = $2;`, 
                                [updatedReimbursement.dateresolved, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.description) {
            await client.query(`update fluffers_reimbursement.reimbursements set "description" = $1 
                                where "reimbursementId" = $2;`, 
                                [updatedReimbursement.description, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.resolver) {
            await client.query(`update fluffers_reimbursement.reimbursements set "resolver" = $1 
                                where "reimbursementId" = $2;`, 
                                [updatedReimbursement.resolver, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.status) {
            let statusId = await client.query(`select rs."statusId" from fluffers_reimbursement.reimbursement_statuses rs 
                                            where rs."status" = $1;`, [updatedReimbursement.status])
            if(statusId.rowCount === 0) {
                throw new Error('Status Not Found')
            }
            statusId = statusId.rows[0].statusId
            await client.query(`update fluffers_reimbursement.reimbursements set "status" = $1 
                                where "reimbursementId" = $2;`, 
                                [statusId, updatedReimbursement.reimbursementId])
        }
        if(updatedReimbursement.type) {
            let typeId = await client.query(`select rt."typeId" from fluffers_reimbursement.reimbursement_types rt 
                                            where rt."type" = $1;`, [updatedReimbursement.type])
            if(typeId.rowCount === 0) {
                throw new Error('Type Not Found')
            }
            typeId = typeId.rows[0].typeId
            await client.query(`update fluffers_reimbursement.reimbursements set "type" = $1 
                                where "reimbursementId" = $2;`, 
                                [typeId, updatedReimbursement.reimbursementId])
        }
        await client.query('COMMIT;')
        return updatedReimbursement
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Status Not Found' || e.message == 'Type Not Found') {
            throw new ReimbursementIdInputError()
        }
        console.log(e);
        throw new Error('An Unknown Error Occurred')
    } finally {
        client && client.release()
    }
}