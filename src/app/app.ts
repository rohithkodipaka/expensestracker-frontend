import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseForm } from "./components/expense-form/expense-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ExpenseForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('expensestracker-frontend');
}
