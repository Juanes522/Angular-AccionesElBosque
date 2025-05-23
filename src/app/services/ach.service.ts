import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchService {

  private API_SERVER_ACH_RELATION = "https://caring-encouragement-production-c223.up.railway.app/alpaca/accounts/{account_id}/ach_relationships";
  private API_SERVER_ACH_TRANSFER = "https://caring-encouragement-production-c223.up.railway.app/alpaca/accounts/{account_id}/transfers";
  private API_SERVER_ACH_STATUS = "https://caring-encouragement-production-c223.up.railway.app/alpaca/accounts/{account_id}/ach-relationships";

  constructor(
    private http: HttpClient
  ) { }

  createAchRelationship(accountId: string, data: any): Observable<any> {
    const url = this.API_SERVER_ACH_RELATION.replace('{account_id}', accountId);
    return this.http.post(url, data);
  }

  getAchRelationshipsId(accountId: string): Observable<string[]> {
    const url = this.API_SERVER_ACH_STATUS.replace('{account_id}', accountId);
    return this.http.get<string[]>(url);
  }

  createAchTransfer(accountId: string, data: any): Observable<any> {
    const url = this.API_SERVER_ACH_TRANSFER.replace('{account_id}', accountId);
    return this.http.post(url, data);
  }
}
