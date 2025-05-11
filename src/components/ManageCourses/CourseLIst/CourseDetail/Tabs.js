import { Fragment, useContext, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";

import StatsHorizontal from "../../../../@core/components/widgets/stats/StatsHorizontal";
import { ThemeColors } from "../../../../utility/context/ThemeColors";
import { DetailsOfCourses, navItems } from "../../../../@core/constants/courses";
import HandleIdentityEditorJs from "../../../../utility/create-editorjs-blocks/IdentityEditorJs";
import GoalOverview from "../../../../@core/components/analytics-charts/GoalOverview";
import CourseCommment from "./tabs/CourseComment";
import CourseUsers from "./tabs/UsersCourses";
import CoursesGroups from "./tabs/GroupsCourses";
import Payments from "./tabs/payments";
import SocialGroups from "./tabs/SocialGroups";
import CourseAssistance from "./tabs/CourseAssistance";

const UserTabs = ({
  active,
  toggleTab,
  data,
  centeredModal,
  setCenteredModal,
  setUserSel,
  refetchChange,
  refetchGroup,
  groupData,
  gropId,
}) => {
  console.log('گروپ ای دی =>',gropId);
  const [stats, setStats] = useState([]);
  const { colors } = useContext(ThemeColors);

  useEffect(() => {
    if (data) {
      setStats(DetailsOfCourses(data));
    }
  }, [data]);

  return (
    <Fragment>
      <Nav pills className="mb-2">
        {navItems.map((items, index) => (
          <NavItem key={index}>
            <NavLink
              active={active === items.id}
              onClick={() => toggleTab(items.id)}
            >
              <items.icon className="font-medium-3 me-50" />
              <span className="fw-bold">{items.text}</span>
            </NavLink>
          </NavItem>
        ))}
      </Nav>

      <TabContent activeTab={active}>
        <TabPane tabId="1">
          {data && (
            <Row>
              <Col sm={5}>
                {stats.map((item, index) => (
                  <StatsHorizontal
                    key={index}
                    className="mb-2"
                    color={item.color}
                    statTitle={item.title}
                    icon={<item.icon size={20} />}
                    renderStats={
                      <h3 className="fw-bolder mb-75">{item.renderStats}</h3>
                    }
                  />
                ))}
              </Col>
              <Col sm={7}>
              <GoalOverview
                topic={"درصد پرداختی های دوره"}
                title1={"پرداخت شده"}
                data1={data?.paymentDoneTotal}
                title2={"پرداخت نشده"}
                data2={data?.paymentNotDoneTotal}
                dataPersent={(((data?.paymentDoneTotal || 0) / ((data?.paymentDoneTotal || 0) + (data?.paymentNotDoneTotal || 0))) * 100).toFixed(2)}
              />
            </Col>
              <Col sm={12}>
                <Card style={{ minHeight: "347px" }}>
                  <CardHeader>
                    <div className="divider-text fs-2">جزئیات</div>
                  </CardHeader>
                  <CardBody className="text-primary">
                         <div>{data.describe ? data.describe : "هیچ جزئیات یا توضیحاتی برای این دوره وجود ندارد"}</div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </TabPane>

        <TabPane tabId="2"><CourseCommment /></TabPane>
        <TabPane tabId="3">   
            <CourseUsers
              centeredModal={centeredModal}
              setCenteredModal={setCenteredModal}
              setUserSel={setUserSel}
              refetchChange={refetchChange}
            />
        </TabPane>
        <TabPane tabId="4"><CoursesGroups groupData={groupData} refetchGroup={refetchGroup} /></TabPane>
        <TabPane tabId="5"><Payments /></TabPane>
        <TabPane tabId="6"><SocialGroups /></TabPane>
        <TabPane tabId="7"><CourseAssistance id={data?.courseId} /> </TabPane>
      </TabContent>
    </Fragment>
  );
};

export default UserTabs;
