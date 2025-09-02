export interface Expense{
    id? : string;
    userId: string;
    amount: number;
    currency: string;
    category: string;
    description? : string;
    occurredAt: string;
    createdAt?: string;
}