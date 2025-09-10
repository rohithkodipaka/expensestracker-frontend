// src/app/api/dashboard-socket.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { MonthlyAggregate } from '../models/monthly-aggregate.model';
import { Auth } from '../auth/auth'; // adjust path if needed
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardSocketService implements OnDestroy {
  private stompClient!: Client;
  private aggregatesSubject = new BehaviorSubject<MonthlyAggregate[]>([]);
  private socketUrl = 'http://localhost:8080/api/ws-dashboard'; // your backend SockJS endpoint
  private apiUrl = 'http://localhost:8080/api/monthly-aggregates/';
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelayMs = 5000;

  constructor(private authService: Auth,private http:HttpClient) {
    this.loadInitialAggregates();
    this.connect();
  }

  private loadInitialAggregates(): void {
    this.http.get<MonthlyAggregate[]>(this.apiUrl).subscribe({
      next: (data) => this.aggregatesSubject.next(data),
      error: (err) =>
        console.error('[DashboardService] Failed to load initial aggregates', err),
    });
  }

  private connect(): void {
    const socket = new SockJS(this.socketUrl);
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 0, // manual reconnect handled below
      debug: (str) => console.log('[STOMP]', str),
    });

    this.stompClient.onConnect = () => {
      console.log('[STOMP] Connected');
      this.reconnectAttempts = 0; // reset reconnect attempts

      this.stompClient.subscribe('/topic/aggregates', (message: IMessage) => {
        const aggregate: MonthlyAggregate = JSON.parse(message.body);
        const current = this.aggregatesSubject.getValue();
        const index = current.findIndex(
          (a) =>
            a.userId === aggregate.userId &&
            a.year === aggregate.year &&
            a.month === aggregate.month &&
            a.category === aggregate.category
        );

        if (index > -1) current[index] = aggregate;
        else current.push(aggregate);

        this.aggregatesSubject.next([...current]);
      });
    };

    this.stompClient.onStompError = (frame) => {
      console.error('[STOMP] Error:', frame);
    };

    this.stompClient.onWebSocketClose = () => {
      console.warn('[STOMP] Connection closed, attempting reconnect...');
      this.tryReconnect();
    };

    this.stompClient.activate();
  }

  private tryReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `[STOMP] Reconnecting in ${this.reconnectDelayMs / 1000}s... (Attempt ${this.reconnectAttempts})`
      );
      setTimeout(() => this.connect(), this.reconnectDelayMs);
    } else {
      console.error('[STOMP] Max reconnect attempts reached. Could not reconnect.');
    }
  }

  getAggregates() {
    return this.aggregatesSubject.asObservable();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
