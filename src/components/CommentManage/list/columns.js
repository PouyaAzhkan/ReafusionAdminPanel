import { Archive, Eye, MoreVertical, Trash2 } from "react-feather";
import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";

import emptyUserImg from "../../../assets/images/emptyImage/userImage.jpg";

export const columns = (setDeleteModal, setCommentToDelete) => [
  {
    name: "نام کاربر",
    width: "200px",
    sortField: "userFullName",
    selector: (row) => row.userFullName,
    cell: (row) => (
      <div className="d-flex align-items-center">
        <img
          src={emptyUserImg}
          className="rounded-circle me-2"
          width="30"
          height="30"
          alt=""
        />
        <Link
          to={`/users/view/${row.userId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">
            {row.userFullName?.replace("-", " ") || "بدون نام"}
          </span>
        </Link>
      </div>
    ),
  },
  {
    name: "عنوان کامنت",
    width: "200px",
    sortField: "commentTitle",
    selector: (row) => row.commentTitle,
    cell: (row) => (
      <span className="text-truncate">{row.commentTitle || "—"}</span>
    ),
  },
  {
    name: "توضیحات کامنت",
    width: "300px",
    sortField: "describe",
    selector: (row) => row.describe,
    cell: (row) => <span className="text-truncate">{row.describe || "—"}</span>,
  },
  {
    name: "نام دوره",
    width: "200px",
    sortField: "courseTitle",
    selector: (row) => row.courseTitle,
    cell: (row) => (
      <span className="text-truncate">{row.courseTitle || "—"}</span>
    ),
  },
  {
    name: "وضعیت",
    width: "100px",
    sortField: "accept",
    selector: (row) => row.accept,
    cell: (row) => (
      <Badge color={row.accept ? "light-success" : "light-danger"} pill>
        {row.accept ? "تایید شده" : "تایید نشده"}
      </Badge>
    ),
  },
  {
    name: "پاسخ ها",
    width: "110px",
    sortField: "accept",
    selector: (row) => row.replyCommentId,
    cell: (row) => (
      <span className="light-secondary">
        {row.replyCommentId === null ? "-" : <Eye size={16} />}
      </span>
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
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                console.log(
                  "Selected commentId:",
                  row.commentId,
                  "Row data:",
                  row
                );
                if (row.commentId) {
                  setDeleteModal(true);
                  setCommentToDelete(row.commentId);
                } else {
                  console.error("Comment ID is missing or invalid");
                  alert("شناسه کامنت نامعتبر است");
                }
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
