// ** Third Party Components
import Chart from 'react-apexcharts'
// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardHeader } from 'reactstrap'
import { GetCategoryCount } from '../../Services/Api/DashboardPanel/GetCategoryCount'

const Sales = props => {

  const { data, isLoading, error } = GetCategoryCount()
  if (isLoading) return <p>در حال بارگزاری اطلاعات</p>
  if (error) return <p>خطا در بارگزاری اطلاعات</p>

  const labels = data?.slice(0, 6).map(item => item.techName)
  const counts = data?.slice(0, 6).map(item => item.countUsed)

  const options = {
    chart: {
      type: 'radar',
      dropShadow: {
        enabled: true,
        blur: 8,
        left: 1,
        top: 0,
        opacity: 0.2
      },
      toolbar: { show: false },
      offsetY: 0
    },
    stroke: { width: 2, colors: ['#7367F0'] },
    dataLabels: {
      enabled: false
    },
    legend: { show: false },
    colors: ['#7367F0'],
    plotOptions: {
      radar: {
        size: 105,
        polygons: {
          strokeColors: ['#ebe9f1'],
          connectorColors: 'transparent',
          fill: {
            colors: ['#f8f8f8', '#fff']
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#00cfe8'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    labels: labels || [],
    markers: {
      size: 6,
      colors: ['#fff'],
      strokeColor: '#7367F0',
      strokeWidth: 2,
      hover: {
        size: 6
      }
    },
    yaxis: { show: false },
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const category = w.globals.labels[dataPointIndex]
        const count = series[seriesIndex][dataPointIndex]
        return `
          <div style="padding: 8px; border: 1px solid #7367F0; border-radius: 6px; background: #fff; text-align: right; direction: rtl;">
            <div style="background-color: #7367F0; color: #fff; padding: 4px 8px; border-radius: 4px; margin-bottom: 4px;">
              ${category}
            </div>
            <div style="color: #7367F0; font-weight: bold;">
              تعداد: ${count}
            </div>
          </div>
        `
      }
    },
    grid: {
      show: false,
      padding: {
        top: 0,
        bottom: 0
      }
    }
  }

  const series = [
    {
      name: 'تعداد استفاده',
      data: counts || []
    }
  ]

  return (
    <Card style={{ height: "385px" }}>
      <CardHeader>
        <CardTitle tag='h4'>تعداد دوره ها بر حسب دسته بندی</CardTitle>
      </CardHeader>
      <CardBody style={{ position: 'relative', height: '370px' }}>
        <div style={{ position: 'absolute', top: -50, left: 25, right: 0 }}>
          <Chart options={options} series={series} type='radar' height={350} />
        </div>
      </CardBody>
    </Card>
  )
}

export default Sales
