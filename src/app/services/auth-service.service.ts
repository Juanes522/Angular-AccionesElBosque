import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  constructor(private http: HttpClient) { }

   verifyMFA(code: string): Observable<any> {
    return this.http.post<any>('/api/auth/verify-mfa', { code });
  }

  resendMFA(): Observable<any> {
    return this.http.post<any>('/api/auth/resend-mfa', {});
  }
}
