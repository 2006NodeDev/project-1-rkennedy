import { Pool } from "pg";
export const connectionPool: Pool = new Pool({
  host: process.env["fluffers_reimbursement_HOST"],
  user: process.env["fluffers_reimbursement_USER"],
  password: process.env["fluffers_reimbursement_PASSWORD"],
  database: process.env["fluffers_reimbursement_DATABASE"],
  port: 5432,
  max: 5
});