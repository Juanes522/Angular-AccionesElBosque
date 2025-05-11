import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './modules/auth/login-component/login-component.component';
import { MfaVerificationComponent } from './modules/auth/mfa-verification/mfa-verification.component';
import { StartComponentComponent } from './modules/start/start-component/start-component.component';
import { RegisterComponentComponent } from './modules/auth/register-component/register-component.component';
import { PortfolioComponent } from './modules/dashboard/portfolio/portfolio.component';
import { AuthGuardService } from './services/auth-guard.service';
import { FundAccountComponent } from './modules/fund-account/fund-account.component';
import { UserPortfolioComponent } from './modules/dashboard/user-portfolio/user-portfolio.component';


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
    path: 'mfa-verify', component: MfaVerificationComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'signup', component: RegisterComponentComponent
  },
  {
    path: 'trading', component: PortfolioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'dashboard', component: UserPortfolioComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'fund-account', component: FundAccountComponent,
    canActivate: [AuthGuardService]
  },
  /*{
    path: 'profile',
  },*/
  {
    path: '**', redirectTo: 'acciones-ElBosque', pathMatch: 'full'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
