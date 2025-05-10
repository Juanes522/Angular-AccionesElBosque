import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchService {

  private API_SERVER_ACH_RELATION = "http://localhost:8085/alpaca/accounts/{account_id}/ach_relationships";
  private API_SERVER_ACH_TRANSFER = "http://localhost:8085/alpaca/accounts/{account_id}/transfers";

  constructor(
    private http: HttpClient
  ) { }

  createAchRelationship(accountId: string, data: any): Observable<any> {
    const url = this.API_SERVER_ACH_RELATION.replace('{account_id}', accountId);
    return this.http.post(url, data);
  }

  
  getAchRelationship(accountId: string): Observable<any> {
    const url = this.API_SERVER_ACH_RELATION.replace('{account_id}', accountId);
    return this.http.get<any[]>(url);
  }

  createAchTransfer(accountId: string, data: any): Observable<any> {
    const url = this.API_SERVER_ACH_TRANSFER.replace('{account_id}', accountId);
    return this.http.post(url, data);
  }
}
