import { ReimbursementStatus } from "./ReimbursementStatus";
import { ReimbursementTypes } from "./ReimbursementTypes";

export class Reimbursement {
  reimbursement_id: number; // primary key
  author: number;  // foreign key -> User, not null
  amount: number;  // not null
  date_submitted: Date; // not null
  date_resolved: Date; // not null
  description: string; // not null
  resolver: number; // foreign key -> User
  status: ReimbursementStatus; // foreign key -> ReimbursementStatus, not null
  type: ReimbursementTypes // foreign key -> ReimbursementType
}