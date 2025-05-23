import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private API_GET_USER = 'https://caring-encouragement-production-c223.up.railway.app/user/getuserbyalpacaid';
  private API_CHANGE_PASSWORD = 'https://caring-encouragement-production-c223.up.railway.app/user/changepassword';

  constructor(
    private http: HttpClient
  ) { }


  getUserByAlpacaId(alpacaId: string): Observable<any> {
    return this.http.get(`${this.API_GET_USER}?alpacaId=${alpacaId}`);
  }

  changePassword(email: string, oldPassword: string, newPassword: string): Observable<any> {
    const params = new HttpParams()
      .set('email', email)
      .set('oldPassword', oldPassword)
      .set('newPassword', newPassword);

    return this.http.post(this.API_CHANGE_PASSWORD, null, { params });
  }


  updateFinancialProfile(data: any) {
    console.log('Datos financieros actualizados:', data);
    return of({ success: true });
  }


  updatePlan(plan: string, option?: string) {
    console.log('Plan actualizado a:', plan, 'Opción:', option);
    return of({ success: true });
  }
}
