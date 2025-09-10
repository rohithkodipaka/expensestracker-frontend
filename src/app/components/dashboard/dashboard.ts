// src/app/components/dashboard/dashboard.component.ts
import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DashboardSocketService } from '../../api/dashboard-socket.service';
import { MonthlyAggregate } from '../../models/monthly-aggregate.model';
import {NgChartsModule} from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,NgChartsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnDestroy {
  aggregates: MonthlyAggregate[] = [];
  private sub!: Subscription;

  constructor(private wsService: DashboardSocketService) {
    // subscribe to the BehaviorSubject in the service
    this.sub = this.wsService.getAggregates().subscribe((data) => {
      this.aggregates = data;
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();          // avoid memory leaks
    this.wsService.disconnect();     // properly disconnect from backend
  }
}
