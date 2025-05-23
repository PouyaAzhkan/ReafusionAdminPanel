import { useState, useEffect, Fragment } from "react";
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Avatar from "@components/avatar";
import { Percent } from "react-feather";
import { changeUserActivity } from "../../../@core/Services/Api/UserManage/user";
import moment from "jalali-moment";
import EditUserModal from "../list/EditUserModal";

const MySwal = withReactContent(Swal);

const UserInfoCard = ({ selectedUser, refetch }) => {
  const [editModal, setEditModal] = useState(false);
  const [userData, setUserData] = useState(selectedUser);
  const { mutate: mutateActivity } = changeUserActivity();

  // به‌روزرسانی userData وقتی selectedUser تغییر کند
  useEffect(() => {
    console.log("insertDate:", selectedUser?.insertDate); // دیباگ مقدار insertDate
    setUserData(selectedUser);
  }, [selectedUser]);

  // تابع برای به‌روزرسانی اطلاعات کاربر پس از ویرایش
  const handleEditModal = () => {
    setEditModal(!editModal);
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
        // به‌روزرسانی محلی برای تغییر فوری UI
        setUserData((prevUser) => ({
          ...prevUser,
          active: !prevUser.active,
        }));

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
              // دریافت داده‌های به‌روز از سرور
              if (refetch) {
                refetch();
              }
            },
            onError: (error) => {
              // در صورت خطا، وضعیت را به حالت قبلی برگردان
              setUserData((prevUser) => ({
                ...prevUser,
                active: !prevUser.active,
              }));
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

  // تابع برای فرمت تاریخ با اعتبارسنجی
  const formatJalaliDate = (date) => {
    if (date && moment(date).isValid()) {
      try {
        return moment(date).locale("fa").format("YYYY/MM/DD");
      } catch (error) {
        console.error("Error formatting date:", error.message);
        return "نامعتبر";
      }
    }
    return "نامشخص";
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
            <div className="d-flex align-items-start">
              <Badge color="light-primary" className="rounded p-75">
                <Percent className="font-medium-2" />
              </Badge>
              <div className="ms-75">
                <h4 className="mb-0">
                  {userData?.profileCompletionPercentage + "%" || 0}
                </h4>
                <small>درصد تکمیل پروفایل</small>
              </div>
            </div>
          </div>
          <h4 className="fw-bolder border-bottom pb-50 mb-1">مشخصات</h4>
          <div className="info-container">
            {userData ? (
              <ul className="list-unstyled">
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
                  <span className="fw-bolder me-25">جنسیت:</span>
                  <span>{userData.gender ? "مرد" : "زن"}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">تاریخ ثبت نام:</span>
                  <span>{formatJalaliDate(userData?.insertDate)}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">شماره موبایل:</span>
                  <span>{userData.phoneNumber || "نامشخص"}</span>
                </li>
                <li className="mb-75">
                  <span className="fw-bolder me-25">ایمیل:</span>
                  <span>{userData.gmail || "نامشخص"}</span>
                </li>
              </ul>
            ) : null}
          </div>
          <div className="d-flex justify-content-center pt-2">
            <Button color="primary" onClick={handleEditModal}>
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

      <EditUserModal
        editModal={editModal}
        setEditModal={setEditModal}
        userId={userData?.id}
        refetch={refetch}
      />
    </Fragment>
  );
};

export default UserInfoCard;