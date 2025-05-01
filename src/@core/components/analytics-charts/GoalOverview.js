// ** React Imports
import Chart from 'react-apexcharts';
import { HelpCircle } from 'react-feather';

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap';

const GoalOverview = ({topic, data1, data2, title2, title1, dataPersent}) => {
   
  const Persent = Math.round(parseFloat(dataPersent)) 
  
  const options = {
    chart: {
      sparkline: {
        enabled: false 
      },
      dropShadow: {
        enabled: true,
        blur: 3,
        left: 1,
        top: 1,
        opacity: 0.1,
      },
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: -135,
        endAngle: 135,
        hollow: {
          size: '70%',
        },
        track: {
          background: '#e7e7e7',
          strokeWidth: '77%',
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: '2.5rem',
            fontWeight: '600',
            color: '#5e5873',
            fontFamily: 'Montserrat',
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: ['#00cfe8'], // رنگ پایان (آبی)
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100],
      },
    },
    colors: ['#7367F0'], // رنگ شروع (بنفش)
    stroke: {
      lineCap: 'round',
    },
    labels: ['Progress'],
  };
  

  const series = [Persent];

  return (
    <Card >
      <CardHeader>
        <CardTitle tag="h4">{topic}</CardTitle>
      </CardHeader>
      <CardBody style={{ height: '245px' }}>
        <Chart options={options} series={series} type="radialBar" height={245} />
      </CardBody>
      <Row className="border-top text-center mx-0">
        <Col xs="6" className="border-end py-1">
          <CardText className="mb-0" style={{ color: '#5e5873' }}>{title1}</CardText>
          <h3 className="fw-bolder mb-0"  style={{ color: '#7368f0' }}>{data1}</h3>
        </Col>
        <Col xs="6" className="py-1">
          <CardText className="mb-0" style={{ color: '#5e5873' }}>{title2}</CardText>
          <h3 className="fw-bolder mb-0" style={{ color: '#7368f0' }}>{data2}</h3>
        </Col>
      </Row>
    </Card>
  );
};

export default GoalOverview;