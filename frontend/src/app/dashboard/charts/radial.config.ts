import { ApexChart } from 'ng-apexcharts';

export const RADIAL_GAUGE_CHART: ApexChart = {
  type: 'radialBar',
  height: 300,
  offsetY: -20
};

export const RADIAL_GAUGE_OPTIONS = {
  plotOptions: {
    radialBar: {
      startAngle: -120,
      endAngle: 120,
      hollow: {
        size: '70%'
      },
      track: {
        background: '#f1f5f9'
      },
      dataLabels: {
        name: { show: false },
        value: {
          fontSize: '20px',
          fontWeight: 700,
          formatter: (val: number) => `${val}%`
        }
      }
    }
  },
  fill: {
    colors: ['#2563eb']
  }
};
