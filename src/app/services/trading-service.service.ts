import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface OrderRequest {
  symbol: string;
  qty: number;
  side: 'buy' | 'sell';
  type: string;
  time_in_force: string;
}

@Injectable({
  providedIn: 'root'
})
export class TradingServiceService {

  private API_SERVER_ORDER = "http://localhost:8085/alpaca/orders";

  constructor(
    private http: HttpClient,
  ) { }

  placeOrder(accountId: string, orderData: OrderRequest): Observable<any>{
    const url = `${this.API_SERVER_ORDER}/${accountId}`;
    return this.http.post(url, orderData);
  }


}
