import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginRequest } from '../../models/login-request.model';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Auth } from '../auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  constructor(private fb:FormBuilder,private authService: Auth,private router:Router){
      this.loginForm = this.fb.group({
        email: ['',[Validators.required,Validators.email]],
        password:['',[Validators.required,Validators.minLength(8)]]
      });
  }

  login(): void{
      if(this.loginForm.invalid){
        return;
      }
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next:(res)=>{
          this.router.navigate(['/expenses/create']).then(ok => console.log("Navigation success:", ok));
        },
        error:(err)=>{
          alert('Login failed: '+err.error?.message || err.message);
        }
      })
  }
}
