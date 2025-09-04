import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { RegisterRequest } from '../../models/register-request.model';
import { Auth } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerForm: FormGroup;
  constructor(private fb:FormBuilder,private authService: Auth,private router: Router){
    this.registerForm = this.fb.group({
      fullName: ['',[Validators.required]],
      email: ['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(8)]]
    });
  }

  register() {
    if(this.registerForm.invalid){
        this.registerForm.markAllAsTouched();
        return;
    }
    this.authService.register(this.registerForm.value).subscribe({
      next: ()=>{
        alert('Registration successful');
        this.router.navigate(['/login']);
      },
      error: (err)=>{
        alert('Registration failed: '+err.error?.message || err.message);
      }
    })

  }
}
