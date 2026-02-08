import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexXAxis
} from 'ng-apexcharts';

import ApexCharts from 'apexcharts';
import { DashboardService } from './dashboard.service';

// Donut
import {
  DONUT_CHART,
  CARD_DONUT_CHART,
  DONUT_LEGEND,
  DONUT_THEME
} from './charts/donut.config';

// Line
import {
  MONTHLY_LINE_CHART,
  MONTHLY_LINE_STROKE,
  DEFAULT_LINE_XAXIS,
  FUTURE_LINE_CHART,
  FUTURE_LINE_STROKE
} from './charts/line.config';

// Bar
import {
  COMPARISON_BAR_CHART,
  COMPARISON_BAR_XAXIS,
  COMPARISON_BAR_PLOT,
  MONTHLY_REAL_BAR_CHART,
  MONTHLY_REAL_XAXIS,
  MONTHLY_REAL_PLOT,
  MONTHLY_REAL_DATALABELS,
  MONTHLY_REAL_RESPONSIVE,
  SUBCATEGORY_BAR_CHART,
  SUBCATEGORY_BAR_PLOT
} from './charts/bar.config';

// Radial
import {
  RADIAL_GAUGE_CHART,
  RADIAL_GAUGE_OPTIONS
} from './charts/radial.config';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [CommonModule, NgApexchartsModule]
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('dashboardContainer', { static: true }) dashboardContainer!: ElementRef;

  private resizeObserver!: ResizeObserver;

  salaryGoal: any = null;
  limitGoal: any = null;
  alerts: any = null;
  goals: any = null;

  categoryGoals: any[] = [];

  series: ApexNonAxisChartSeries = [];
  labels: string[] = [];

  monthlySeries: ApexAxisChartSeries = [];
  monthlyXAxis: ApexXAxis = { ...DEFAULT_LINE_XAXIS };

  cardSeries: ApexNonAxisChartSeries = [];
  cardLabels: string[] = [];

  comparisonSeries: ApexAxisChartSeries = [];

  totalSeries: ApexNonAxisChartSeries = [];
  totalLabels: string[] = [];

  cardTotalSeries: ApexNonAxisChartSeries = [];
  cardTotalLabels: string[] = [];

  monthlyPurchasesSeries: ApexAxisChartSeries = [];
  monthlyRealXAxis: ApexXAxis = { ...MONTHLY_REAL_XAXIS };

  futurePlanningSeries: ApexAxisChartSeries = [];
  futurePlanningXAxis: ApexXAxis = { categories: [] };

  subcategorySeries: ApexAxisChartSeries = [];
  subcategoryXAxis: ApexXAxis = { categories: [] };

  thirdPartyGaugeSeries: number[] = [];
  myRealGaugeSeries: number[] = [];
  thirdPartyData: any = null;

  // Charts configs
  theme = DONUT_THEME;
  legend = DONUT_LEGEND;

  chart = DONUT_CHART;
  cardChart = CARD_DONUT_CHART;

  monthlyChart = MONTHLY_LINE_CHART;
  monthlyStroke = MONTHLY_LINE_STROKE;

  comparisonChart = COMPARISON_BAR_CHART;
  comparisonXAxis = COMPARISON_BAR_XAXIS;
  comparisonPlotOptions = COMPARISON_BAR_PLOT;

  monthlyRealChart = MONTHLY_REAL_BAR_CHART;
  monthlyRealPlotOptions = MONTHLY_REAL_PLOT;
  dataLabels = MONTHLY_REAL_DATALABELS;
  monthlyRealResponsive = MONTHLY_REAL_RESPONSIVE;

  futurePlanningChart = FUTURE_LINE_CHART;
  futurePlanningStroke = FUTURE_LINE_STROKE;

  subcategoryChart = SUBCATEGORY_BAR_CHART;
  subcategoryPlotOptions = SUBCATEGORY_BAR_PLOT;

  thirdPartyGaugeChart = RADIAL_GAUGE_CHART;
  thirdPartyGaugeOptions = RADIAL_GAUGE_OPTIONS;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadSummary();
    this.loadAlerts();
    this.loadGoals();
    this.loadCategoryGoals();
    this.loadMonthlyEvolution();
    this.loadByCard();
    this.loadMonthComparison();
    this.loadCategoryTotals();
    this.loadByCardTotal();
    this.loadMonthlyRealCost();
    this.loadFuturePlanning();
    this.loadSubcategoryTotals();
    this.loadThirdPartyGauge();
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      ApexCharts.exec('all', 'updateOptions', {}, false, true);
    });

    this.resizeObserver.observe(this.dashboardContainer.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
  /* =========================
     LOADERS
  ========================= */

  private loadSummary(): void {
    this.dashboardService.getSummary().subscribe(data => {
      this.series = [...data.values];
      this.labels = [...data.labels];
      this.salaryGoal = data.salary_based;
      this.limitGoal = data.limit_based;
      this.cdr.detectChanges();
    });
  }

  private loadAlerts(): void {
    this.dashboardService.getAlerts().subscribe(data => {
      this.alerts = data;
      this.cdr.detectChanges();
    });
  }

  private loadGoals(): void {
    this.dashboardService.getGoals().subscribe(data => {
      this.goals = data;
      this.cdr.detectChanges();
    });
  }

  private loadCategoryGoals(): void {
    this.dashboardService.getCategoryGoals().subscribe(data => {
      this.categoryGoals = data;
      this.cdr.detectChanges();
    });
  }

  private loadMonthlyEvolution(): void {
    this.dashboardService.getMonthlyEvolution().subscribe(data => {
      this.monthlySeries = [{ name: 'Gastos', data: data.values }];
      this.monthlyXAxis.categories = data.labels;
      this.cdr.detectChanges();
    });
  }

  private loadByCard(): void {
    this.dashboardService.getByCard().subscribe(data => {
      this.cardSeries = [...data.values];
      this.cardLabels = [...data.labels];
      this.cdr.detectChanges();
    });
  }

  private loadMonthComparison(): void {
    this.dashboardService.getMonthComparison().subscribe(data => {
      this.comparisonSeries = [{ name: 'Gastos', data: data.values }];
      this.comparisonXAxis.categories = data.labels;
      this.cdr.detectChanges();
    });
  }

  private loadCategoryTotals(): void {
    this.dashboardService.getCategoryTotals().subscribe(data => {
      this.totalSeries = [...data.values];
      this.totalLabels = [...data.labels];
      this.cdr.detectChanges();
    });
  }

  private loadByCardTotal(): void {
    this.dashboardService.getByCardTotal().subscribe(data => {
      this.cardTotalSeries = [...data.values];
      this.cardTotalLabels = [...data.labels];
      this.cdr.detectChanges();
    });
  }

  private loadMonthlyRealCost(): void {
    this.dashboardService.getMonthlyRealCost().subscribe(data => {
      this.monthlyPurchasesSeries = [{ name: 'Gasto mensal real', data: data.values }];
      this.monthlyRealXAxis.categories = data.labels;
      this.cdr.detectChanges();
    });
  }

  private loadFuturePlanning(): void {
    this.dashboardService.getFuturePlanning().subscribe(data => {
      this.futurePlanningSeries = [{ name: 'Planejamento', data: data.values }];
      this.futurePlanningXAxis.categories = data.labels;
      this.cdr.detectChanges();
    });
  }

  private loadSubcategoryTotals(): void {
    this.dashboardService.getSubcategoryTotals().subscribe(data => {
      this.subcategorySeries = [{ name: 'Gastos', data: data.values }];
      this.subcategoryXAxis.categories = data.labels;
      this.cdr.detectChanges();
    });
  }

  private loadThirdPartyGauge(): void {
    this.dashboardService.getThirdPartyGauge().subscribe(data => {
      this.thirdPartyData = data;
      this.thirdPartyGaugeSeries = [data.third_party.percentage];
      this.myRealGaugeSeries = [data.my_real.percentage];
      this.cdr.detectChanges();
    });
  }

}
