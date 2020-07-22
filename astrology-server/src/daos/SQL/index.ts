import {Pool} from 'pg'

//build a connection pool - same db as lightly burning
export const connectionPool:Pool = new Pool ({ 
    host:process.env['Astrology_Host'],
    user: process.env['Astrology_User'],
    password: process.env['Astrology_Password'], 
    database: process.env['Astrology_Database'], 
    port: 5432, 
    max: 5 
})
