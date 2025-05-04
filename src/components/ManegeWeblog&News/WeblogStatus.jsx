import { Fragment, useState } from "react";
import {Card, CardBody,CardHeader, CardText, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import { Heart, User, Users, Eye, MessageCircle } from "react-feather";
import GoalOverview from "../../@core/components/analytics-charts/GoalOverview";
import StatsHorizontal from "../../@core/components/statistics-card/StatsHorizontal";
import WeblogExplane from "./WeblogExplane";
import Api from "../../@core/Services/interceptor";
import DataTablesReOrder from "../../view/tableBasic/TableColumnReorder";

const WeblogStatus = ({ Api1, CommentData }) => {
  // مدیریت تب‌ها
  const [active, setActive] = useState("1");
  const toggleTab = (tab) => setActive(tab);
  // داده‌های استاتیک
  const detail = {
    newsDetails: {
      currentView: Api1?.currentView,
      commentsCount: Api1?.commentsCount,
      inUsersFavoriteCount: Api1?.inUsersFavoriteCount,
      currentLikeCount: 25,
      currentDissLikeCount: 4,
    },
    newsComments: [
      { id: "1", text: "کامنت اول خیلی خوب بود!" },
      { id: "2", text: "منم موافقم!" },
    ],
  };
  const StatsItems = [
    {
      label: "تعداد بازدید ها",
      icon: Eye,
      value: detail.newsDetails.currentView,
    },
    {
      label: "تعداد کامنت ها",
      icon: MessageCircle,
      value: detail.newsDetails.commentsCount,
    },
    {
      label: "تعداد دفعات ذخیره شدن",
      icon: Heart,
      value: detail.newsDetails.inUsersFavoriteCount,
    },
  ];

  return (
    <Fragment>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
            <User className="font-medium-3 me-50" />
            <span className="fw-bold">جزئیات</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
            <Users className="font-medium-3 me-50" />
            <span className="fw-bold">کامنت ها</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <Row>
            <Col sm={5}>
              {StatsItems.map((item, index) => (
                <StatsHorizontal
                  key={index}
                  className="mb-2"
                  color="primary"
                  statTitle={item.label}
                  icon={<item.icon size={20} />}
                  renderStats={<h3 className="fw-bolder">{item.value}</h3>}
                />
              ))}
            </Col>
            <Col sm={7}>
              <GoalOverview
                topic={"درصد محبوبیت بین کاربران"}
                title1={"تعداد لایک"}
                data1={Api1?.currentLikeCount}
                title2={"تعداد دیس لایک"}
                data2={Api1?.currentDissLikeCount}
                dataPersent={(((Api1?.currentLikeCount || 0) / ((Api1?.currentLikeCount || 0) + (Api1?.currentDissLikeCount || 0))) * 100).toFixed(2)}
              />
            </Col>
            <Col sm={12}>
              <Card>
                <CardHeader>
                  <div className="divider divider-start">
                    <div className="divider-text fs-2">توضیحات</div>
                  </div>
                </CardHeader>
                <CardBody>
                      <WeblogExplane Api1={Api1}/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane tabId="2">
          <div className="divider divider-start">
              <div className="d-flex align-items-center">
                <div className="divider-text fs-2 me-1 text-primary">کامنت ها</div>
                <div className="flex-grow-1" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}></div>
              </div>
              <DataTablesReOrder CommentData={CommentData}/>
          </div>
          {/* <CommentTab /> */}
        </TabPane>
      </TabContent>
    </Fragment>
  );
};

export default WeblogStatus;