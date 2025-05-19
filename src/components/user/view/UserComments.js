import { Badge, Card, CardHeader } from "reactstrap";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useState, useEffect } from "react";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Spinner,
} from "reactstrap";
import {
  MoreVertical,
  XSquare,
  Check,
  Trash2,
  ExternalLink,
} from "react-feather";
import toast from "react-hot-toast"; // استفاده از react-hot-toast
import {
  GetCommentList,
  useAcceptComment,
  useRejectComment,
  useDeleteComment,
} from "../../../@core/Services/Api/CommentManage/CommentManage";
import DeleteCommentModal from "./DeleteCommentModal"; // فرضاً در همان پوشه است
import ReplyCommentModal from "./AddReplyCommentModal";

export const columns = ({
  isAccepting,
  isRejecting,
  handleAcceptComment,
  handleRejectComment,
  setDeleteModal,
  setCommentToDelete,
  setSidebarOpen,
  setCommentToReply,
}) => [
  {
    name: "عنوان دوره",
    selector: (row) => row.courseTitle,
    sortable: true,
    width: "250px",
    cell: (row) => (
      <span className="text-truncate">{row.courseTitle || "عنوان ندارد"}</span>
    ),
  },
  {
    name: "توضیحات",
    selector: (row) => row.describe,
    sortable: false,
    width: "250px",
    cell: (row) => (
      <span className="text-truncate">{row.describe || "توضیحات ندارد"}</span>
    ),
  },
  {
    name: "وضعیت",
    selector: (row) => row.accept,
    sortable: true,
    width: "100px",
    cell: (row) => (
      <Badge color={row.accept ? "light-success" : "light-danger"} pill>
        {row.accept ? "تایید شده" : "تایید نشده"}
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

const UserComments = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // حالت لودینگ برای حذف
  const [deleteModal, setDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [commentToReply, setCommentToReply] = useState(null);

  const { data, isError, isLoading, refetch } = GetCommentList({
    PageNumber: currentPage,
    RowsOfPage: rowsPerPage,
    userId: userData?.id,
  });

  const { mutate: acceptComment } = useAcceptComment();
  const { mutate: rejectComment } = useRejectComment();
  const { mutate: deleteComment } = useDeleteComment(); // هوک برای حذف کامنت

  // Log API response for debugging
  useEffect(() => {
    console.log("API Response for Page", currentPage, ":", data);
  }, [data, currentPage]);

  // Trigger refetch when currentPage changes
  useEffect(() => {
    if (userData?.id) {
      refetch();
    }
  }, [currentPage, userData?.id, refetch]);

  // مدیریت باز و بسته شدن مودال پاسخ
  const handleReplyModal = () => {
    setSidebarOpen(!sidebarOpen);
    if (sidebarOpen) {
      setCommentToReply(null); // پاک کردن داده‌ها هنگام بستن
    }
  };

  // عملیات تأیید کامنت
  const handleAcceptComment = (commentId) => {
    setIsAccepting(true);
    acceptComment(commentId, {
      onSuccess: () => {
        toast.success("کامنت با موفقیت تأیید شد");
        refetch();
      },
      onError: () => {
        toast.error("خطا در تأیید کامنت");
      },
      onSettled: () => {
        setIsAccepting(false);
      },
    });
  };

  // عملیات رد کامنت
  const handleRejectComment = (commentId) => {
    setIsRejecting(true);
    rejectComment(commentId, {
      onSuccess: () => {
        toast.success("کامنت با موفقیت رد شد");
        refetch();
      },
      onError: () => {
        toast.error("خطا در رد کامنت");
      },
      onSettled: () => {
        setIsRejecting(false);
      },
    });
  };

  // عملیات حذف کامنت
  const handleConfirmDelete = () => {
    if (!commentToDelete) {
      toast.error("شناسه کامنت نامعتبر است");
      return;
    }
    console.log("Deleting comment with ID:", commentToDelete); // لاگ برای دیباگ
    setIsDeleting(true);
    deleteComment(commentToDelete, {
      onSuccess: () => {
        toast.success("کامنت با موفقیت حذف شد");
        refetch();
        setDeleteModal(false);
        setCommentToDelete(null);
      },
      onError: (error) => {
        console.error("Delete error:", error);
        toast.error("خطا در حذف کامنت");
      },
      onSettled: () => {
        setIsDeleting(false);
      },
    });
  };

  // Ensure data.comments is an array and totalCount is a number
  const comments = Array.isArray(data?.comments) ? data.comments : [];
  const totalCount = Number(data?.totalCount) || 0;

  // Calculate the page count
  const pageCount = Math.ceil(totalCount / rowsPerPage) || 1;

  // Handle page change
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  // Render loading state
  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  // Render error state
  if (isError) {
    return (
      <div>
        خطایی رخ داده است.{" "}
        <button onClick={() => refetch()}>تلاش دوباره</button>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader tag="h4">کامنت‌های کاربر</CardHeader>
        <div className="react-dataTable user-view-account-projects">
          <DataTable
            noHeader
            responsive
            columns={columns({
              isAccepting,
              isRejecting,
              handleAcceptComment,
              handleRejectComment,
              setDeleteModal,
              setCommentToDelete,
              setSidebarOpen,
              setCommentToReply,
            })}
            data={comments}
            className="react-dataTable mb-1"
            sortIcon={<ChevronDown size={10} />}
            noDataComponent={<div>هیچ کامنتی در این صفحه یافت نشد</div>}
          />
          <ReactPaginate
            previousLabel={""}
            nextLabel={""}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={handlePagination}
            forcePage={currentPage - 1}
            containerClassName="pagination"
            activeClassName="active"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item prev"
            previousLinkClassName="page-link"
            nextClassName="page-item next"
            nextLinkClassName="page-link"
          />
        </div>
      </Card>
      <ReplyCommentModal
        openReply={sidebarOpen}
        handleReplyModal={handleReplyModal}
        CommentId={commentToReply?.commentId}
        CourseId={commentToReply?.courseId}
      />
      <DeleteCommentModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        commentToDelete={commentToDelete}
        setCommentToDelete={setCommentToDelete}
        handleConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default UserComments;
