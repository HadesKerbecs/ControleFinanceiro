import {
  ApexChart,
  ApexXAxis,
  ApexPlotOptions,
  ApexDataLabels
} from 'ng-apexcharts';

/* =========================
   COMPARAÇÃO MENSAL
========================= */
export const COMPARISON_BAR_CHART: ApexChart = {
  type: 'bar',
  height: 320,
  toolbar: { show: false }
};

export const COMPARISON_BAR_XAXIS: ApexXAxis = {
  categories: ['Mês anterior', 'Mês atual']
};

export const COMPARISON_BAR_PLOT: ApexPlotOptions = {
  bar: {
    horizontal: false,
    columnWidth: '45%'
  }
};

/* =========================
   GASTO REAL MENSAL
========================= */
export const MONTHLY_REAL_BAR_CHART: ApexChart = {
  type: 'bar',
  height: 420,
  toolbar: { show: false }
};

export const MONTHLY_REAL_XAXIS: ApexXAxis = {
  categories: [],
  labels: {
    style: {
      colors: '#475569',
      fontSize: '12px'
    }
  }
};

export const MONTHLY_REAL_PLOT: ApexPlotOptions = {
  bar: {
    horizontal: true,
    barHeight: '70%',
    borderRadius: 6,
    dataLabels: {
      position: 'center'
    }
  }
};

export const MONTHLY_REAL_DATALABELS: ApexDataLabels = {
  enabled: true,
  textAnchor: 'middle',
  style: {
    fontSize: '12px',
    fontWeight: 600,
    colors: ['#ffffff']
  },
  formatter: (val: number) => `R$ ${val.toFixed(2)}`
};

export const MONTHLY_REAL_RESPONSIVE = [
  {
    breakpoint: 768,
    options: {
      dataLabels: { enabled: true },
      xaxis: {
        labels: {
          rotate: -45,
          style: { fontSize: '10px' }
        }
      }
    }
  }
];

/* =========================
   SUBCATEGORIAS
========================= */
export const SUBCATEGORY_BAR_CHART: ApexChart = {
  type: 'bar',
  height: 420,
  toolbar: { show: false }
};

export const SUBCATEGORY_BAR_PLOT: ApexPlotOptions = {
  bar: {
    horizontal: true,
    barHeight: '70%',
    borderRadius: 6
  }
};
