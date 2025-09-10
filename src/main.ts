(window as any).global = window;
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { JwtInterceptor } from './app/auth/jwt.interceptor';
bootstrapApplication(App, {
  providers: [importProvidersFrom(HttpClientModule),
  provideRouter(routes),
  {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true}]
}).catch(err => console.error(err));
