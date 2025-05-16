import {
  Archive,
  CheckSquare,
  Edit,
  MoreVertical,
  XSquare,
} from "react-feather";
import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import toast from "react-hot-toast";
import moment from "jalali-moment";

export const columns = ({ refetch, setShowEditModal, setSelectedBuilding }) => [
  {
    name: "آیدی",
    sortable: true,
    width: "100px",
    sortField: "id",
    selector: (row) => row.id,
    cell: (row) => <span className="fw-bolder">{row.id || "ندارد"}</span>,
  },
  {
    name: "نام ترم",
    sortable: true,
    width: "250px",
    sortField: "termName",
    selector: (row) => row.termName,
    cell: (row) => (
      <span className="fw-bolder text-truncate">
        {row.termName || "بدون نام"}
      </span>
    ),
  },
  {
    name: "تاریخ شروع و پایان",
    width: "300px",
    sortable: true,
    sortField: "workDate",
    selector: (row) => row.workDate,
    cell: (row) => (
      <span>
        {row.startDate && row.endDate
          ? `${moment(row.startDate).locale("fa").format("YYYY/MM/DD")}
               تا 
               ${moment(row.endDate).locale("fa").format("YYYY/MM/DD")}`
          : "—"}
      </span>
    ),
  },
  {
    name: "نام دپارتمان",
    width: "250px",
    sortable: true,
    sortField: "departmentName",
    selector: (row) => row.departmentName,
    cell: (row) => (
      <span className="text-truncate">{row.departmentName || "—"}</span>
    ),
  },
  {
    name: "وضعیت",
    width: "150px",
    sortable: true,
    sortField: "expire",
    selector: (row) => row.expire,
    cell: (row) => (
      <Badge color={row.expire ? "light-danger" : "light-success"} pill>
        {row.expire ? "منقضی شده" : "منقضی نشده"}
      </Badge>
    ),
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
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
