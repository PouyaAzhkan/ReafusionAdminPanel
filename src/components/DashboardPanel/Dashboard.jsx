import React from "react";
import CardCongratulations from "../../@core/components/Card-Congratulations/CardCongratulations";
import Earnings from "../../@core/components/analytics-charts/Earnings";
import StatusCard from "../../@core/components/statusCard/StatusCard";
import GoalOverview from "../../@core/components/analytics-charts/GoalOverview";
import { Col, Row } from "reactstrap";
import SiteTraffic from "../../@core/components/statistics-card/SiteTraffic";
import { GetDashboardReport } from "../../@core/Services/Api/DashboardPanel/GetDashboardReport";
import Sales from "../../@core/components/analytics-charts/Sales";
import { GetUserList } from "../../@core/Services/Api/DashboardPanel/GetUserList";
import { Home, Package, Users } from "react-feather";
import { GetBiuldingCount } from "../../@core/Services/Api/DashboardPanel/GetBuildingCount";
import RevenueReport from "../../@core/components/analytics-charts/RevenueReport";
const Dashboard = () => {

  const { data: DashBoardReport, isLoading: DashBoardReportLoading, error: DashBoardReportError } = GetDashboardReport();
  const { data: UserList, isLoading: UserListLoading, error:UserListError } = GetUserList();
  const { data: BiuldingCount, isLoading: BiuldingCountLoading, error: BiuldingCountErorr} = GetBiuldingCount();
  if (DashBoardReportLoading || UserListLoading || BiuldingCountLoading) return  <p>درحال آمدن اطلاعات</p>
  if (DashBoardReportError || UserListError || BiuldingCountErorr) return  <p>خطا در آمدن اطلاعات</p>

  return (
    <div className="py-2">
      <div className="d-flex flex-column flex-md-row justify-content-md-between gap-2">
        <div className="w-100 w-md-auto" style={{ maxWidth: "35%" }}>
          <CardCongratulations Api={DashBoardReport} />
          <Earnings Api={DashBoardReport}/>
        </div>
        <div className="w-100 w-md-auto" style={{ maxWidth: "64%" }}>
          <div className="d-flex flex-wrap gap-1 justify-content-between">
            <StatusCard Api={DashBoardReport}/>
          </div>
        </div>
      </div>
      <div className="mt-1 d-flex justify-content-between flex-wrap">
         <Col lg='4' sm='12' style={{ maxWidth: "32%" }}>
          <GoalOverview 
              topic={"درصد پروفایل تکمیل شده"}
              title1="تکمیل شده"
              data1={DashBoardReport.allUser - DashBoardReport.inCompeletUserCount} 
              title2="تکمیل نشده"
              dataPersent={((DashBoardReport.allUser - DashBoardReport.inCompeletUserCount) / DashBoardReport.allUser) * 100}
              data2={DashBoardReport.inCompeletUserCount} 
          />
         </Col>
         <Col lg='4' sm='12' style={{ maxWidth: "32%" }}>
          <GoalOverview 
              title1="رزرو شده"
              data1={DashBoardReport.allReserveAccept} 
              title2="رزرو نشده"
              dataPersent={DashBoardReport.reserveAcceptPercent}
              data2={DashBoardReport.allReserveNotAccept} 
              topic={"درصد کورس های رزرو شده"}
          />
         </Col>
         <Col lg='4' sm='12' style={{ maxWidth: "32%" }}>
          <Sales />
         </Col>
      </div>
      <div className="d-flex justify-content-between ">
        <Col lg='4' sm='6' style={{ width: "32%" }}>
          <SiteTraffic 
              stats={UserList.listUser.length} 
              statTitle="تعداد نقش ها" 
              icon={<Users size={20} />}
              color='primary'
          />
        </Col>
        <Col lg='4' sm='6' style={{ width: "32%" }}>
          <SiteTraffic  
              icon={<Package size={20} />}
              color='success'
          />
        </Col>
        <Col lg='4' sm='6' style={{ width: "32%" }}>
          <SiteTraffic 
              stats={BiuldingCount.length} 
              statTitle="تعداد ساختمان ها" 
              icon={<Home size={20} />}
              color='info'
          />
        </Col>
      </div>
      <div className="d-flex justify-content-between mt-3">
            <RevenueReport />
      </div>
    </div>
  );
};

export default Dashboard;
