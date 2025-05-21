import { Component } from '@angular/core';
import { MarketDataServiceService } from 'src/app/services/market-data-service.service';
import { Router } from '@angular/router';
import { SharedDataService } from 'src/app/services/shared-data.service';

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.css']
})
export class SearchFieldComponent {
  searchQuery: string = '';

  constructor(
    private marketData: MarketDataServiceService,
    private router: Router,
    private sharedData: SharedDataService
  ) { }

  searchStock() {
  
  if(this.searchQuery == ''){
    this.router.navigate(['/dashboard']);
  } else {
    this.router.navigate(['/trading']);
  }

  if (this.searchQuery.trim()) {
    this.sharedData.setLoading(true);
    this.sharedData.setError('');

    this.marketData.getStockData(this.searchQuery.trim()).subscribe({
      next: (data) => {
        if (!data) {
          this.sharedData.setError('Acción no encontrada');
          return;
        }

      
        const chartData = {
          symbol: data.symbol,
          lastPrice: data.lastPrice,
          lastRefreshed: data.lastRefreshed,
          prices: data.prices 
        };

        this.sharedData.setStockData(chartData);
      },
      error: (err) => {
        this.sharedData.setError('Error al buscar la acción');
        console.error(err);
      },
      complete: () => this.sharedData.setLoading(false)
    });
  }
}

}