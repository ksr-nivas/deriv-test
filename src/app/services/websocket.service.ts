import { Injectable } from '@angular/core';
import { map, Observable, Observer, Subject } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { AnonymousSubject } from 'rxjs/internal/Subject';


export interface Message {
    source: string;
    content: string;
}

@Injectable({providedIn: 'root'})
export class WebSocketService {
    private socket$!: WebSocketSubject<any>;
    constructor() {
    }

    public connect(url: string): WebSocketSubject<MessageEvent> {
        if (!this.socket$) {
            this.socket$ = this.create(url);
        }
        return this.socket$;
    }

    public disconnect() {
        this.socket$.complete();
    }

    private create(url: string) {
        return webSocket({
            url:'wss://frontend.binaryws.com/websockets/v3?app_id=1089',
            openObserver: {
                next: () => {
                    console.log('[WebSocketService]: connected');
                }
            },
            closeObserver: {
                next: () => {
                  console.log('[WebSocketService]: connection closed');
                }
            }
        });
    }

    public getAssetList() {
        this.socket$.next({
            "active_symbols": "brief",
            "product_type": "basic"
          });
    }

    public getAssetHistory(asset: any) {
        this.socket$.next(asset);
    }
    
}