import { Fragment, useState, useEffect, useMemo } from "react";
import { Card, CardBody, CardTitle, Input, Label, Button } from "reactstrap";
import { Check, X } from "react-feather";
import telegramIcon from "../../../assets/images/logo/telegram.png";
import linkdinIcon from "../../../assets/images/logo/linkdin.png";
import { toast } from "react-hot-toast";
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

const UserRoleAccess = ({ userData }) => {
  // دریافت همه نقش‌ها از API
  const {
    data: allRoleData,
    isError: isAllRoleError,
    isLoading: isAllRoleLoading,
  } = GetUserList();

  // ساخت userRoles به‌صورت پایدار با useMemo
  const userRoles = useMemo(
    () => createUserRoles(allRoleData?.roles),
    [allRoleData?.roles]
  );

  // تنظیم وضعیت اولیه سوئیچ‌ها
  const [accountStates, setAccountStates] = useState([]);

  // به‌روزرسانی accountStates وقتی userRoles یا userData تغییر می‌کند
  useEffect(() => {
    if (userRoles.length > 0) {
      const newStates = userRoles.map(
        (role) =>
          userData?.roles?.some(
            (userRole) => userRole.roleName === role.title
          ) || false
      );
      setAccountStates((prevStates) => {
        // فقط اگر newStates با prevStates متفاوت باشد، به‌روزرسانی کن
        if (JSON.stringify(prevStates) !== JSON.stringify(newStates)) {
          return newStates;
        }
        return prevStates;
      });
    }
  }, [userRoles, userData?.roles]);

  // استفاده از useMutation برای فراخوانی addUserRole
  const { mutate, isLoading, isError, error } = addUserRole();

  // مدیریت toast برای وضعیت‌های مختلف
  useEffect(() => {
    if (isAllRoleLoading) {
      toast.loading("در حال بارگذاری نقش‌ها", { id: "role-loading" });
    } else {
      toast.dismiss("role-loading");
    }

    if (isAllRoleError) {
      toast.error("خطا در بارگذاری نقش‌ها", { id: "role-error" });
    }

    if (!isAllRoleLoading && !isAllRoleError && userRoles.length === 0) {
      toast.error("هیچ نقشی یافت نشد", { id: "no-roles" });
    }

    if (isError) {
      const errorMessage = error?.response?.data?.ErrorMessage?.[0] || "خطای ناشناخته در تنظیم دسترسی";
      toast.error(errorMessage, { id: "mutation-error" });
    }
  }, [isAllRoleLoading, isAllRoleError, userRoles.length, isError, error]);

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
        onSuccess: () => {
          toast.success(
            `نقش ${roleTitle} با موفقیت برای کاربر ${
              newStates[index] ? "اضافه" : "حذف"
            } شد`
          );
        },
        onError: (err) => {
          const errorMessage = err?.response?.data?.ErrorMessage?.[0] || `خطا در تنظیم نقش ${roleTitle}`;
          toast.error(errorMessage);
          // در صورت خطا، وضعیت سوئیچ را به حالت قبلی برگردان
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
          <CardTitle className="mb-75 fw-bolder">دسترسی نقش‌ها</CardTitle>
          <p>
            در این بخش می‌توانید دسترسی‌های نقش‌ها را به{" "}
            <span className="text-primary">
              {userData?.fName && userData?.lName
                ? `${userData.fName} ${userData.lName}`
                : "بدون نام و نام خانوادگی"}
            </span>{" "}
            بدهید.
          </p>
          {userRoles.length > 0 ? (
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
                        id={`account-${item.id}`}
                        onChange={() =>
                          handleSwitchChange(index, item.id, item.title)
                        }
                        disabled={isLoading}
                      />
                      <Label
                        className="form-check-label"
                        htmlFor={`account-${item.id}`}
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
          ) : null}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default UserRoleAccess;