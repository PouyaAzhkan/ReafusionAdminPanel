import { Fragment, useState, useEffect, useMemo } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Input,
  Label,
  Button,
  Badge,
} from "reactstrap";
import { Check, X, Link } from "react-feather";
import telegramIcon from "../../../assets/images/logo/telegram.png";
import linkdinIcon from "../../../assets/images/logo/linkdin.png";
import moment from "jalali-moment";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const UserOtherInfo = ({ userData }) => {
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

  useEffect(() => {
    console.log("UserOtherInfo - insertDate:", userData?.insertDate);
    console.log("UserOtherInfo - birthDay:", userData?.birthDay);
    if (userData?.latitude && userData?.longitude) {
      const map = L.map("map").setView(
        [userData.latitude, userData.longitude],
        13
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([userData.latitude, userData.longitude])
        .addTo(map)
        .bindPopup("موقعیت کاربر")
        .openPopup();

      return () => {
        map.remove();
      };
    }
  }, [userData?.latitude, userData?.longitude]);

  // تابع بهبودیافته برای فرمت تاریخ
  const formatJalaliDate = (date, fieldName) => {
    if (date && moment(date).isValid()) {
      try {
        const momentDate = moment(date);
        const year = momentDate.year();
        // فیلتر کردن سال‌های غیرمنطقی
        if (year < 1000 || year > 9999) {
          console.warn(
            `Invalid year ${year} detected for ${fieldName}: ${date}`
          );
          return "نامعتبر";
        }
        return momentDate.locale("fa").format("YYYY/MM/DD");
      } catch (error) {
        console.error(
          `Error formatting ${fieldName}: ${error.message}, Date: ${date}`
        );
        return "نامعتبر";
      }
    }
    return "نامشخص";
  };

  return (
    <Fragment>
      <Card>
        <CardBody>
          <CardTitle className="fw-bolder">سایر اطلاعات</CardTitle>
          <div className="d-flex mt-2">
            <ul className="list-unstyled me-5">
              <li className="mb-75">
                <span className="fw-bolder me-25">شناسه:</span>
                <span>{userData?.id || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">نام:</span>
                <span>{userData?.fName || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">نام خانوادگی:</span>
                <span>{userData?.lName || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">نام کاربری:</span>
                <span>{userData?.userName || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">ایمیل:</span>
                <span>{userData?.gmail || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">ایمیل بازیابی:</span>
                <span>{userData?.recoveryEmail || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">شماره موبایل:</span>
                <span>{userData?.phoneNumber || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">وضعیت:</span>
                <Badge color={userData?.active ? "success" : "secondary"}>
                  {userData?.active ? "فعال" : "غیرفعال"}
                </Badge>
              </li>
            </ul>

            <ul className="list-unstyled ms-5">
              <li className="mb-75">
                <span className="fw-bolder me-25">ورود دو مرحله ای:</span>
                <Badge color={userData?.twoStepAuth ? "success" : "danger"}>
                  {userData?.twoStepAuth ? "دارد" : "ندارد"}
                </Badge>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">درباره کاربر:</span>
                <span>{userData?.userAbout || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">آدرس:</span>
                <span>{userData?.homeAdderess || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">کدملی:</span>
                <span>{userData?.nationalCode || "نامشخص"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">جنسیت:</span>
                <span>{userData?.gender ? "مرد" : "زن"}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">تاریخ تولد:</span>
                <span>{formatJalaliDate(userData?.birthDay, "birthDay")}</span>
              </li>
              <li className="mb-75">
                <span className="fw-bolder me-25">تاریخ ثبت نام:</span>
                <span>
                  {formatJalaliDate(userData?.insertDate, "insertDate")}
                </span>
              </li>
            </ul>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <CardTitle className="mb-75 fw-bolder">موقعیت مکانی</CardTitle>
          <div>
            <p>
              عرض جغرافیایی: {userData?.latitude || "نامشخص"} | طول جغرافیایی:{" "}
              {userData?.longitude || "نامشخص"}
            </p>
            <div
              id="map"
              style={{ height: "400px", width: "100%", zIndex: "1" }}
            ></div>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <CardTitle className="mb-75 fw-bolder">شبکه‌های اجتماعی</CardTitle>
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
