import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RegisterRequest } from '../models/register-request.model';
import { LoginRequest } from '../models/login-request.model';
import { JwtResponse } from '../models/jwt-response.model';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = "http://localhost:8080/api/auth";
  constructor(private http:HttpClient){

  }

  register(data:RegisterRequest): Observable<any>{
     return this.http.post(`${this.apiUrl}/register`,data);
  }

  login(data:LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`,data).pipe(
        tap((res:JwtResponse)=>{
          localStorage.setItem('token',res.accessToken);
          localStorage.setItem('email',res.email);
          localStorage.setItem('roles',JSON.stringify(res.roles));
        })
    );
  }

  logout(): void{
    localStorage.clear();
  }

  getToken(): string | null {
        return localStorage.getItem('token');
  }
  
}
