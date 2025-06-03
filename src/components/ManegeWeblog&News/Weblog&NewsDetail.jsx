import React from 'react';
import '../../assets/scss/PanelStayle/ManageWeblogs.scss';
import '../../assets/scss/PanelResponsive/WeblogAndNewsList.scss';
import { Col } from 'reactstrap';
import InfoCard from './InfoCard';
import WeblogStatus from './WeblogStatus';
import { useParams } from 'react-router-dom';
import { GetDetailInfo } from '../../@core/Services/Api/Weblog&News/GetDetailInfo';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const WeblogAndNewsDetail = () => {
  const { id } = useParams();

  const { data, isLoading: DetailInfoLoading, error: DetailInfoError } = GetDetailInfo(id);

  // نمایش اسکلتون در حالت لودینگ
  if (DetailInfoLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="Detailcontainer d-flex justify-content-between gap-1">
          <Col className="detailCard" xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            {/* اسکلتون برای InfoCard */}
            <Skeleton
              height={600}
              width="100%"
              borderRadius={8}
              className="shadow-sm"
              style={{ marginBottom: '16px' }}
            />
          </Col>
          <Col className="weblogStatus">
            {/* اسکلتون برای WeblogStatus */}
            <Skeleton
              height={600}
              width="100%"
              borderRadius={8}
              className="shadow-sm"
              style={{ marginBottom: '16px' }}
            />
            {/* اسکلتون برای بخش نظرات */}
            <Skeleton
              height={100}
              width="100%"
              borderRadius={8}
              className="shadow-sm"
              count={3}
              style={{ marginBottom: '8px' }}
            />
          </Col>
        </div>
      </SkeletonTheme>
    );
  }

  if (DetailInfoError) return <p>خطا در بارگذاری اطلاعات: {DetailInfoError.message}</p>;

  console.log(data);

  return (
    <div className="Detailcontainer d-flex justify-content-between gap-1">
      <Col className="detailCard" xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
        <InfoCard Api1={data?.detailsNewsDto} id={id} />
      </Col>
      <Col className="weblogStatus">
        <WeblogStatus Api1={data?.detailsNewsDto} CommentData={data?.commentDtos} />
      </Col>
    </div>
  );
};

export default WeblogAndNewsDetail;