import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { Card, CardHeader, CardText } from 'reactstrap';
import Avatar from '@components/avatar';
import { lineChartOptions } from './ChartOptions';

const StatsWithLineChart = ({
  icon,
  color,
  stats,
  statTitle,
  series,
  options,
  cardHeight,
  CardWidth,
  type,
  height,
  headerFlexDirection,
  ...rest
}) => {
  return (
    <Card className="stats-card" style={{ width: CardWidth , height: cardHeight || '210px', margin: 0 }}>
      <CardHeader
        className="text-center"
        style={{
          display: 'flex',
          flexDirection: headerFlexDirection || 'column',
          gap: '50px',
          alignItems: 'center',
        }}
      >
        <Avatar className="avatar-stats m-0 p-50" color={`light-${color}`} icon={icon} />
        <div>
          <h2 className="fw-bolder">{stats}</h2>
          <CardText className="fs-5 font-bold">{statTitle}</CardText>
        </div>
      </CardHeader>
      <div style={{ minHeight: height || '60px' }}>
        <Chart options={options} series={series} type={type} height={height || '60'} />
      </div>
    </Card>
  );
};

StatsWithLineChart.propTypes = {
  type: PropTypes.string,
  height: PropTypes.string,
  options: PropTypes.object,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired,
  statTitle: PropTypes.string.isRequired,
  headerFlexDirection: PropTypes.string,
};

StatsWithLineChart.defaultProps = {
  options: lineChartOptions,
  color: 'primary',
  headerFlexDirection: 'column',
};

export default StatsWithLineChart;