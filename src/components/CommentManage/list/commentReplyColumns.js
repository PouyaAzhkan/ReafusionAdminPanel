import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Spinner,
} from "reactstrap";
import {
  Check,
  ExternalLink,
  MoreVertical,
  Trash2,
  XSquare,
} from "react-feather";
import { toast } from "react-hot-toast";
import emptyUserImg from "../../../assets/images/emptyImage/userImage.jpg";

export const columns = (
  setDeleteModal,
  setCommentToDelete,
  handleAcceptComment,
  handleRejectComment,
  isAccepting,
  isRejecting,
  setSidebarOpen,
  setCommentToReply
) => [
  {
    name: "نام کاربر",
    width: "200px",
    sortField: "author",
    selector: (row) => row.author,
    cell: (row) => (
      <div className="d-flex align-items-center">
        <img
          src={row.pictureAddress || emptyUserImg}
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
            {row.author?.replace("-", " ") || "بدون نام"}
          </span>
        </Link>
      </div>
    ),
  },
  {
    name: "عنوان کامنت",
    width: "150px",
    sortField: "title",
    selector: (row) => row.title,
    cell: (row) => <span className="text-truncate">{row.title || "—"}</span>,
  },
  {
    name: "توضیحات کامنت",
    width: "200px",
    sortField: "describe",
    selector: (row) => row.describe,
    cell: (row) => <span className="text-truncate">{row.describe || "—"}</span>,
  },
  {
    name: "وضعیت",
    width: "80px",
    sortField: "accept",
    selector: (row) => row.accept,
    cell: (row) => (
      <Badge color={row.accept ? "light-success" : "light-danger"} pill>
        {row.accept ? "تایید شده" : "تایید نشده"}
      </Badge>
    ),
  },
  {
    name: "عملیات",
    width: "80px",
    cell: (row) => (
      <div className="column-action">
        <UncontrolledDropdown className="dropend">
          <DropdownToggle tag="div" className="btn btn-sm">
            <MoreVertical size={14} className="cursor-pointer" />
          </DropdownToggle>
          <DropdownMenu >
            <DropdownItem
              tag="span"
              className="w-100"
              disabled={isAccepting || isRejecting}
              onClick={(e) => {
                e.preventDefault();
                if (row.accept) {
                  handleRejectComment(row.id);
                } else {
                  handleAcceptComment(row.id);
                }
              }}
            >
              <span className="align-items-center">
                {isAccepting || isRejecting ? (
                  <>
                    <Spinner size="sm" className="me-1" />
                    در حال پردازش...
                  </>
                ) : row.accept ? (
                  <span>
                    <XSquare size={14} className="me-50" />
                    رد کردن
                  </span>
                ) : (
                  <span>
                    <Check size={14} className="me-50" />
                    تایید کردن
                  </span>
                )}
              </span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                if (row.id) {
                  setDeleteModal(true);
                  setCommentToDelete(row.id);
                } else {
                  toast.error("شناسه کامنت نامعتبر است");
                }
              }}
            >
              <Trash2 size={14} className="me-50" />
              <span className="align-middle">حذف</span>
            </DropdownItem>
            <DropdownItem
              tag="span"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                if (row.id) {
                  setSidebarOpen(true);
                  setCommentToReply({
                    commentId: row.id,
                    courseId: row.courseId,
                  });
                } else {
                  toast.error("شناسه کامنت نامعتبر است");
                }
              }}
            >
              <span className="align-items-center">
                <ExternalLink size={14} className="me-50" />
                پاسخ
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];
