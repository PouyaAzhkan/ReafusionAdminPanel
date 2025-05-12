import { Archive, CheckSquare, Edit, MoreVertical, XSquare } from "react-feather";
import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { usefetchBuildingsAddress } from "../../../@core/Services/Api/Buildings/Buildings";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

export const columns = ({
  changeBuildingStatus,
  refetch,
  setShowEditModal,
  setSelectedBuilding,
}) => [
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
    sortField: "buildingName",
    selector: (row) => row.buildingName,
    cell: (row) => (
      <span className="fw-bolder">{row.buildingName || "بدون نام"}</span>
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
    width: "350px",
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
        <span className="text-truncate">
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
          <DropdownMenu container="body">
            <DropdownItem
              tag="span"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                setSelectedBuilding(row); // تنظیم ساختمان انتخاب‌شده
                setShowEditModal(true); // باز کردن مودال
              }}
            >
              <Edit size={14} className="me-50" />
              <span className="align-middle">ویرایش</span>
            </DropdownItem>
            <DropdownItem
              tag="span"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                changeBuildingStatus(
                  { id: row.id, active: !row.active },
                  {
                    onSuccess: () => {
                      toast.success("وضعیت با موفقیت تغییر کرد");
                      refetch();
                    },
                    onError: (error) => {
                      toast.error("خطا در تغییر وضعیت");
                      console.error("خطا در تغییر وضعیت:", error);
                    },
                  }
                );
              }}
            >
              {row.active ? (
                <>
                  <XSquare size={14} className="me-50" />
                  <span className="align-middle">غیرفعال</span>
                </>
              ) : (
                <>
                  <CheckSquare size={14} className="me-50" />
                  <span className="align-middle">فعال</span>
                </>
              )}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
