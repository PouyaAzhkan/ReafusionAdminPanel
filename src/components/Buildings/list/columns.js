import { Archive, FileText, MoreVertical, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import emptyUserImg from "../../../assets/images/emptyImage/userImage.jpg";
import { usefetchBuildingsAddress } from "../../../@core/Services/Api/Buildings/Buildings";
import { useEffect, useState, useRef } from "react";

// استایل برای نمایش آدرس
const addressStyle = {
  whiteSpace: "normal",
  wordBreak: "break-word",
  lineHeight: "1.5", // فاصله خطوط برای خوانایی بهتر
  fontSize: "14px", // اندازه فونت مشابه تصویر
};

const renderRole = (row) => {
  return (
    <div className="text-capitalize text-truncate">
      {row.userRoles || "بدون نقش"}
    </div>
  );
};

export const columns = () => [
  {
    name: "آیدی",
    sortable: true,
    width: "100px",
    sortField: "id",
    selector: (row) => row.id,
    cell: (row) => <span className="fw-bolder">{row.id || "ندارد"}</span>,
  },
  {
    name: "نام ساختمان",
    sortable: true,
    width: "220px",
    sortField: "fname",
    selector: (row) => row.buildingName,
    cell: (row) => (
      <Link
        to={`/users/view/${row.id}`}
        className="user_name text-truncate text-body"
      >
        <span className="fw-bolder">{row.buildingName || "بدون نام"}</span>
      </Link>
    ),
  },
  {
    name: "تایم کاری",
    width: "250px",
    sortable: true,
    sortField: "workDate",
    selector: (row) => row.workDate,
    cell: (row) => (
      <span className="text-capitalize">
        {row.workDate?.replace("T", " ساعت ").replace(/-/g, "/") || "—"}
      </span>
    ),
  },
  {
    name: "طبقه",
    width: "90px",
    sortable: true,
    sortField: "floor",
    selector: (row) => row.floor,
    cell: (row) => <span>{row.floor || "—"}</span>,
  },
  {
    name: "وضعیت",
    width: "100px",
    sortable: true,
    sortField: "active",
    selector: (row) => row.active,
    cell: (row) => (
      <Badge color={row.active ? "light-success" : "light-danger"} pill>
        {row.active ? "فعال" : "غیرفعال"}
      </Badge>
    ),
  },
  {
    name: "آدرس",
    sortable: false,
    width: "350px", // افزایش عرض ستون برای نمایش بهتر آدرس
    cell: (row) => {
      const [address, setAddress] = useState("در حال بارگذاری...");
      const [isLoading, setIsLoading] = useState(true);
      const abortControllerRef = useRef(null);

      useEffect(() => {
        abortControllerRef.current = new AbortController();

        if (row.latitude && row.longitude) {
          usefetchBuildingsAddress(
            row.latitude,
            row.longitude,
            abortControllerRef.current.signal
          )
            .then((result) => {
              setAddress(result);
              setIsLoading(false);
            })
            .catch((error) => {
              if (error.name === "AbortError") {
                console.log("درخواست لغو شد");
              } else {
                console.error("خطا در دریافت آدرس:", error);
                setAddress("خطا در دریافت آدرس");
                setIsLoading(false);
              }
            });
        } else {
          setAddress("مختصات نامعتبر");
          setIsLoading(false);
        }

        return () => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        };
      }, [row.latitude, row.longitude]);

      return (
        <span className="text-truncate" style={addressStyle}>
          {isLoading ? "در حال بارگذاری..." : address}
        </span>
      );
    },
  },
  {
    name: "عملیات",
    width: "100px",
    cell: (row) => (
      <div className="column-action">
        <UncontrolledDropdown className="dropend">
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag="span"
              className="w-100"
              onClick={(e) => e.preventDefault()}
            >
              <Link to={`/users/view/${row.id}`}>
                <Archive size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
