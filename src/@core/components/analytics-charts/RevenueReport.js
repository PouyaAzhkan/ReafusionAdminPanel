import Chart from 'react-apexcharts'
import '../../../assets/scss/PanelResponsive/Dashboard.scss'
import { NavLink } from 'react-router-dom'
import { Row, Col, Card, CardTitle } from 'reactstrap'

const RevenueReport = ({ title, apiData, valueKey , labelKey, color, hasMore = false }) => {
  if (!apiData) return <p>اطلاعاتی موجود نیست</p>

  const categories = apiData.map(group => group[labelKey])
  const values = apiData.map(group => group[valueKey])

  const options = {
    chart: {
      stacked: true,
      type: 'bar',
      toolbar: { show: false }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex }) {
        const groupName = categories[dataPointIndex]
        const value = series[seriesIndex][dataPointIndex]
        return `<div class="apex-tooltip text-center p-50"><strong>${groupName}</strong><br/> ظرفیت: ${value}</div>`
      }
    },
    grid: {
      padding: {
        top: -20,
        bottom: -10
      },
      yaxis: {
        lines: { show: false }
      }
    },
    xaxis: {
      categories: categories,
      labels: {
        rotate: -45,
        formatter: value => (value.length > 6 ? value.slice(0, 6) + '…' : value),
        style: {
          colors: '#000',
          fontSize: '0.86rem'
        }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: [color],
    plotOptions: {
      bar: {
        columnWidth: '30%',
        borderRadius: [4],
        borderRadiusWhenStacked: 'all',
        borderRadiusApplication: 'start'
      },
      distributed: true
    },
    yaxis: {
      labels: {
        style: {
          colors: '#000',
          fontSize: '0.86rem'
        }
      }
    }
  }

  const series = [
    {
      name: 'ظرفیت',
      data: values
    }
  ]

  return (
    <Card className="card-revenue-budget w-xl-auto revenue-card">
      <Row>
        <Col className='revenue-report-wrapper' md='12' xs='12'>
          <div className='d-sm-flex justify-content-between align-items-center mb-1'>
            <CardTitle className='mb-50 mb-sm-0 p-1 text-dark'>{title}</CardTitle>
            <div className='d-flex align-items-center gap-1'>
              {hasMore && (   
                    <NavLink to="/d" className="btn btn-sm"
                    style={{ border: '1px solid #32bce4', backgroundColor: 'transparent', borderRadius: '6px',
                      fontWeight: 'bold', padding: '5px 12px', transition: 'all 0.3s ease'}}
                    onMouseOver={e => {
                      e.target.style.backgroundColor = '#32bce4'
                      e.target.style.color = '#fff'
                    }}
                    onMouseOut={e => {
                      e.target.style.backgroundColor = 'transparent'
                      e.target.style.color = '#32bce4'
                    }}
                  >
                    نمایش بیشتر
                  </NavLink>
              )}
              <div className='d-flex align-items-center me-2'>
                <span className='bullet me-50 cursor-pointer' style={{ backgroundColor: color }}></span>
                <span className='text-dark'>ظرفیت</span>
              </div>
            </div>
          </div>
          <Chart type='bar' height='230' options={options} series={series} />
        </Col>
      </Row>
    </Card>
  )
}

export default RevenueReport
