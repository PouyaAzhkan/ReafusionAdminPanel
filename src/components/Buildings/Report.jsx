import React from 'react';
import { Row, Col } from 'reactstrap';
import StatsHorizontal from '@components/widgets/stats/StatsHorizontal';
import { X, Check, Trello } from 'react-feather';
import { getAllBuildings } from './../../@core/Services/Api/Buildings/Buildings';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Report = () => {
  const { data, isLoading, isError, error } = getAllBuildings();

  // بررسی حالت‌های مختلف
  if (isError) {
    return <div>خطا در دریافت داده‌ها: {error?.message || "خطای ناشناخته"}</div>;
  } else if (!isLoading && (!data || !Array.isArray(data))) {
    return <div>داده‌ای برای نمایش وجود ندارد</div>;
  }

  // filter data
  const activeBuildings = data?.filter((building) => building.active === true) || [];
  const inactiveBuildings = data?.filter((building) => building.active === false) || [];

  const StatSkeleton = () => (
    <h3 className="fw-bolder mb-75">
      <Skeleton height={24} width={50} />
    </h3>
  );

  return (
    <Row>
      {/* کل ساختمان‌ها */}
      <Col lg="4" sm="6">
        <StatsHorizontal
          color="primary"
          statTitle="کل ساختمان ها"
          icon={<Trello size={20} />}
          renderStats={
            isLoading ? <StatSkeleton /> : (
              <h3 className="fw-bolder mb-75">{data.length}</h3>
            )
          }
        />
      </Col>

      {/* ساختمان‌های فعال */}
      <Col lg="4" sm="6">
        <StatsHorizontal
          color="success"
          statTitle="ساختمان های فعال"
          icon={<Check size={20} />}
          renderStats={
            isLoading ? <StatSkeleton /> : (
              <h3 className="fw-bolder mb-75">{activeBuildings.length}</h3>
            )
          }
        />
      </Col>

      {/* ساختمان‌های غیر فعال */}
      <Col lg="4" sm="6">
        <StatsHorizontal
          color="danger"
          statTitle="ساختمان های غیر فعال"
          icon={<X size={20} />}
          renderStats={
            isLoading ? <StatSkeleton /> : (
              <h3 className="fw-bolder mb-75">{inactiveBuildings.length}</h3>
            )
          }
        />
      </Col>
    </Row>
  );
};

export default Report;
