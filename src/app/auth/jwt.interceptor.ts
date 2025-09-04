import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest,HttpHandler, HttpEvent, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Auth } from "./auth";
import { Router } from "@angular/router";

@Injectable()
export class JwtInterceptor implements HttpInterceptor{
    private readonly baseUrl = 'http://localhost:8080/api';
    constructor(private authService:Auth, private router:Router){}

    intercept(req: HttpRequest<any>,next:HttpHandler): Observable<HttpEvent<any>> {
        if(req.url.includes('/login') || req.url.includes('/register')){
            return next.handle(req);
        }
        if(!req.url.startsWith(this.baseUrl)){
            return next.handle(req).pipe(this.handleErrors<HttpEvent<any>>());
        }
        const token = this.authService.getToken();
        let cloned = req;
        if (token){
            cloned = req.clone({
                setHeaders:{
                    Authorization: `Bearer ${token}`
                }
            });
        }

        return next.handle(cloned).pipe(this.handleErrors<HttpEvent<any>>());
    }

    private handleErrors<T>(): (source: Observable<T>) => Observable<T> {
        return catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
          return throwError(() => err);
        });
      }
      
}
