import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { MarketDataServiceService } from 'src/app/services/market-data-service.service';
import { TradingServiceService } from 'src/app/services/trading-service.service';
import { MessageService } from 'primeng/api';
import * as echarts from 'echarts';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

// nico aqui te dejo la ip que me pasaste
  accountId: string = '';

// Configuración del gráfico para la consulta de acciones por simbolo
  chartOption: EChartsOption = {};
  searchQuery: string = '';
  selectedStock: any = null;
  loading: boolean = false;
  errorMessage: string | null = null;

// Panel de trading - compra
  hideTradeTypeButtons: boolean = false;
  userId: string = '';

  tradeSymbol: string = '';
  tradeAmount: number = 1;
  tradeOrderType: string = 'market';
  tradeTime: string = 'day';
  buyType: string = 'shares';
  tradeType: 'buy' | 'sell' = 'buy';
  marketPrice: number | null = 205.11;
  dollarAmount: number = 100;
  estimatedShares: number = 0;
  showOrderReview: boolean = false;

// Colores para candlestick respecto al rendimiento de las acciones
  private upColor = '#00da3c';
  private upBorderColor = '#008F28';
  private downColor = '#ec0000';
  private downBorderColor = '#8A0000';

  constructor(
    private authService: AuthServiceService,
    private marketData: MarketDataServiceService,
    private tradingService: TradingServiceService,
    private messageService: MessageService,
    private router: Router
  ) { }


// Arranque con la representación de microsoft para test inicial,
// se puede quitar para no gastar intentos
// In FundAccountComponent
ngOnInit() {
  this.accountId = this.authService.getCurrentAlpacaUserId() || '';
  if (!this.accountId) {
    console.error('No Alpaca account ID found - user might not be logged in or account not created');
    // You might want to redirect to login or show an error message
    this.showError('Error', 'No se encontró la cuenta de Alpaca. Por favor inicie sesión nuevamente.');
    return;
  }
  console.log('Using Alpaca account ID:', this.accountId); // For debugging
}

// In your template, you might want to show a loading state or error if accountId is missing

// Carga de datos al grafico
  loadPortfolioChart(symbol: string) {
    this.loading = true;
    this.errorMessage = null;

    this.marketData.getStockData(symbol).subscribe({
      next: (data) => {
        if (!data) {
          this.errorMessage = 'No se pudieron cargar los datos';
          return;
        }

        this.setChartOptions(data);
      },
      error: (err) => {
        this.errorMessage = 'Error al cargar los datos. Intente nuevamente.';
        console.error(err);
      },
      complete: () => this.loading = false
    });
  }

// Configuración inicial de la grafica para las acciones
  setChartOptions(data: any) {
    this.chartOption = {
      backgroundColor: '#1e1e1e',
      dataset: {
        source: this.prepareChartData(data.prices)
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line'
        }
      },
      grid: [
        {
          left: '10%',
          right: '10%',
          bottom: 200
        },
        {
          left: '10%',
          right: '10%',
          height: 80,
          bottom: 80
        }
      ],
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          axisLine: { onZero: false, lineStyle: { color: '#555' } },
          splitLine: { show: false },
          axisLabel: { color: '#b3b3b3' },
          min: 'dataMin',
          max: 'dataMax'
        },
        {
          type: 'category',
          gridIndex: 1,
          boundaryGap: false,
          axisLine: { onZero: false },
          axisTick: { show: false },
          splitLine: { show: false },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax'
        }
      ],
      yAxis: [
        {
          scale: true,
          splitArea: { show: true },
          axisLine: { lineStyle: { color: '#555' } },
          axisLabel: { color: '#b3b3b3' },
          splitLine: { lineStyle: { color: '#333' } }
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 10,
          end: 100
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 10,
          start: 10,
          end: 100,
          textStyle: { color: '#b3b3b3' },
          handleStyle: {
            color: '#8937ee'
          }
        }
      ],
      visualMap: {
        show: false,
        seriesIndex: 1,
        dimension: 6,
        pieces: [
          { value: 1, color: this.upColor },
          { value: -1, color: this.downColor }
        ]
      },
      series: [
        {
          type: 'candlestick',
          itemStyle: {
            color: this.upColor,
            color0: this.downColor,
            borderColor: this.upBorderColor,
            borderColor0: this.downBorderColor
          },
          encode: {
            x: 0,
            y: [1, 4, 3, 2]
          }
        },
        {
          name: 'Volumen',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            color: '#7fbe9e'
          },
          large: true,
          encode: {
            x: 0,
            y: 5
          }
        }
      ]
    };
  }

  prepareChartData(prices: any[]) {
    return prices.map((price, index) => {
      const sign = price.close >= price.open ? 1 : -1;
      return [
        price.date,
        price.open,
        price.high,
        price.low,
        price.close,
        price.volume,
        sign
      ];
    });
  }

