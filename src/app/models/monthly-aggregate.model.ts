export interface MonthlyAggregate{
    id? : string;
    userId: string;
    year: number;
    month: number;
    category: string;
    totalAmount: number;
    updatedAt? : string;
}