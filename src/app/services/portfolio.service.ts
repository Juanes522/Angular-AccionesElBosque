import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs';

export interface FillActivity {
  id: string;
  account_id: string;
  activity_type: string;
  transaction_time: string;
  type: string;
  price: string;
  qty: string;
  side: 'buy' | 'sell';
  symbol: string;
  leaves_qty: string;
  order_id: string;
  cum_qty: string;
  order_status: string;
}

export interface TransferActivity {
  id: string;
  account_id: string;
  activity_type: string;
  date: string;
  net_amount: string;
  description: string;
  status: string;
}

export interface ParsedTransferActivity extends TransferActivity {
  direction?: 'INCOMING' | 'OUTGOING';
  transfer_type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private API_BASE = "http://localhost:8085/alpaca";

  constructor(private http: HttpClient) { }

  getFillActivitiesByAccountId(accountId: string): Observable<FillActivity[]> {
    const url = `${this.API_BASE}/${accountId}/activities/FILL`;
    return this.http.get<FillActivity[]>(url).pipe(
      map(activities => activities.map(activity => ({
        ...activity,
        price: this.formatNumber(activity.price),
        qty: this.formatNumber(activity.qty),
        normalized_status: this.normalizeStatus(activity.order_status)
      })))
    );
  }

  getTransferActivitiesByAccountId(accountId: string): Observable<ParsedTransferActivity[]> {
    const url = `${this.API_BASE}/${accountId}/activities/TRANS`;
    return this.http.get<TransferActivity[]>(url).pipe(
      map(transfers => transfers.map(transfer => ({
        ...this.parseTransferActivity(transfer),
        normalized_status: this.normalizeStatus(transfer.status)
      })))
    );
  }

  private parseTransferActivity(transfer: TransferActivity): ParsedTransferActivity {
    const directionMatch = transfer.description.match(/direction: (\w+)/);
    const typeMatch = transfer.description.match(/type: (\w+)/);

    return {
      ...transfer,
      direction: directionMatch ? directionMatch[1] as 'INCOMING' | 'OUTGOING' : undefined,
      transfer_type: typeMatch ? typeMatch[1] : undefined,
      net_amount: this.formatNumber(transfer.net_amount)
    };
  }

  private formatNumber(value: string): string {
    const num = parseFloat(value);
    return isNaN(num) ? value : num.toFixed(2);
  }

  private normalizeStatus(status: string): string {
    const statusMap: Record<string, string> = {
      'filled': 'completed',
      'executed': 'completed',
      'completed': 'completed',
      'partial_fill': 'partial',
      'canceled': 'canceled',
      'rejected': 'rejected',
      'pending': 'pending'
    };
    return statusMap[status.toLowerCase()] || status.toLowerCase();
  }
}
