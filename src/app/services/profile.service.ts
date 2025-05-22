import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private API_SERVER_USER_DATA = "http://localhost:8085/";

  constructor(
    private http: HttpClient
  ) { }

  private mockUserData = {
    accountNumber: 'ACC-123456',
    email: 'usuario@ejemplo.com',
    financialProfile: {
      annualIncome: 75000,
      netWorth: 150000,
      investableAssets: 50000,
      fundingSource: 'employment'
    },
    plan: 'basic'
  };

  getUserData() {
    return of(this.mockUserData);
  }

  updateFinancialProfile(data: any) {
    console.log('Datos financieros actualizados:', data);
    this.mockUserData.financialProfile = data;
    return of({ success: true });
  }

  updatePassword(current: string, newPassword: string) {
    console.log('Contraseña actualizada');
    return of({ success: true });
  }

  updatePlan(plan: string, option?: string) {
    console.log('Plan actualizado a:', plan, 'Opción:', option);
    this.mockUserData.plan = plan;
    return of({ success: true });
  }
}
