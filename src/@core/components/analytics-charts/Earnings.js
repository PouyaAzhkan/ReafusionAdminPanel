import Chart from 'react-apexcharts'
import { Card, CardTitle, CardBody, Row, Col } from 'reactstrap'

const Earnings = ({ success, Api }) => {
  // اینجا دو تا عدد رو از Api میگیریم و فقط دو رقم اول رو نگه میداریم
  const activeUser = Math.round(parseFloat(Api.activeUserPercent)) // -95
  const interActiveUser = Math.round(parseFloat(Api.interActiveUserPercent)) // -5

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
                return `${parseInt(val)} %`
              }
            },
            total: {
              show: true,
              offsetY: 15,
              label: 'فعال',
              formatter() {
                return `${activeUser}%`
              }
            }
          }
        }
      }
    },
    responsive: [
      { breakpoint: 1325, options: { chart: { height: 100 } } },
      { breakpoint: 1200, options: { chart: { height: 120 } } },
      { breakpoint: 1065, options: { chart: { height: 100 } } }
    ]
  }

  return (
    <Card className='earnings-card w-100'>
      <CardBody>
        <Row>
          <Col xs='6'>
            <CardTitle className='mb-1 fs-3'>درصد کاربران فعال در یک هفته اخیر</CardTitle>
          </Col>
          <Col xs='6'>
            <Chart 
              options={options} 
              series={[Math.abs(activeUser), Math.abs(interActiveUser)]} // مقادیر چارت
              type='donut' 
              height={125} 
              width={200} 
            />
          </Col>
        </Row>
      </CardBody>
    </Card>
  )
}

export default Earnings
