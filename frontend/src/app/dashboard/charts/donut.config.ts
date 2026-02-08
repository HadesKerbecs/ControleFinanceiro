import { ApexChart, ApexLegend, ApexTheme } from 'ng-apexcharts';

export const DONUT_THEME: ApexTheme = {
  mode: 'light'
};

export const DONUT_LEGEND: ApexLegend = {
  position: 'bottom',
  fontSize: '13px',
  labels: {
    colors: '#334155'
  }
};

export const DONUT_CHART: ApexChart = {
  type: 'donut',
  height: 320,
  toolbar: { show: false }
};

export const CARD_DONUT_CHART: ApexChart = {
  type: 'donut',
  height: 320,
  toolbar: { show: false }
};
