import { Pool } from "pg";
export const connectionPool: Pool = new Pool({
  host: process.env['astrology_HOST'],
  user: process.env['astrology_USER'],
  password: process.env['astrology_PASSWORD'],
  database: process.env['astrology_DATABASE'],
  port: 5432,
  max: 5
});