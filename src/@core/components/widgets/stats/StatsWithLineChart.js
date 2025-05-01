// ** Custom Components
import Avatar from "@components/avatar";

// ** Third Party Components
import PropTypes from "prop-types";
import Chart from "react-apexcharts";

// ** Reactstrap Imports
import { Card, CardHeader, CardText } from "reactstrap";

// ** Default Options
import { lineChartOptions } from "./ChartOptions";

const StatsWithLineChart = ({
  icon,
  color,
  stats,
  statTitle,
  series,
  options,
  cardHeight,
  type,
  height,
  cardWidth, 
  headerFlexDirection, 
  ...rest
}) => {
  return (
    <Card style={{ width: cardWidth || "140px", height: cardHeight || "210px", margin: 0 }}>
      <CardHeader
        className="text-center"
        style={{
          display: "flex",
          flexDirection: headerFlexDirection || "column", // جهت flex را از پراپس می‌گیرد
          gap: "50px",
          alignItems: "center",
        }}
      >
        <Avatar
          className="avatar-stats m-0 p-50"
          color={`light-${color}`}
          icon={icon}
        />
        <div>
          <h2 className="fw-bolder">{stats}</h2>
          <CardText className="fs-5 font-bold">{statTitle}</CardText>
        </div>
      </CardHeader>
      <div style={{ minHeight: height || "60px" }}>
        <Chart options={options} series={series} type={type} height={height || "60"} />
      </div>
    </Card>
  );
};

export default StatsWithLineChart;

// ** PropTypes
StatsWithLineChart.propTypes = {
  type: PropTypes.string,
  height: PropTypes.string,
  options: PropTypes.object,
  icon: PropTypes.element.isRequired,
  color: PropTypes.string.isRequired,
  stats: PropTypes.string.isRequired,
  series: PropTypes.array.isRequired,
  statTitle: PropTypes.string.isRequired,
  cardWidth: PropTypes.string, // پراپس جدید برای عرض
  headerFlexDirection: PropTypes.string, // پراپس جدید برای جهت flex
};

// ** Default Props
StatsWithLineChart.defaultProps = {
  options: lineChartOptions,
  color: "primary",
  cardWidth: "140px", // مقدار پیش‌فرض برای عرض
  headerFlexDirection: "column", // مقدار پیش‌فرض برای جهت flex
};