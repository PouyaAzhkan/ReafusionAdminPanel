import { Archive, Edit, FileText, MoreVertical, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import emptyUserImg from "../../../assets/images/emptyImage/userImage.jpg";
import moment from "jalali-moment";

const renderRole = (row) => {
  return (
    <div className="text-capitalize text-truncate">
      {row.userRoles || "بدون نقش"}
    </div>
  );
};

export const columns = (setDeleteModal, setUserToDelete) => [
  {
    name: "نام کاربر",
    sortable: true,
    width: "320px",
    sortField: "fname",
    selector: (row) => row.fname,
    cell: (row) => (
      <div className="d-flex">
        <img
          src={
            row.pictureAddress && row.pictureAddress !== "Not-set"
              ? row.pictureAddress.replace(/\\/g, "/")
              : emptyUserImg
          }
          className="rounded-circle me-2"
          width="30"
          height="30"
          alt=""
        />
        <div className="d-flex flex-column">
          <div className="d-flex align-items-center">
            <Link
              to={`/users/view/${row.id}`}
              className="user_name text-truncate text-body"
            >
              <span className="fw-bolder">
                {row.fname || "بدون نام"} {row.lname || "بدون نام خانوادگی"}
              </span>
            </Link>
          </div>
          <small className="text-truncate text-muted mb-0">
            {row.gmail || "ندارد"}
          </small>
        </div>
      </div>
    ),
  },
  {
    name: "نقش ها",
    sortable: true,
    width: "250px",
    sortField: "userRoles",
    selector: (row) => row.userRoles,
    cell: (row) => renderRole(row),
  },
  {
    name: "جنسیت",
    width: "100px",
    sortable: true,
    sortField: "gender",
    selector: (row) => row.gender,
    cell: (row) => <span>{row.gender === true ? "مرد" : "زن"}</span>,
  },
  {
    name: "تاریخ عضویت",
    width: "150px",
    sortable: true,
    sortField: "insertDate",
    selector: (row) => row.insertDate,
    cell: (row) => (
      <span className="text-capitalize">
        {moment(row.insertDate).locale("fa").format("YYYY/MM/DD")}
      </span>
    ),
  },
  {
    name: "تکمیل پروفایل",
    width: "130px",
    sortable: true,
    sortField: "profileCompletionPercentage",
    selector: (row) => row.profileCompletionPercentage,
    cell: (row) => <span>{row.profileCompletionPercentage + "%" || "—"}</span>,
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
              onClick={(e) => e.preventDefault()}
            >
              <Link to={`/users/view/${row.id}`}>
                <Edit size={14} className="me-50" />
                <span className="align-middle">ویرایش</span>
              </Link>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                setDeleteModal(true);
                setUserToDelete(row.id);
              }}
            >
              <Trash2 size={14} className="me-50" />
              <span className="align-middle">حذف</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
