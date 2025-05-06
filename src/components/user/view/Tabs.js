// ** React Imports
import { Fragment } from "react";

// ** Reactstrap Imports
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";

// ** Icons Imports
import { MessageSquare, Bookmark, User, Book } from "react-feather";

// ** User Components
import UserCourses from "./UserCourses";
import UserReservedCourses from "./UserReservedCourses";
import UserOtherInfo from "./UserOtherInfo";

const UserTabs = ({
  active,
  toggleTab,
  userData,
  userCourses,
  reservedCourses,
}) => {
  return (
    <Fragment>
      <Nav pills className="mb-2">
        <NavItem>
          <NavLink active={active === "1"} onClick={() => toggleTab("1")}>
            <Book className="font-medium-3 me-50" />
            <span className="fw-bold">دوره های تایید شده</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "2"} onClick={() => toggleTab("2")}>
            <Bookmark className="font-medium-3 me-50" />
            <span className="fw-bold">دوره های رزرو شده</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={active === "3"} onClick={() => toggleTab("3")}>
            <User className="font-medium-3 me-50" />
            <span className="fw-bold">سایر اطلاعات</span>
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <UserCourses userCourses={userCourses} />
        </TabPane>
        <TabPane tabId="2">
          <UserReservedCourses reservedCourses={reservedCourses} />
        </TabPane>
        <TabPane tabId="3">
          <UserOtherInfo userData={userData} />
        </TabPane>
      </TabContent>
    </Fragment>
  );
};
export default UserTabs;
