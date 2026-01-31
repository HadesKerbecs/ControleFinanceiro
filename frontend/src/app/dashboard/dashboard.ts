import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexChart,
  ApexLegend,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexStroke
} from 'ng-apexcharts';
import { DashboardService } from './dashboard.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, NgApexchartsModule]
})
export class Dashboard implements OnInit {
  isChartReady = false;

  salaryGoal: any = null;
  limitGoal: any = null;

  alerts: any = null;
  goals: any = null;

  categoryGoals: any[] = [];
  series: ApexNonAxisChartSeries = [];
  labels: string[] = [];
  monthlySeries: ApexAxisChartSeries = [];
  monthlyLabels: string[] = [];
  cardSeries: ApexNonAxisChartSeries = [];
  cardLabels: string[] = [];
  comparisonSeries: ApexAxisChartSeries = [];
  fixedCommitments: any[] = [];

  chart: ApexChart = {
    type: 'donut',
    height: 320
  };

  cardChart: ApexChart = {
    type: 'donut',
    height: 320
  };

  theme: ApexTheme = {
    mode: 'dark'
  };

  legend: ApexLegend = {
    position: 'bottom'
  };

  monthlyChart: ApexChart = {
    type: 'line',
    height: 320,
    toolbar: { show: false }
  };

  monthlyXAxis: ApexXAxis = {
    categories: []
  };

  monthlyStroke: ApexStroke = {
    curve: 'smooth'
  };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadSummary();
    this.loadAlerts();
    this.loadGoals();
    this.loadCategoryGoals();
    this.loadMonthlyEvolution();
    this.loadByCard();
    this.loadMonthComparison();
    this.loadFixedCommitments();
  }

  private loadSummary(): void {
    this.dashboardService.getSummary().subscribe(data => {

      setTimeout(() => {
        this.series = [...data.values];
        this.labels = [...data.labels];

        this.salaryGoal = data.salary_based;
        this.limitGoal = data.limit_based;
        this.cdr.detectChanges();
      });

    });
  }

  private loadAlerts(): void {
    this.dashboardService.getAlerts().subscribe(data => {

      setTimeout(() => {
        this.alerts = data;
        this.cdr.detectChanges();
      });

    });
  }

  private loadGoals(): void {
    this.dashboardService.getGoals().subscribe(data => {

      setTimeout(() => {
        this.goals = data;
        this.cdr.detectChanges();
      });

    });
  }

  private loadCategoryGoals(): void {
    this.dashboardService.getCategoryGoals().subscribe(data => {

      setTimeout(() => {
        this.categoryGoals = data;
        this.cdr.detectChanges();
      });

    });
  }

  private loadMonthlyEvolution(): void {
    this.dashboardService.getMonthlyEvolution().subscribe(data => {

      setTimeout(() => {
        this.monthlySeries = [
          {
            name: 'Gastos',
            data: data.values
          }
        ];

        this.monthlyLabels = data.labels;
        this.monthlyXAxis.categories = data.labels;

        this.cdr.detectChanges();
      });

    });
  }

  private loadByCard(): void {
    this.dashboardService.getByCard().subscribe(data => {

      setTimeout(() => {
        this.cardSeries = [...data.values];
        this.cardLabels = [...data.labels];
        this.cdr.detectChanges();
      });

    });
  }

  comparisonChart: ApexChart = {
    type: 'bar',
    height: 320,
    toolbar: { show: false }
  };

  comparisonXAxis: ApexXAxis = {
    categories: ['Mês anterior', 'Mês atual']
  };

  comparisonPlotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: '45%'
    }
  };

  private loadMonthComparison(): void {
    this.dashboardService.getMonthComparison().subscribe(data => {

      setTimeout(() => {
        this.comparisonSeries = [
          {
            name: 'Gastos',
            data: data.values
          }
        ];

        this.comparisonXAxis.categories = data.labels;

        this.cdr.detectChanges();
      });

    });
  }

  private loadFixedCommitments(): void {
    this.dashboardService.getFixedCommitments().subscribe(data => {
      this.fixedCommitments = data.filter(c => c.active);
      this.cdr.detectChanges();
    });
  }


}
