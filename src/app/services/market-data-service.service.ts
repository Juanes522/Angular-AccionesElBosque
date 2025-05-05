import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarketDataServiceService {
  private apiUrl = '';
  private apiKey = '';
 // https://www.alphavantage.co/query
 // 1RME20UV9TP1TAX9
 // VQW70RZXW210VPZD
 // J8WWUN1UFX3PCIAV
 // 87SU371TSAFTGJOT
  constructor(private http: HttpClient) {}

  getStockData(symbol: string): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        apikey: this.apiKey,
        outputsize: 'full'
      }
    }).pipe(
      map(response => this.transformDataForChart(response)),
      catchError(error => {
        console.error('Error fetching data:', error);
        return of(null);
      })
    );
  }
  
  private transformDataForChart(data: any) {
    if (!data['Time Series (Daily)']) {
      throw new Error('Datos no disponibles');
    }
  
    const series = data['Time Series (Daily)'];
    const dates = Object.keys(series).sort().slice(-90); // Últimos 90 días
    const prices = dates.map(date => {
      const dailyData = series[date];
      return {
        date,
        open: parseFloat(dailyData['1. open']),
        high: parseFloat(dailyData['2. high']),
        low: parseFloat(dailyData['3. low']),
        close: parseFloat(dailyData['4. close']),
        volume: parseInt(dailyData['5. volume'])
      };
    });
  
    return {
      symbol: data['Meta Data']['2. Symbol'],
      lastRefreshed: data['Meta Data']['3. Last Refreshed'],
      lastPrice: prices[prices.length - 1].close,
      prices
    };
  }
}