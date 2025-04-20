import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './modules/auth/login-component/login-component.component';
import { MfaVerificationComponent } from './modules/auth/mfa-verification/mfa-verification.component';
import { StartComponentComponent } from './modules/start/start-component/start-component.component';
import { RegisterComponentComponent } from './modules/auth/register-component/register-component.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/acciones-ElBosque', pathMatch: 'full'
  },
  {
    path: 'acciones-ElBosque', component:StartComponentComponent
  },
  {
    path: 'login', component: LoginComponentComponent
  },
  {
    path: 'mfa-verify', component: MfaVerificationComponent
  },
  {
    path: 'signup', component: RegisterComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
