import { ApexChart, ApexStroke, ApexXAxis } from 'ng-apexcharts';

export const MONTHLY_LINE_CHART: ApexChart = {
  type: 'line',
  height: 320,
  toolbar: { show: false }
};

export const MONTHLY_LINE_STROKE: ApexStroke = {
  curve: 'smooth',
  width: 2
};

export const DEFAULT_LINE_XAXIS: ApexXAxis = {
  categories: [],
  labels: {
    style: {
      colors: '#475569',
      fontSize: '12px'
    }
  }
};

// Planejamento futuro
export const FUTURE_LINE_CHART: ApexChart = {
  type: 'line',
  height: 420,
  toolbar: { show: false }
};

export const FUTURE_LINE_STROKE: ApexStroke = {
  curve: 'smooth',
  width: 2
};
