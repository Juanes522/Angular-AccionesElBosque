import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';

import { LoginComponentComponent } from './modules/auth/login-component/login-component.component';
import { MfaVerificationComponent } from './modules/auth/mfa-verification/mfa-verification.component';
import { StartComponentComponent } from './modules/start/start-component/start-component.component';
import { RegisterComponentComponent } from './modules/auth/register-component/register-component.component';

import { PortfolioComponent } from './modules/dashboard/portfolio/portfolio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';


import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { SidebarComponent } from './modules/sidebar/sidebar.component';
import { FundAccountComponent } from './modules/fund-account/fund-account.component';
import { UserPortfolioComponent } from './modules/dashboard/user-portfolio/user-portfolio.component';
import { SearchFieldComponent } from './modules/dashboard/search-field/search-field.component';
import { UserProfileComponent } from './modules/user-profile/user-profile.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponentComponent,
    MfaVerificationComponent,
    StartComponentComponent,
    RegisterComponentComponent,
    PortfolioComponent,
    SidebarComponent,
    FundAccountComponent,
    SearchFieldComponent,
    UserPortfolioComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    NgxEchartsModule.forRoot({ echarts }),
    BrowserAnimationsModule,
    ToastModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatTabsModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
