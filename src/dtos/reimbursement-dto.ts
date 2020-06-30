export class ReimbursementDTO{
    reimbursementId: number
    author: number
    amount: number
    dateSubmitted: Date
    dateResolved: Date
    description: string
    resolver: number
    status: number
    type: number
  }