// Consulta para busqueda de las acciones.
  searchStock() {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.errorMessage = null;

      this.marketData.getStockData(this.searchQuery.trim()).subscribe({
        next: (data) => {
          if (!data) {
            this.errorMessage = 'Acción no encontrada';
            return;
          }

          this.selectedStock = {
            symbol: data.symbol,
            price: data.lastPrice,
            lastRefreshed: data.lastRefreshed
          };

          this.tradeSymbol = data.symbol;
          this.setChartOptions(data);
        },
        error: (err) => {
          this.errorMessage = 'Error al buscar la acción';
          console.error(err);
        },
        complete: () => this.loading = false
      });
    }
  }

  setTradeType(type: 'buy' | 'sell') {
    this.tradeType = type;
    this.calculateValues();
  }

// Metodo para cargar precio del mercado por acción
  loadMarketPrice() {
    if (this.tradeSymbol) {
      this.loading = true;
      this.marketData.getStockData(this.tradeSymbol).subscribe({
        next: (data) => {
          if (data && data.lastPrice) {
            this.marketPrice = data.lastPrice;
            this.calculateValues();
          }
        },
        error: (err) => {
          console.error('Error loading market price:', err);
        },
        complete: () => this.loading = false
      });
    }
  }

  onBuyTypeChange() {
    this.tradeAmount = 1;
    this.dollarAmount = 1;
    this.estimatedShares = 1;

    if (this.marketPrice) {
      if (this.buyType === 'dollars') {
        this.estimatedShares = this.dollarAmount / this.marketPrice;
      } else {
        this.dollarAmount = this.tradeAmount * this.marketPrice;
      }
    }
  }

// Calculo para carga del precio actual del mercado
  calculateValues() {
    if (this.marketPrice) {
      if (this.buyType === 'dollars') {
        this.estimatedShares = this.dollarAmount / this.marketPrice;
      } else {
        this.dollarAmount = this.tradeAmount * this.marketPrice;
      }
    }
  }

// Calculo para cantidad de dolares
  calculateDollarAmount() {
    if (this.marketPrice && this.buyType === 'shares') {
      this.dollarAmount = this.tradeAmount * this.marketPrice;
    }
  }

// Calculo para cantidad de acciones
  calculateShareAmount() {
    if (this.marketPrice && this.buyType === 'dollars') {
      this.estimatedShares = this.dollarAmount / this.marketPrice;
    }
  }

// Calculo para cantidad de acciones o dolares, segun opción seleccionada
  calculateTotal(): number {
    if (!this.marketPrice) return 0;

    if (this.buyType === 'shares') {
      return this.tradeAmount * this.marketPrice;
    } else {
      return this.dollarAmount;
    }
  }

// Revisión de los parametros de orden
  reviewOrder() {
    if (!this.tradeSymbol) {
      this.errorMessage = 'Por favor ingrese un símbolo válido';
      return;
    }

    if ((this.buyType === 'shares' && this.tradeAmount <= 0) ||
        (this.buyType === 'dollars' && this.dollarAmount <= 0)) {
      this.errorMessage = 'Por favor ingrese una cantidad válida';
      return;
    }

    if (!this.marketPrice) {
      this.errorMessage = 'No se pudo obtener el precio de mercado';
      return;
    }

    this.errorMessage = null;
    this.showOrderReview = true;
    this.hideTradeTypeButtons = true;
  }

// Edición de la orden
  editOrder() {
    this.showOrderReview = false;
    this.hideTradeTypeButtons = false;
  }


// --- Logica para el envio de ordenes ---



// Confirmación de la orden, descomentarear cuando se integre con el servicio ☺
confirmOrder() {
  if (!this.accountId) {
    this.showError('Error', 'No se encontró el ID de la cuenta. Por favor inicie sesión nuevamente.');
    return;
  }

  const orderData = {
    symbol: this.tradeSymbol,
    qty: this.buyType === 'shares' ? this.tradeAmount : this.estimatedShares,
    side: this.tradeType,
    type: 'market',
    time_in_force: 'day'
  };

  console.log('Datos a enviar:', JSON.stringify({
    accountId: this.accountId,
    orderData: orderData
  }, null, 2));

  this.tradingService.placeOrder(this.accountId, orderData).subscribe({
    next: (response) => {
      this.showSuccess('Orden ejecutada', 'La orden se ha completado exitosamente');
      this.resetAfterOrder();
    },
    error: (err) => {
      this.showError('Error en la orden', err.error?.message || 'Ocurrió un error al procesar la orden');
    }
  });
}


  private resetAfterOrder() {
    this.showOrderReview = false;
    this.hideTradeTypeButtons = false;
    this.tradeSymbol = '';
    this.tradeAmount = 1;
    this.dollarAmount = 100;
    this.marketPrice = null;
    this.estimatedShares = 0;
  }

// mensajes de estado
  private showSuccess(summary: string, detail: string) {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
      life: 5000
    });
  }

  private showError(summary: string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      life: 5000
    });
  }

  onLogout(): void{
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
