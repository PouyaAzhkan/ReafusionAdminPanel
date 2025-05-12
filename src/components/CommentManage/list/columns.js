import {
  Archive,
  Check,
  ExternalLink,
  Eye,
  MoreVertical,
  Trash2,
  XSquare,
} from "react-feather";
import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Spinner,
} from "reactstrap";
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
  setCommentToReply,
  setShowReplyList
) => [
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
    name: "پاسخ‌ها",
    minWidth: "100px",
    cell: (row) => (
      <div>
        {row.replyCount > 0 ? (
          <span
            onClick={() => {
              setCommentToReply({
                courseId: row.courseId,
                commentId: row.commentId,
                commentTitle: row.commentTitle,
              });
              setShowReplyList(true);
            }}
          >
            <Eye size={16} />
          </span>
        ) : (
          <span className="light-secondary">-</span>
        )}
      </div>
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
              disabled={isAccepting || isRejecting}
              onClick={(e) => {
                e.preventDefault();
                if (row.accept) {
                  handleRejectComment(row.commentId);
                } else {
                  handleAcceptComment(row.commentId);
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
                console.log("Opening reply modal for:", {
                  commentId: row.commentId,
                  courseId: row.courseId,
                });
                if (row.commentId) {
                  setSidebarOpen(true);
                  setCommentToReply({
                    commentId: row.commentId,
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
