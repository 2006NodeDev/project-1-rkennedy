import { Profile } from "../models/profile";
import { PoolClient } from "pg";
import { connectionPool } from ".";
import { ProfileDTOtoProfileConverter } from "../utils/Profile-DTO-to-Profile-converter";
import { ProfileNotFoundError } from "../errors/ProfileNotFoundError";
import { ProfileInputError } from "../errors/ProfileInputError";

//Get all Profiles
export async function getAllProfiles():Promise<Profile[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select p."profile_id", 
                                                p."owner_id", 
                                                p."full_name", 
                                                pr."relationship_id",
                                                pr."relationship", 
                                                p."birth_date", 
                                                p."birth_location"  
                                                from astrology.profile p
                                            left join astrology.relationship pr
                                                on p."relationship" = pr."relationship_id"
                                            order by p.full_name;`)
        return results.rows.map(ProfileDTOtoProfileConverter)
    } catch (e) {
        console.log(e);
        throw new Error('Unhandled Error Occured')
    } finally {
        client && client.release()
    }
}

// Find Profiles by Relationship
export async function getProfileByRelationship(relationship:number):Promise<Profile[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select p."profile_id", 
                                                    p."owner_id", 
                                                    p."full_name", 
                                                    pr."relationship_id",
                                                    pr."relationship", 
                                                    p."birth_date", 
                                                    p."birth_location"  
                                                    from astrology.profile p
                                                    left join astrology.relationship pr
                                                    on p."relationship" = pr."relationship_id"
                                                    where p."relationship" = $1
                                                    order by p.full_name;`, [relationship])
        if(results.rowCount === 0) {
            throw new Error('Profile Not Found')
        }
        return results.rows.map(ProfileDTOtoProfileConverter);
    } catch (e) {
        if(e.message === 'Profile Not Found') {
            throw new ProfileNotFoundError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}

// Find Profile(s) by User
export async function getProfileByUserId(userId:number):Promise<Profile[]> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        let results = await client.query(`select p."profile_id", 
                                                   p."owner_id", 
                                                   p."full_name", 
                                                   pr."relationship_id",
                                                   pr."relationship", 
                                                   p."birth_date", 
                                                   p."birth_location"
                                                   p."birth_location"
                                            from astrology.profile p
                                            left join astrology.relationship pr
                                                on p."relationship" = pr."relationship_id" 
                                            left join astrology.users u 
                                                on p."owner_id" = u."user_id"
                                                    where u."user_id" = $1
                                            order by p.full_name;`, [userId])
        if(results.rowCount === 0) {
            throw new Error('Profile Not Found')
        }
        return results.rows.map(ProfileDTOtoProfileConverter);
    } catch (e) {
        if(e.message === 'Profile Not Found') {
            throw new ProfileNotFoundError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}


// Submit a Profile
export async function submitOneProfile(newProfile:Profile):Promise<Profile> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')
        let results = await client.query(`insert into astrology.profile ("profile_id", "owner_id", "full_name", "relationship",
                                        "birth_date", "birth_location")
                                            values($1,$2,$3,$4,$5) 
                                        returning "booking_id";`,
                                        [newProfile.profileId, newProfile.ownerId, newProfile.fullName, newProfile.relationship, newProfile.birthDate,
                                            newProfile.birthLocation]) 
        newProfile.profileId = results.rows[0].profile_id
        
        await client.query('COMMIT;')
        return newProfile
    } catch (e) {
        client && client.query('ROLLBACK;')
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}

// Update a Profile
export async function updateOneProfile(updatedOneProfile:Profile):Promise<Profile> {
    let client:PoolClient
    try {
        client = await connectionPool.connect()
        await client.query('BEGIN;')

        if(updatedOneProfile.fullName) {
            await client.query(`update astrology.profile set "full_name" = $1 
                                where "profile_id" = $2;`, 
                                [updatedOneProfile.fullName, updatedOneProfile.profileId])
        }
        if(updatedOneProfile.relationship) {
            let relationshipId = await client.query(`update astrology.profile set "relationship_id" = $1 
                                where "profile_id" = $2;`, 
                                [updatedOneProfile.relationship, updatedOneProfile.profileId])
            if(relationshipId.rowCount === 0){
                throw new Error('Relationship Not Found')
            }
            relationshipId = relationshipId.rows[0].relationship_id
            await client.query(`update astrology.profile set "relationship" = $1 
                                where "booking_id" = $2;`, 
                                [relationshipId, updatedOneProfile.profileId])
       }
        if(updatedOneProfile.birthDate) {
            await client.query(`update roadey.profile set "birth_date" = $1 
                                where "profile_id" = $2;`, 
                                [updatedOneProfile.birthDate, updatedOneProfile.profileId])
        }
        if(updatedOneProfile.birthLocation) {
            await client.query(`update astrology.profile set "birth_location" = $1 
                                where "profile_id" = $2;`, 
                                [updatedOneProfile.birthLocation, updatedOneProfile.profileId])
        }
        await client.query('COMMIT;')
        return updatedOneProfile
    } catch(e) {
        client && client.query('ROLLBACK;')
        if(e.message == 'Relationship Not Found') {
            throw new ProfileInputError()
        }
        console.log(e);
        throw new Error('Unknown Error Occured')
    } finally {
        client && client.release()
    }
}