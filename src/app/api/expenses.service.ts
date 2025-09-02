import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Expense} from '../models/expense.model';
import {MonthlyAggregate} from '../models/monthly-aggregate.model';

@Injectable({
    providedIn: 'root'
})
export class ExpensesService{
    private baseUrl = 'http://localhost:8080/api';

    constructor(private http: HttpClient){}

    createExpense(expense: Expense): Observable<Expense> {
        return this.http.post<Expense>(`${this.baseUrl}/expenses`,expense);
    }

    getAllExpenses() : Observable<Expense[]>{
        return this.http.get<Expense[]>(`${this.baseUrl}/expenses`);
    }

}

