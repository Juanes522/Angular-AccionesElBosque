import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponentComponent } from './modules/auth/login-component/login-component.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/loging', pathMatch: 'full'
  },
  {
    path: 'login', component: LoginComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
