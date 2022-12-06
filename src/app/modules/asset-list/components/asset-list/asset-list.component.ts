import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { AssetListService } from '../../asset-list.service';
import { Asset } from '../../models/assets.model';

@Component({
  selector: 'app-asset-list',
  templateUrl: './asset-list.component.html'
})
export class AssetListComponent implements OnInit, OnDestroy {
  binaryDataService!: Observable<MessageEvent>;
  webSocket!: WebSocketSubject<MessageEvent>;
  dataSubscription$!: Subscription;
  tableColumns: any[] = [];
  tableData: Asset[] = [];
  originalData: Asset[] = [];
  filters: any[] = [{ id: 0, filter: 'All', subFilters: [] }];
  activeIndex: number = 0;
  appliedFilters: string[] = [];

  basicData = {
    labels: [],
    datasets: [
      {
        data: [],
        fill: false,
        borderColor: '#FFA726',
        borderWidth: 1,
        tension: 0.1,
      }
    ],
  };

  chartOptions = {
    plugins: {
      legend: {
        display: false
      },
    },
    scales: {
      x: {
        display: false,
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        display: false,
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
    },
  };

  constructor(private assetListService: AssetListService) {
    // this.multiplex();
    this.binaryDataService = this.assetListService.connect().asObservable();
  }

  ngOnInit(): void {
    this.setTableColumns();
    this.subscribeToData();
    this.getAssetList();
  }

  // multiplex() {
  //   this.webSocket = this.assetListService.connect();
  //   const assets = this.webSocket.multiplex(
  //     () => this.assetListService.getAssetList(),
  //     () => console.log('unsub'),
  //     (messge: any) => { 
  //       console.log(messge);
  //       return messge;
  //     }
  //   )

  //   const history = this.webSocket.multiplex(
  //     () => this.assetListService.getAssetHistory('frxNZDUSD'),
  //     () => console.log('unsub'),
  //     (message: any) => (message)
  //   )

  //   assets.subscribe((data) => console.log('data', data));
  //   history.subscribe((hist) => console.log('hist', hist));
  // }

  setTableColumns() {
    this.tableColumns = [
      { id: 1, field: 'display_name', header: 'Name' },
      { id: 2, field: 'pip', header: 'Last Price' },
      { id: 3, field: '24hChange', header: '24h Change' },
      { id: 4, field: 'chart', header: '' },
      { id: 5, field: 'trade', header: '' },
    ];
  }

  subscribeToData() {
     this.dataSubscription$ = this.binaryDataService.subscribe((data: any) => {
      console.log('binary data', data);
      
      if(data.active_symbols) {
        this.originalData = data.active_symbols;
        this.tableData = data.active_symbols;
        this.setFilters();
        this.subscribeToChartData();
      } else if(data.history) {
        // Webworker can be used here
        this.tableData.forEach(row => {
          if(row.symbol === data.echo_req.ticks_history) {
            const basicData = {
              labels: data.history.times.map((time: number) => new Date(time).toLocaleDateString()),
              datasets: [
                {
                  data: data.history.prices,
                  fill: false,
                  borderColor: '#FFA726',
                  borderWidth: 1,
                  tension: 0.1,
                }
              ],
            };
            row.chartData = basicData;
          }
        })
      }
    });
  }

  setFilters() {
    let found: any;
    this.filters = this.tableData.reduce((acc, curr) => {
      found = acc.find(
        (item) => item['filter'] === curr['market_display_name']
      );
      if (found) {
        found.subFilters.indexOf(curr['submarket_display_name']) === -1 &&
          found.subFilters.push(curr['submarket_display_name']);
      } else {
        const filter = {
          id: acc.length,
          filter: curr['market_display_name'],
          subFilters: [curr['submarket_display_name']],
        };
        acc.push(filter);
      }
      return acc;
    }, this.filters);
  }

  subscribeToChartData() {
    this.tableData.forEach(row => {
      this.assetListService.getAssetHistory(row.symbol);
    });
  }

  getAssetList() {
    this.assetListService.getAssetList();
  }

  getAssetHistory(assetCode: string) {
    console.log('assetCode => ', assetCode);
    this.assetListService.getAssetHistory(assetCode);
  }

  disconnectSocket() {
    this.assetListService.disconnect();
  }

  applyMainFilters(activeIndex: number) {
    if (!activeIndex) {
      this.tableData = [...this.originalData];
      return;
    }
    this.activeIndex = activeIndex;
    const mainFilter = this.filters.find((fil) => fil.id === activeIndex);
    this.tableData = this.originalData.filter(
      (row) => row.market_display_name === mainFilter.filter
    );
  }

  handleSubFilterChange(event: any) {
    const filterOn: boolean = event.checked, subFilter: string = event.subFilter;
    if (filterOn) {
      this.appliedFilters.push(subFilter);
    } else {
      for (let i = 0; i < this.appliedFilters.length; i++) {
        if (subFilter === this.appliedFilters[i]) {
          this.appliedFilters.splice(i, 1);
          break;
        }
      }
    }
    this.applySubFilters(this.appliedFilters);
  }

  applySubFilters(filters: string[]) {
    if (!filters.length) {
      this.applyMainFilters(this.activeIndex);
      return;
    }
    this.tableData = this.originalData.filter(
      (row) => filters.indexOf(row.submarket_display_name) > -1
    );
  }

  trackByMethod(index:number, col:any): number {
    return col.id;
  }

  ngOnDestroy(): void {
      this.dataSubscription$?.unsubscribe();
  }
}
