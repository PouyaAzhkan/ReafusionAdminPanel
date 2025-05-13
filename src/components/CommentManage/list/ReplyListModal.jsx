import { Fragment, useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import { Card } from "reactstrap";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { getCommentReply } from "../../../@core/Services/Api/CommentManage/CommentManage";
import AddReplyCommentModal from "./AddReplyCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";
import { columns } from "./commentReplyColumns";

const CustomHeader = () => null;

const ReplyListModal = ({
  open,
  handleModal,
  courseId,
  commentId,
  commentTitle,
  setDeleteModal,
  setCommentToDelete,
  handleAcceptComment,
  handleRejectComment,
  isAccepting,
  isRejecting,
  setSidebarOpen,
  setCommentToReply,
  handleConfirmDelete,
  deleteModal,
  commentToDelete,
  isDeleting,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;
  const [sidebarOpenLocal, setSidebarOpenLocal] = useState(false);
  const [commentToReplyLocal, setCommentToReplyLocal] = useState(null);

  const { data, isError, isLoading } = getCommentReply(courseId, commentId);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handleReplyModal = () => {
    setSidebarOpenLocal(!sidebarOpenLocal);
    setSidebarOpen(!sidebarOpenLocal);
  };

  // پردازش داده‌ها با توجه به ساختار پاسخ
  const replies = Array.isArray(data) ? data : data ? [data] : [];
  const totalRows = replies.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedReplies = replies.slice(startIndex, startIndex + rowsPerPage);

  const CustomPagination = () => {
    const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    return (
      <ReactPaginate
        previousLabel={"قبلی"}
        nextLabel={"بعدی"}
        activeClassName="active"
        forcePage={currentPage - 1}
        onPageChange={handlePagination}
        pageCount={pageCount}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        containerClassName={
          "pagination react-paginate justify-content-end my-2 pe-1"
        }
        disabledClassName={"disabled"}
      />
    );
  };

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (isError) return <div>خطا در بارگذاری کامنت‌ها.</div>;

  return (
    <Fragment>
      <Modal
        isOpen={open}
        toggle={handleModal}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader className="bg-transparent" toggle={handleModal}></ModalHeader>
        <ModalBody className="pb-3 px-sm-3">
          <h1 className="text-center mb-1">
            لیست پاسخ‌ها
          </h1>
          <p className="text-center mb-2">
            {commentTitle
              ? `نمایش پاسخ‌های کامنت : ${commentTitle}`
              : "بدون عنوان"}
          </p>

          <Card>
            <div className="react-dataTable">
              <DataTable
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                paginationServer
                columns={columns(
                  setDeleteModal,
                  setCommentToDelete,
                  handleAcceptComment,
                  handleRejectComment,
                  isAccepting,
                  isRejecting,
                  (val) => {
                    setSidebarOpenLocal(val);
                    setSidebarOpen(val);
                  },
                  (val) => {
                    setCommentToReplyLocal(val);
                    setCommentToReply(val);
                  }
                )}
                onSort={() => { }}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                paginationComponent={CustomPagination}
                data={paginatedReplies}
                subHeaderComponent={<CustomHeader />}
              />
            </div>
          </Card>

          <AddReplyCommentModal
            openReply={sidebarOpenLocal}
            handleReplyModal={handleReplyModal}
            CommentId={commentToReplyLocal?.commentId || null}
            CourseId={courseId}
          />

          <DeleteCommentModal
            deleteModal={deleteModal}
            setDeleteModal={setDeleteModal}
            commentToDelete={commentToDelete}
            setCommentToDelete={setCommentToDelete}
            handleConfirmDelete={handleConfirmDelete}
            isDeleting={isDeleting}
          />
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default ReplyListModal;