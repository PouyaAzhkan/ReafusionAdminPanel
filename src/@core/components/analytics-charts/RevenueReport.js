// ** React Imports
import { useState, useEffect } from 'react'

// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Row, Col, Card, CardTitle } from 'reactstrap'
import { GetCourseGroup } from '../../Services/Api/DashboardPanel/GetCourseGroup'

const RevenueReport = () => {
  const { data, isLoading, error } = GetCourseGroup()
  if (isLoading) return <p>در حال دریافت اطلاعات...</p>
  if (error) return <p>خطا در دریافت اطلاعات</p>

  const categories = data.courseGroupDtos.map(group => group.groupName)
  const capacities = data.courseGroupDtos.map(group => group.groupCapacity)

  const revenueOptions = {
    chart: {
      stacked: true,
      type: 'bar',
      toolbar: { show: false }
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const groupName = categories[dataPointIndex]
        const value = series[seriesIndex][dataPointIndex]
        return `<div class="apex-tooltip text-center p-50">
                  <strong>${groupName}</strong><br/>
                  ظرفیت: ${value}
                </div>`
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
          fontSize: '0.86rem',
          textAlign: 'center'
        }
      },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    colors: ['#6459e2'],
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
  
  const revenueSeries = [
    {
      name: 'ظرفیت',
      data: capacities
    }
  ]

  return (
    <Card className='card-revenue-budget' style={{ width: '600px' }}>
      <Row>
        <Col className='revenue-report-wrapper' md='8' xs='12' style={{ width: '100%' }}>
          <div className='d-sm-flex justify-content-between align-items-center mb-1'>
            <CardTitle className='mb-50 mb-sm-0 p-1 text-dark'>نمودار گروه‌های دوره</CardTitle>
            <div className='d-flex align-items-center'>
              <div className='d-flex align-items-center me-2'>
                <span className='bullet bullet-primary me-50 cursor-pointer'></span>
                <span className='text-dark'>ظرفیت</span>
              </div>
            </div>
          </div>
          <Chart id='revenue-report-chart' type='bar' height='230' options={revenueOptions} series={revenueSeries} />
        </Col>
      </Row>
    </Card>
  )
}

export default RevenueReport
