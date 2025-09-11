// src/app/components/dashboard/dashboard.component.ts
import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DashboardSocketService } from '../../api/dashboard-socket.service';
import { MonthlyAggregate } from '../../models/monthly-aggregate.model';
import { BaseChartDirective} from 'ng2-charts';
import {ChartModule} from 'primeng/chart'
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,ChartModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      { data: [], label: 'Expenses', backgroundColor: [] }
    ]
  };  public pieChartLabels: string[] = [];
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true };

  aggregates: MonthlyAggregate[] = [];
  private sub!: Subscription;

  constructor(private wsService: DashboardSocketService) {
    // subscribe to the BehaviorSubject in the service
    this.sub = this.wsService.getAggregates().subscribe((data:MonthlyAggregate[]) => {
      this.aggregates = data;
      this.updatePieChart(this.aggregates);
    });
  }
  private updatePieChart(data: MonthlyAggregate[]) {
    const categoryTotals: { [key: string]: number } = {};
    data.forEach((agg) => {
      categoryTotals[agg.category] = (categoryTotals[agg.category] || 0) + Number(agg.totalAmount);
    });
  
    // generate random colors
    const colors = Object.keys(categoryTotals).map(
      () => '#' + Math.floor(Math.random() * 16777215).toString(16)
    );
  
    // assign new object so Angular detects the change
    this.pieChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        { data: Object.values(categoryTotals), label: 'Expenses', backgroundColor: colors }
      ]
    };
  
    // refresh the chart
    this.chart?.update();
  }
  
    ngOnDestroy() {
      if (this.sub) this.sub.unsubscribe();
      this.wsService.disconnect();
    }
}
  

