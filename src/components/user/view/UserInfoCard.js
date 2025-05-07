import { useState, useEffect, Fragment } from "react"; // اضافه کردن useEffect
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Avatar from "@components/avatar";
import { Check, Loader } from "react-feather";
import { changeUserActivity } from "../../../@core/Services/Api/UserManage/user";
import EditUserInfo from "./EditUserInfo";

const MySwal = withReactContent(Swal);

const UserInfoCard = ({ selectedUser }) => {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(selectedUser); // state برای مدیریت کاربر
  const { mutate: mutateActivity } = changeUserActivity();

  // به‌روزرسانی userData وقتی selectedUser تغییر کند
  useEffect(() => {
    setUserData(selectedUser);
  }, [selectedUser]);

  // تابع برای به‌روزرسانی اطلاعات کاربر پس از ویرایش
  const handleUserUpdated = (updatedUser) => {
    setUserData((prevUser) => ({
      ...prevUser,
      ...updatedUser,
    }));
  };

  const renderUserImg = () => {
    if (userData !== null && userData.currentPictureAddress?.length) {
      return (
        <img
          height="110"
          width="110"
          alt=""
          src={userData.currentPictureAddress}
          className="img-fluid rounded mt-3 mb-2"
        />
      );
    } else {
      return (
        <Avatar
          initials
          className="rounded mt-3 mb-2"
          content={userData?.fName + " " + userData?.lName || "بدون نام"}
          contentStyles={{
            borderRadius: 0,
            fontSize: "calc(48px)",
            width: "100%",
            height: "100%",
          }}
          style={{
            height: "110px",
            width: "110px",
          }}
        />
      );
    }
  };

  const handleSuspendedClick = (userId) => {
    return MySwal.fire({
      title: "از تغییر وضعیت کاربر مطمئن هستید؟",
      text: "این عملیات وضعیت کاربر را فعال / غیر فعال می‌کند",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "تغییر وضعیت",
      cancelButtonText: "انصراف",
      customClass: {
        confirmButton: "btn btn-primary",
        cancelButton: "btn btn-outline-danger ms-1",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        mutateActivity(
          { userId },
          {
            onSuccess: () => {
              MySwal.fire({
                icon: "success",
                title: "عملیات با موفقیت انجام شد",
                text: "وضعیت کاربر به فعال / غیرفعال تغییر کرد",
                customClass: { confirmButton: "btn btn-success" },
              });
              // به‌روزرسانی وضعیت کاربر در state
              setUserData((prevUser) => ({
                ...prevUser,
                active: !prevUser.active, // تغییر وضعیت
              }));
            },
            onError: (error) => {
              MySwal.fire({
                icon: "error",
                title: "خطا در تغییر وضعیت",
                text: error.message || "خطایی رخ داد.",
                customClass: { confirmButton: "btn btn-danger" },
              });
            },
          }
        );
      } else {
        MySwal.fire({
          title: "انصراف",
          text: "تغییر وضعیت لغو شد.",
          icon: "info",
          customClass: { confirmButton: "btn btn-info" },
        });
      }
    });
  };

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="user-avatar-section">
            <div className="d-flex align-items-center flex-column">
              {renderUserImg()}
              <div className="d-flex flex-column align-items-center text-center">
                <div className="user-info">
                  <h4>
                    {userData?.fName && userData?.lName
                      ? `${userData.fName} ${userData.lName}`
                      : "بدون نام"}
                  </h4>
                  {userData?.roles?.map((role, index) => (
                    <Badge
                      key={index}
                      color="light-warning"
                      className="text-capitalize me-50 mb-1"
                    >
                      {role.roleName}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-around my-2 pt-75">
            <div className="d-flex align-items-start me-2">
              <Badge color="light-primary" className="rounded p-75">
                <Check className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">{userData?.courses?.length || 0}</h4>
                <small>دوره‌های تأیید شده</small>
              </div>
            </div>
            <div className="d-flex align-items-start">
              <Badge color="light-primary" className="rounded p-75">
                <Loader className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">
                  {userData?.coursesReseves?.length || 0}
                </h4>
                <small>دوره‌های رزرو شده</small>
              </div>
            </div>
          </div>
          <h4 className="fw-bolder border-bottom pb-50 mb-1">مشخصات</h4>
          <div className="info-container">
            {userData ? (
              <ul className="list-unstyled">
                <li className="mb-75">
                  <span className="fw-bolder me-25">نام کاربری:</span>
                  <span>{userData.userName}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">ایمیل:</span>
                  <span>{userData.gmail}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">وضعیت:</span>
                  <Badge
                    className="text-capitalize"
                    color={userData.active ? "success" : "secondary"}
                  >
                    {userData.active ? "فعال" : "غیرفعال"}
                  </Badge>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">نقش‌ها:</span>
                  <span className="text-capitalize">
                    {userData.roles?.map((role, index) => (
                      <span key={index}>
                        {role.roleName}
                        {index < userData.roles.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">کد ملی:</span>
                  <span>{userData.nationalCode}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">تاریخ تولد:</span>
                  <span>{userData.birthDay?.split("T")[0]}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">شماره موبایل:</span>
                  <span>{userData.phoneNumber}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">آدرس:</span>
                  <span>{userData.homeAdderess}</span>
                </li>
              </ul>
            ) : null}
          </div>
          <div className="d-flex justify-content-center pt-2">
            <Button color="primary" onClick={() => setShow(true)}>
              ویرایش
            </Button>
            <Button
              className="ms-1"
              color="warning"
              outline
              onClick={() => handleSuspendedClick(userData.id)}
            >
              تغییر وضعیت کاربر
            </Button>
          </div>
        </CardBody>
      </Card>
      <EditUserInfo
        show={show}
        setShow={setShow}
        selectedUser={userData}
        onUserUpdated={handleUserUpdated}
      />
    </Fragment>
  );
};

export default UserInfoCard;
