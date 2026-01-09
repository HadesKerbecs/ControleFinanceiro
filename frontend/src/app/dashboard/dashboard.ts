import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, NgApexchartsModule]
})

export class Dashboard {
  alerts: any;
  goals: any;

  chartOptions: any = {
    series: [44, 55, 13],
    chart: { 
      type: 'donut',
      height: 320
    },
    labels: ['Alimentação', 'Transporte', 'Lazer'],
    theme: { mode: 'dark' }
  };

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.getSummary().subscribe(data => {
      this.chartOptions.series = data.values;
      this.chartOptions.labels = data.labels;
    });

    this.dashboardService.getAlerts().subscribe(data => {
    this.alerts = data;
  });

    this.dashboardService.getGoals().subscribe(data => {
    this.goals = data;
  });
  }
}
