import React from "react";
import '../../assets/scss/PanelResponsive/Dashboard.scss'
import CardCongratulations from "../../@core/components/Card-Congratulations/CardCongratulations";
import Earnings from "../../@core/components/analytics-charts/Earnings";
import StatusCard from "../../@core/components/statusCard/StatusCard";
import GoalOverview from "../../@core/components/analytics-charts/GoalOverview";
import { Col, Row } from "reactstrap";
import { GetDashboardReport } from "../../@core/Services/Api/DashboardPanel/GetDashboardReport";
import Sales from "../../@core/components/analytics-charts/Sales";
import { GetUserList } from "../../@core/Services/Api/DashboardPanel/GetUserList";
import { Home, Package, Users } from "react-feather";
import { GetBiuldingCount } from "../../@core/Services/Api/DashboardPanel/GetBuildingCount";
import RevenueReport from "../../@core/components/analytics-charts/RevenueReport";
import { GetCourseGroup } from "../../@core/Services/Api/DashboardPanel/GetCourseGroup";
import { GetClassRoomInfo } from "../../@core/Services/Api/DashboardPanel/GetClassRoomInfo";
import SiteTrafficChart from "../../@core/components/statistics-card/SiteTraffic";
const Dashboard = () => {

  const { data: DashBoardReport, isLoading: DashBoardReportLoading, error: DashBoardReportError } = GetDashboardReport();
  const { data: UserList, isLoading: UserListLoading, error:UserListError } = GetUserList();
  const { data: BiuldingCount, isLoading: BiuldingCountLoading, error: BiuldingCountErorr} = GetBiuldingCount();
  const { data: courseGroupData, isLoading: courseGroupLoading, error: courseGroupErorr } = GetCourseGroup()
  const { data: ClassRoomData, isLoading: ClassRoomLoading, error: ClassRoomErorr } = GetClassRoomInfo()
  if (DashBoardReportLoading || UserListLoading || BiuldingCountLoading || courseGroupLoading || ClassRoomLoading) return <p>درحال آمدن اطلاعات</p>
  if (DashBoardReportError || UserListError || BiuldingCountErorr || courseGroupErorr || ClassRoomErorr) return <p>خطا در آمدن اطلاعات</p>

  return (
    <div className="py-2">
      <div className="statusSite d-flex gap-1">
      <div className="aztiveUser">
        <div className="card-item">
            <CardCongratulations Api={DashBoardReport} />
          </div>
          <div className="card-item">
            <Earnings Api={DashBoardReport} />
          </div>
      </div>
      <div className="StatusCard">
          <div className="d-flex justify-content-around flex-wrap gap-1">
            <StatusCard Api={DashBoardReport}/>
          </div>
      </div>
      </div>
      <div className="dashboard-goals-section mt-1">
         <div className="goal-card">
          <GoalOverview 
              topic={"درصد پروفایل تکمیل شده"}
              title1="تکمیل شده"
              data1={DashBoardReport.allUser - DashBoardReport.inCompeletUserCount} 
              title2="تکمیل نشده"
              dataPersent={((DashBoardReport.allUser - DashBoardReport.inCompeletUserCount) / DashBoardReport.allUser) * 100}
              data2={DashBoardReport.inCompeletUserCount} 
          />
         </div>
         <div className="goal-card">
          <GoalOverview 
              title1="رزرو شده"
              data1={DashBoardReport.allReserveAccept} 
              title2="رزرو نشده"
              dataPersent={DashBoardReport.reserveAcceptPercent}
              data2={DashBoardReport.allReserveNotAccept} 
              topic={"درصد کورس های رزرو شده"}
          />
         </div>
         <div className="goal-card sales-card">
          <Sales />
         </div>
      </div>
      <div className="dashboard-site-traffic">
      <SiteTrafficChart 
        stats={UserList.listUser.length} 
        statTitle="تعداد نقش‌ها" 
        icon={<Users size={20} />}
        color="primary"
      />
      <SiteTrafficChart  
        icon={<Package size={20} />}
        color="success"
        statTitle="ایونت ها" // برای جلوگیری از خطا اضافه شده
      />
      <SiteTrafficChart 
        stats={BiuldingCount.length} 
        statTitle="تعداد ساختمان‌ها" 
        icon={<Home size={20} />}
        color="info"
      />
    </div>
      <div className="lastChart d-flex justify-content-between mt-3 gap-1">
            <RevenueReport
              title="نمودار گروه‌های دوره"
              apiData={courseGroupData?.courseGroupDtos}
              valueKey="groupCapacity"
              labelKey="groupName"
              color="#6459e2"
            />
            <RevenueReport
              title="نمودار 10 کلاس برتر"
              apiData={ClassRoomData.slice(0, 10)}
              valueKey="capacity"
              labelKey="classRoomName"
              color="#32bce4"
              hasMore={true}
            />
      </div>
    </div>
  );
};

export default Dashboard;
