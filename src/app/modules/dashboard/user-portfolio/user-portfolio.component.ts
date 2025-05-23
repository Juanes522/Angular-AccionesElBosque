import { Component, OnInit } from '@angular/core';
import { TradingServiceService } from 'src/app/services/trading-service.service';
import { MessageService } from 'primeng/api';
import { MarketDataServiceService } from 'src/app/services/market-data-service.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { PortfolioService, FillActivity, ParsedTransferActivity, AcceptedOrder } from 'src/app/services/portfolio.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-portfolio',
  templateUrl: './user-portfolio.component.html',
  styleUrls: ['./user-portfolio.component.css']
})
export class UserPortfolioComponent implements OnInit, AfterViewInit {

  accountId: string = '';

  // Panel de trading - compra
  hideTradeTypeButtons: boolean = false;
  userId: string = '';

  // Configuracion para grafico de rendimiento
  loading: boolean = false;
  errorMessage: string | null = null;

  acceptedOrders: AcceptedOrder[] = [];
  combinedOrdersDataSource = new MatTableDataSource<any>();
  combinedDisplayedColumns: string[] = [
    'order_id', 'side', 'symbol', 'qty', 'status', 'date', 'price'
  ];

  // Datos para la tabla de acciones adquiridas
  fillActivities: FillActivity[] = [];
  fillDisplayedColumns: string[] = [
    'order_id', 'side', 'symbol', 'qty', 'order_status', 'transaction_time', 'price'
  ];

  // Datos para la tabla de órdenes recientes
  transferActivities: ParsedTransferActivity[] = [];
  transferDisplayedColumns: string[] = [
    'id', 'direction', 'transfer_type', 'net_amount', 'status', 'date'
  ];

  fillDataSource = new MatTableDataSource<FillActivity>();
  transferDataSource = new MatTableDataSource<ParsedTransferActivity>();

  @ViewChild('fillPaginator') fillPaginator!: MatPaginator;
  @ViewChild('transferPaginator') transferPaginator!: MatPaginator;
  @ViewChild('combinedPaginator') combinedPaginator!: MatPaginator;


  // Panel de trading compra
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

  constructor(
    private authService: AuthServiceService,
    private marketData: MarketDataServiceService,
    private tradingService: TradingServiceService,
    private messageService: MessageService,
    private portfolioService: PortfolioService
  ) { }

  ngOnInit() {
    this.accountId = this.authService.getCurrentAlpacaUserId() || '';

    if (this.accountId) {
      this.loadCombinedOrders(this.accountId);
      console.log('Using Alpaca account ID:', this.accountId); // For debugging
    } else {
      console.error('No Alpaca account ID found - user might not be logged in or account not created');
      // You might want to redirect to login or show an error message
      this.showError('Error', 'No se encontró la cuenta de Alpaca. Por favor inicie sesión nuevamente.');
      return;
    }
  }

  ngAfterViewInit() {
    this.fillDataSource.paginator = this.fillPaginator;
    this.transferDataSource.paginator = this.transferPaginator;
    this.combinedOrdersDataSource.paginator = this.combinedPaginator;
  }

  /*
  loadData(accountId: string): void {

    // Cargar datos de FILL
    this.portfolioService.getFillActivitiesByAccountId(accountId).subscribe({
      next: (activities: FillActivity[]) => {
        this.fillDataSource.data = activities;
        this.loadTransferData(accountId);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
  */

  loadTransferData(accountId: string): void {
    // Cargar datos de TRANS
    this.portfolioService.getTransferActivitiesByAccountId(accountId).subscribe({
      next: (transfers: ParsedTransferActivity[]) => {
        this.transferDataSource.data = transfers;
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }

  //------

  loadCombinedOrders(accountId: string): void {
    forkJoin([
      this.portfolioService.getAcceptedOrdersByAccountId(accountId),
      this.portfolioService.getFillActivitiesByAccountId(accountId)
    ]).subscribe({
      next: ([acceptedOrders, filledOrders]) => {
        // Procesar y combinar las órdenes
        this.processOrders(acceptedOrders, filledOrders);
        this.loadTransferData(accountId);
      },
      error: (err) => console.error('Error loading orders:', err)
    });
  }

  private processOrders(acceptedOrders: AcceptedOrder[], filledOrders: FillActivity[]): void {
    const filledOrdersMap = new Map(filledOrders.map(order => [order.order_id, order]));
    const acceptedOrdersMap = new Map(acceptedOrders.map(order => [order.id, order]));

    const combinedFromAccepted = acceptedOrders.map(acceptedOrder => {
      const filledOrder = filledOrdersMap.get(acceptedOrder.id);

      if (filledOrder) {
        return {
          order_id: acceptedOrder.id,
          side: acceptedOrder.side,
          symbol: acceptedOrder.symbol,
          qty: filledOrder.qty, 
          status: 'filled',
          order_status: 'filled',
          date: filledOrder.transaction_time,
          price: filledOrder.price,
          original_status: 'filled'
        };
      }

      // Orden aceptada pero no ejecutada aún
      return {
        order_id: acceptedOrder.id,
        side: acceptedOrder.side,
        symbol: acceptedOrder.symbol,
        qty: acceptedOrder.qty,
        status: acceptedOrder.status,
        order_status: acceptedOrder.status,
        date: acceptedOrder.created_at,
        price: acceptedOrder.filled_avg_price || '-',
        original_status: 'accepted'
      };
    });

    // Procesar órdenes FILL que no tienen orden aceptada
    const combinedFromFilled = filledOrders
      .filter(filledOrder => !acceptedOrdersMap.has(filledOrder.order_id))
      .map(filledOrder => ({
        order_id: filledOrder.order_id,
        side: filledOrder.side,
        symbol: filledOrder.symbol,
        qty: filledOrder.qty,
        status: 'filled',
        order_status: 'filled',
        date: filledOrder.transaction_time,
        price: filledOrder.price,
        original_status: 'filled'
      }));

    // Combinar ambos conjuntos y ordenar por fecha
    this.combinedOrdersDataSource.data = [...combinedFromAccepted, ...combinedFromFilled]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  //------

  /*
  getStatusClass(status: string): string {
    return `status-${status.toLowerCase().replace('_', '-')}`;
  }
  */

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'filled': 'completed',
      'accepted': 'pending',
      'partially_filled': 'partial',
      'pending': 'pending',
      'canceled': 'canceled',
      'rejected': 'rejected',
      'executed': 'executed'
    };
    return statusMap[status.toLowerCase()] || 'pending';
  }

  getStatusText(status: string): string {
    const textMap: Record<string, string> = {
      'filled': 'Completado',
      'accepted': 'Aceptado',
      'partially_filled': 'Parcialmente Ejecutado',
      'pending': 'Pendiente',
      'canceled': 'Cancelado',
      'rejected': 'Rechazado',
      'executed': 'Completado'
    };
    return textMap[status.toLowerCase()] || status;
  }

  formatPrice(price: string): string {
    return parseFloat(price).toFixed(2);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
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

}
