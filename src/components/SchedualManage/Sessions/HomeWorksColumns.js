import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { MoreVertical, UserCheck } from "react-feather";
import moment from "moment-jalaali";

// تنظیم moment-jalaali برای استفاده از تقویم شمسی
moment.loadPersian({ dialect: "persian-modern" });

// تابع برای فرمت تاریخ و ساعت به شمسی
const formatJalaaliDateTime = (dateString) => {
  if (!dateString) return "—";
  const date = moment(dateString);
  if (!date.isValid()) return "—";
  const datePart = date.format("jYYYY/jMM/jDD");
  const timePart = date.format("HH:mm:ss");
  return `${datePart} ساعت ${timePart}`;
};

export const columns = (setOpenAddStudentHomeWork) => [
  {
    name: "عنوان تکلیف",
    width: "200px",
    sortField: "hwTitle",
    selector: (row) => row.hwTitle,
    cell: (row) => <span className="text-truncate">{row.hwTitle || "—"}</span>,
  },
  {
    name: "توضیحات",
    width: "250px",
    sortField: "hwDescribe",
    selector: (row) => row.hwDescribe,
    cell: (row) => (
      <span className="text-truncate">{row.hwDescribe || "—"}</span>
    ),
  },
  {
    name: "تاریخ",
    width: "200px",
    sortable: true,
    sortField: "insertDate",
    selector: (row) => row.insertDate,
    cell: (row) => <span>{formatJalaaliDateTime(row?.insertDate)}</span>,
  },
  {
    name: "عملیات",
    width: "80px",
    cell: (row) => (
      <div className="column-action">
        <UncontrolledDropdown className="dropend" container="body">
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                setOpenAddStudentHomeWork({ open: true, hwid: row.id }); // ارسال hwid
              }}
            >
              <UserCheck size={14} className="me-50" />
              <span className="align-middle">تعیین برای دانشجو</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];