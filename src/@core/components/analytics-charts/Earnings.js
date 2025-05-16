import React, { useEffect, useRef } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardTitle, CardBody, Row, Col } from 'reactstrap';

const Earnings = ({ success, Api }) => {
  const activeUser = Math.round(parseFloat(Api.activeUserPercent)) || 0; // 95%
  const interActiveUser = Math.round(parseFloat(Api.interActiveUserPercent)) || 0; // 5%

  // Ref برای دسترسی به چارت
  const chartRef = useRef(null);

  const options = {
    chart: { toolbar: { show: false } },
    dataLabels: { enabled: false },
    legend: { show: false },
    labels: ['کاربران فعال', 'کاربران غیر فعال'],
    stroke: { width: 0 },
    colors: ['#695ceb', '#65c2fc', success],
    plotOptions: {
      pie: {
        startAngle: -10,
        donut: {
          labels: {
            show: true,
            name: { offsetY: 15 },
            value: {
              offsetY: -15,
              formatter(val) {
                return `${parseInt(val)} %`;
              },
            },
            total: {
              show: true,
              offsetY: 15,
              label: 'فعال',
              formatter() {
                return `${activeUser}%`;
              },
            },
          },
        },
      },
    },
    responsive: [
      { breakpoint: 1325, options: { chart: { height: 100 } } },
      { breakpoint: 1200, options: { chart: { height: 181 } } },
      { breakpoint: 1065, options: { chart: { height: 150 } } }
    ]
  };
  

  // مدیریت تغییر اندازه صفحه
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && window.ApexCharts) {
        // آپدیت چارت هنگام تغییر اندازه
        window.ApexCharts.exec('earningsChart', 'updateOptions', options, true);
      }
    };

    // اضافه کردن event listener برای resize
    window.addEventListener('resize', handleResize);

    // تمیز کردن event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [options]);

  return (
    <Card className="earnings-card w-100">
      <CardBody>
        <Row>
          <Col xs="6" md="6">
            <CardTitle className="mb-1 fs-3">درصد کاربران فعال در یک هفته اخیر</CardTitle>
          </Col>
          <Col xs="6" md="6" className="d-flex justify-content-center">
            <Chart
              options={options}
              series={[Math.abs(activeUser), Math.abs(interActiveUser)]}
              type="donut"
              height={175}
              className="earnings-chart"
              chartId="earningsChart"
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Earnings;