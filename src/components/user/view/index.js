import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Alert } from "reactstrap";
import UserTabs from "./Tabs";
import UserInfoCard from "./UserInfoCard";
import "@styles/react/apps/app-users.scss";
import { useUserDetail } from "../../../@core/Services/Api/UserManage/user";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UserView = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error, refetch } = useUserDetail(id);
  const [active, setActive] = useState("1");

  console.log("isLoading:", isLoading); // برای دیباگ

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };

  // ** Skeleton Loading Component
  const SkeletonLoading = () => (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="app-user-view p-4">
        <Row>
          <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
            <div className="bg-white rounded-lg shadow p-6">
              {/* Avatar Skeleton */}
              <div className="flex justify-center mb-4">
                <Skeleton circle={true} height={96} width={96} />
              </div>
              {/* User Info Fields */}
              <div className="space-y-4">
                <Skeleton height={16} width="75%" style={{ margin: "0 auto" }} />
                <Skeleton height={16} width="50%" style={{ margin: "0 auto" }} />
                <Skeleton height={16} width="66%" style={{ margin: "0 auto" }} />
              </div>
              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <Skeleton height={40} width="100%" />
                <Skeleton height={40} width="100%" />
              </div>
            </div>
          </Col>
          <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
            <div className="bg-white rounded-lg shadow p-6">
              {/* Tabs Navigation Skeleton */}
              <div className="flex space-x-4 mb-6">
                <Skeleton height={32} width={96} />
                <Skeleton height={32} width={96} />
                <Skeleton height={32} width={96} />
              </div>
              {/* Tab Content Skeleton */}
              <div className="space-y-4">
                <Skeleton height={24} width="100%" />
                <Skeleton height={24} width="83%" />
                <Skeleton height={24} width="66%" />
                <Skeleton height={24} width="50%" />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </SkeletonTheme>
  );

  // ** Handle Loading State
  if (isLoading) {
    return <SkeletonLoading />;
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
  const selectedUser = data;

  return selectedUser ? (
    <div className="app-user-view">
      <Row>
        <Col xl="4" lg="5" xs={{ order: 1 }} md={{ order: 0, size: 5 }}>
          <UserInfoCard selectedUser={selectedUser} refetch={refetch} />
        </Col>
        <Col xl="8" lg="7" xs={{ order: 0 }} md={{ order: 1, size: 7 }}>
          <UserTabs
            active={active}
            toggleTab={toggleTab}
            userCourses={selectedUser?.courses}
            reservedCourses={selectedUser?.coursesReseves}
            userData={selectedUser}
          />
        </Col>
      </Row>
    </div>
  ) : (
    <Alert color="danger">
      <h4 className="alert-heading">کاربر یافت نشد</h4>
      <div className="alert-body">
        کاربری با شناسه: {id} وجود ندارد. بررسی لیست همه کاربران:{" "}
        <Link to="/users">لیست کاربران</Link>
      </div>
    </Alert>
  );
};

export default UserView;