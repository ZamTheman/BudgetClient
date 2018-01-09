import { ExpenseType } from "./expenseType";

export class Expense {
    
    constructor(
        public expenseType: ExpenseType,
        public amount: number,
        public split: string,
        public comment: string,
        public date: Date,
        public copyWithAmount: boolean,
        public copyWithoutAmount: boolean,
        public id: number = -1
    ){}
}