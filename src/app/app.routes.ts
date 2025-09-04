import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'register',
        loadComponent: ()=> import('./auth/register/register').then(m=>m.Register)
    },
    {
        path: 'login',
        loadComponent: ()=> import('./auth/login/login').then(m=>m.Login)
    },
    {
        path: '',
        loadComponent:() => import('./home/home').then(m=>m.Home)
    },
    {
        path:'expenses/create',
        loadComponent:()=> import('./components/expense-form/expense-form').then(m=>m.ExpenseForm)
    }
];
