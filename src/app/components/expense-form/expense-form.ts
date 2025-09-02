import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ExpensesService } from '../../api/expenses.service';
import { Expense } from '../../models/expense.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.scss']
})
export class ExpenseForm{
      constructor(private fb: FormBuilder, private expenseService: ExpensesService){
        this.expenseForm = this.fb.group({
          category: ['',Validators.required],
          amount: [null,[Validators.required,Validators.min(0.01)]],
          currency: ['USD',Validators.required],
          description: [''],
          occuredAt: [new Date().toISOString().substring(0,10),Validators.required]
        });
      }
      expenseForm: FormGroup;


      submitExpense(){
        if(this.expenseForm.invalid){
          this.expenseForm.markAllAsTouched();
          return;
        }
        const dateValue = this.expenseForm.value.occuredAt;
        const dateObj = new Date(dateValue);

        if (isNaN(dateObj.getTime())) {
          alert('Invalid date selected!');
          return;
        }
        const expense: Expense = {
            userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
            ...this.expenseForm.value,
            occurredAt: dateObj.toISOString()
        };
        console.log('Payload to backend:', expense);

         this.expenseService.createExpense(expense).subscribe({
            next: ()=>{
              alert('Expense created Successfully');
              this.expenseForm.reset({currency: 'USD', occuredAt: new Date().toISOString().substring(0,10)});
            },
            error: (err: HttpErrorResponse)=>{
              console.error('Backend Error Resposne Status:',err.status);
              console.error('Error body:',err.error);
              alert(`Failed to add expense: ${err.message}`);
            }
         });
      }
}
