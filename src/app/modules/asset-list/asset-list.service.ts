import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { WebSocketService } from 'src/app/services/websocket.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AssetListService {
  constructor(private webSocketService: WebSocketService) {}

  // default request object to get history of a symbol
  history = {
    "ticks_history": "",
    "adjust_start_time": 1,
    "count": 10,
    "end": "latest",
    "start": 1,
    "style": "ticks"
  };

  connect() {
    return this.webSocketService.connect(environment.DATA_URL);
  }

  disconnect() {
    this.webSocketService.disconnect();
  }

  getAssetList() {
    this.webSocketService.getAssetList();
  }

  getAssetHistory(assetCode: string) {
    this.history.ticks_history = assetCode;
    this.webSocketService.getAssetHistory(this.history);
  }
}
