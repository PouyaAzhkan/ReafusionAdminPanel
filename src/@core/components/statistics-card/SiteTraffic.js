// ** React Imports
import Chart from 'react-apexcharts';
import StatsWithLineChart from '../widgets/stats/StatsWithLineChart';
import { UserCheck } from 'react-feather';
import { GetLandingReport } from '../../Services/Api/DashboardPanel/GetLandingReport';

const SiteTrafficChart = ({ stats,statTitle, icon, color }) => {

  const { data, isLoading, error} = GetLandingReport();
  if (isLoading) return <p>درحال آمدن اطلاعات</p>
  if (error) return <p>خطا در آمدن اطلاعات</p>
  

  const options = {
    chart: {
      id: 'siteTraffic',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
      dropShadow: {
        enabled: true,
        top: 0,
        left: 0,
        blur: 4,
        opacity: 0,
      },
    },
    
    // colors: ['#28c76f'],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 5,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.8,
        gradientToColors: ['#5c4fdd', '#5c4fdd'], // بنفش به آبی
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: { show: false }
    },
    grid: {
      show: false
    },
    tooltip: {
      enabled: false,
    },
  };

  const series = [
    {
      name: 'Site Traffic',
      data: [110, 180, 160, 250, 220, 280, 280],
    },
  ];

  return (
    <StatsWithLineChart
      icon={icon}
      color={color}
      stats={stats || data.newsCount}
      statTitle={statTitle || "تعداد ایونت ها"}
      series={series}
      options={options}
      type='line'
      height="60px"
      cardHeight="170px"
      cardWidth={"383px"}
      headerFlexDirection={"d-flex"}
    />
  );
};

export default SiteTrafficChart;
