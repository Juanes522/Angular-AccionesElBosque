import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { LoginComponentComponent } from './modules/auth/login-component/login-component.component';
import { MfaVerificationComponent } from './modules/auth/mfa-verification/mfa-verification.component';
import { StartComponentComponent } from './modules/start/start-component/start-component.component';
import { RegisterComponentComponent } from './modules/auth/register-component/register-component.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    MfaVerificationComponent,
    StartComponentComponent,
    RegisterComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
