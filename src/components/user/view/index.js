// ** React Imports
import { useState } from "react";
import { useParams, Link } from "react-router-dom";

// ** Reactstrap Imports
import { Row, Col, Alert } from "reactstrap";

// ** User View Components
import UserTabs from "./Tabs";
import UserInfoCard from "./UserInfoCard";

// ** Custom Hook

// ** Styles
import "@styles/react/apps/app-users.scss";
import { useUserDetail } from "../../../@core/Services/Api/UserManage/user";

const UserView = () => {
  // ** Hooks
  const { id } = useParams();
  const { data, isLoading, isError, error } = useUserDetail(id);

  // ** State for Tabs
  const [active, setActive] = useState("1");

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  // ** Handle Loading State
  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  // ** Handle Error State
  if (isError) {
    return (
      <Alert color="danger">
        <h4 className="alert-heading">خطا در دریافت اطلاعات کاربر</h4>
        <div className="alert-body">
          {error.message || `کاربری با شناسه: ${id} یافت نشد.`} <br />
          بررسی لیست همه کاربران: <Link to="/users">لیست کاربران</Link>
        </div>
      </Alert>
    );
  }

  // ** Handle Success State
  const selectedUser = data; // فرض می‌کنیم پاسخ API در فیلد data قرار داره

  return selectedUser ? (
    <div className="app-user-view">
      <Row>
        <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard selectedUser={selectedUser} />
        </Col>
        <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTabs active={active} toggleTab={toggleTab} />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">کاربر یافت نشد</h4>
      <div className="alert-body">
        کاربری با شناسه: {id} وجود ندارد. بررسی لیست همه کاربران:{" "}
        {/* <Link to="/apps/user/list">لیست کاربران</Link> */}
      </div>
    </Alert>
  );
};

export default UserView;
