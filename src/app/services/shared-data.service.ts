import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private stockDataSubject = new Subject<any>();
  stockData$ = this.stockDataSubject.asObservable();

  private loadingSubject = new Subject<boolean>();
  loading$ = this.loadingSubject.asObservable();

  private errorSubject = new Subject<string>();
  error$ = this.errorSubject.asObservable();

  setStockData(data: any) {
    this.stockDataSubject.next(data);
  }

  setLoading(loading: boolean) {
    this.loadingSubject.next(loading);
  }

  setError(error: string) {
    this.errorSubject.next(error);
  }
}
