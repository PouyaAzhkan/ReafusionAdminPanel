import { Fragment, useState, useEffect } from "react";
import { Card, CardBody, CardTitle, Input, Label, Button } from "reactstrap";
import { Check, X, Link } from "react-feather";
import telegramIcon from "../../../assets/images/logo/telegram.png";
import linkdinIcon from "../../../assets/images/logo/linkdin.png";
import {
  addUserRole,
  GetUserList,
} from "../../../@core/Services/Api/UserManage/user";

// تابع برای ساخت userRoles به‌صورت پویا
const createUserRoles = (roles) => {
  if (!roles || !Array.isArray(roles)) return [];
  return roles.map((role) => ({
    id: role.id,
    title: role.roleName,
  }));
};

const UserOtherInfo = ({ userData }) => {
  // دریافت همه نقش‌ها از API
  const {
    data: allRoleData,
    isError: isAllRoleError,
    isLoading: isAllRoleLoading,
  } = GetUserList();

  // ساخت userRoles به‌صورت پویا از داده‌های API
  const userRoles = createUserRoles(allRoleData?.roles);

  // تنظیم وضعیت اولیه سوئیچ‌ها
  const [accountStates, setAccountStates] = useState([]);

  // به‌روزرسانی accountStates وقتی userRoles یا userData تغییر می‌کند
  useEffect(() => {
    if (userRoles.length > 0) {
      const newStates = userRoles.map((role) =>
        userData?.roles?.some((userRole) => userRole.roleName === role.title) ||
        false
      );
      setAccountStates(newStates);
    }
  }, [userRoles, userData?.roles]);

  // استفاده از useMutation برای فراخوانی addUserRole
  const { mutate, isLoading, isError, error } = addUserRole();

  // تابع برای مدیریت تغییر سوئیچ
  const handleSwitchChange = (index, roleId, roleTitle) => {
    const newStates = [...accountStates];
    newStates[index] = !newStates[index]; // تغییر وضعیت سوئیچ
    setAccountStates(newStates);

    // فراخوانی API برای اضافه یا حذف نقش
    mutate(
      {
        userId: userData?.id,
        roleId: roleId,
        Enable: newStates[index], // true برای اضافه کردن، false برای حذف
      },
      {
        onSuccess: (data) => {
          console.log(
            `نقش ${roleTitle} با موفقیت برای کاربر ${userData.id} ${
              newStates[index] ? "اضافه" : "حذف"
            } شد:`,
            data
          );
        },
        onError: (err) => {
          console.error(`خطا در تنظیم نقش ${roleTitle}:`, err);
          // در صورت خطا، وضعیت سوئیچ را به حالت قبلی برگردانید
          const rollbackStates = [...newStates];
          rollbackStates[index] = !rollbackStates[index];
          setAccountStates(rollbackStates);
        },
      }
    );
  };

  const telegramUrl = userData?.telegramLink;
  const linkedinUrl = userData?.linkdinProfile;

  const socialAccounts = [
    {
      linked: !!telegramUrl,
      title: "تلگرام",
      url: telegramUrl,
      logo: telegramIcon,
    },
    {
      linked: !!linkedinUrl,
      title: "لینکدین",
      url: linkedinUrl,
      logo: linkdinIcon,
    },
  ];

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle className="mb-75 fw-bolder">دسترسی‌ها</CardTitle>
          <p>
            در این بخش می‌تونید دسترسی‌های لازم را به{" "}
            <span className="text-primary">
              {userData.fName && userData.lName != null
                ? userData?.fName + " " + userData?.lName
                : "بدون نام و نام خانوادگی"}
            </span>{" "}
            بدهید.
          </p>
          {isAllRoleLoading ? (
            <p>در حال بارگذاری نقش‌ها...</p>
          ) : isAllRoleError ? (
            <p className="text-danger">خطا در بارگذاری نقش‌ها</p>
          ) : userRoles.length === 0 ? (
            <p>هیچ نقشی یافت نشد</p>
          ) : (
            userRoles.map((item, index) => (
              <div key={index} className="d-flex mt-2">
                <div className="d-flex align-items-center justify-content-between flex-grow-1">
                  <div className="me-1">
                    <p className="mb-0">{item.title}</p>
                  </div>
                  <div className="mt-50 mt-sm-0">
                    <div className="form-switch">
                      <Input
                        type="switch"
                        checked={accountStates[index] || false}
                        id={`account-${item.title}`}
                        onChange={() =>
                          handleSwitchChange(index, item.id, item.title)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        className="form-check-label"
                        htmlFor={`account-${item.title}`}
                      >
                        <span className="switch-icon-left">
                          <Check size={14} />
                        </span>
                        <span className="switch-icon-right">
                          <X size={14} />
                        </span>
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isError && (
            <p className="text-danger mt-1">
              خطا در تنظیم دسترسی: {error.message || "لطفاً دوباره تلاش کنید"}
            </p>
          )}
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <CardTitle className="mb-75 fw-bolder">شبکه های اجتماعی</CardTitle>
          {socialAccounts.map((item, index) => (
            <div key={index} className="d-flex mt-2">
              <div className="flex-shrink-0">
                <img
                  className="me-1"
                  src={item.logo}
                  alt={item.title}
                  height="38"
                  width="38"
                />
              </div>
              <div className="d-flex align-items-center justify-content-between flex-grow-1">
                <div className="me-1">
                  <p className="fw-bolder mb-0">{item.title}</p>
                  {item.linked && item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.url}
                    </a>
                  ) : (
                    <span>شبکه اجتماعی موجود نیست</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default UserOtherInfo;