import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountValuesService {

  private API_BASE = "http://localhost:8085/alpaca";

  constructor(
    private http: HttpClient
  ) { }

  getAccountValues(accountId: string): Observable<{ portfolio_value: string, buying_power: string }> {
    const url = `${this.API_BASE}/${accountId}/values`;
    return this.http.get<{ portfolio_value: string, buying_power: string }>(url).pipe(
      map(values => ({
        portfolio_value: parseFloat(values.portfolio_value).toFixed(2),
        buying_power: parseFloat(values.buying_power).toFixed(2)
      }))
    );
  }
}
