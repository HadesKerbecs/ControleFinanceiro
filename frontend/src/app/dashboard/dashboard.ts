import { Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [NgApexchartsModule]
})

export class Dashboard {
  chartOptions: any = {
    series: [44, 55, 13],
    chart: { type: 'donut' },
    labels: ['Alimentação', 'Transporte', 'Lazer'],
    theme: { mode: 'dark' }
  };

  constructor(private dashboardService: DashboardService) {
    this.dashboardService.getSummary().subscribe(data => {
      this.chartOptions.series = data.values;
      this.chartOptions.labels = data.labels;
    });
  }
}
