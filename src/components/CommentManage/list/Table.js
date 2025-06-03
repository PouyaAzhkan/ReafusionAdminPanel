// Updated CommentList with skeleton loader
import { Fragment, useState, useEffect } from "react";
import AddReplyCommentModal from "./AddReplyCommentModal";
import DeleteCommentModal from "./DeleteCommentModal";
import { columns } from "./columns";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { selectThemeColors } from "@utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";
import { toast } from "react-hot-toast";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import {
  GetCommentList,
  useAcceptComment,
  useDeleteComment,
  useRejectComment,
} from "../../../@core/Services/Api/CommentManage/CommentManage";
import { useQueryClient } from "@tanstack/react-query";
import ReplyListModal from "./ReplyListModal";

// Skeleton UI
const TableSkeleton = ({ rows = 10 }) => {
  return (
    <div className="px-2 py-1">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="d-flex justify-content-between align-items-center mb-2"
        >
          <Skeleton width={150} height={20} />
          <Skeleton width={100} height={20} />
          <Skeleton width={200} height={20} />
          <Skeleton width={80} height={20} />
        </div>
      ))}
    </div>
  );
};

const CustomHeader = ({ data, handlePerPage, rowsPerPage, handleSearch, searchQuery }) => (
  <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
    <Row>
      <Col xl="4" className="d-flex align-items-center p-0">
        <div className="d-flex align-items-center w-100">
          <label htmlFor="rows-per-page">تعداد ردیف</label>
          <Input
            className="mx-50"
            type="select"
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handlePerPage}
            style={{ width: "5rem" }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Input>
        </div>
      </Col>
      <Col
        xl="8"
        className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column p-0 mt-xl-0 mt-1"
      >
        <div className="d-flex align-items-center mb-sm-0 mb-1 me-1 w-50">
          <Input
            id="search-invoice"
            className="w-100"
            type="text"
            placeholder="جستجو نام کاربر، عنوان کامنت، نام دوره و ..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </Col>
    </Row>
  </div>
);

const CommentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showReplyList, setShowReplyList] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({ value: null, label: "انتخاب" });
  const [deleteModal, setDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [commentToReply, setCommentToReply] = useState(null);

  const queryClient = useQueryClient();
  const { mutate: acceptComment, isLoading: isAccepting } = useAcceptComment();
  const { mutate: rejectComment, isLoading: isRejecting } = useRejectComment();
  const { mutate: deleteComment, isLoading: isDeleting } = useDeleteComment();

  const queryKey = ["comments", currentPage, rowsPerPage, currentStatus.value, debouncedSearch];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isError, isLoading } = GetCommentList({
    PageNumber: currentPage,
    RowsOfPage: rowsPerPage,
    accept: currentStatus.value,
    Query: debouncedSearch,
  });

  const handleConfirmDelete = () => {
    if (commentToDelete && typeof commentToDelete === "string") {
      deleteComment(commentToDelete, {
        onSuccess: () => {
          toast.success("کامنت با موفقیت حذف شد!");
          setDeleteModal(false);
          setCommentToDelete(null);
          queryClient.invalidateQueries(queryKey);
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.ErrorMessage?.[0] || "خطای ناشناخته در حذف کامنت";
          toast.error(`خطا در حذف کامنت: ${errorMessage}`);
          setDeleteModal(false);
          setCommentToDelete(null);
        },
      });
    } else {
      toast.error("شناسه کامنت نامعتبر است");
      setDeleteModal(false);
      setCommentToDelete(null);
    }
  };

  const CustomPagination = () => {
    const totalRows = data?.totalCount || 0;
    const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    return (
      <ReactPaginate
        previousLabel={"قبلی"}
        nextLabel={"بعدی"}
        activeClassName="active"
        forcePage={currentPage - 1}
        onPageChange={(page) => setCurrentPage(page.selected + 1)}
        pageCount={pageCount}
        containerClassName="pagination react-paginate justify-content-end my-2 pe-1"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item prev"
        nextClassName="page-item next"
        previousLinkClassName="page-link"
        nextLinkClassName="page-link"
        disabledClassName="disabled"
      />
    );
  };

  const statusOptions = [
    { value: "", label: "انتخاب" },
    { value: true, label: "تایید شده" },
    { value: false, label: "تایید نشده" },
  ];

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">فیلترها</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <Label for="status-select">وضعیت</Label>
              <Select
                theme={selectThemeColors}
                isClearable={false}
                className="react-select"
                classNamePrefix="select"
                options={statusOptions}
                value={currentStatus}
                onChange={(data) => {
                  setCurrentStatus(data);
                  setCurrentPage(1);
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <div className="react-dataTable">
          {isLoading ? (
            <TableSkeleton rows={rowsPerPage} />
          ) : isError ? (
            <div className="p-2">خطا در بارگذاری کامنت‌ها.</div>
          ) : (
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
                acceptComment,
                rejectComment,
                isAccepting,
                isRejecting,
                setSidebarOpen,
                setCommentToReply,
                setShowReplyList
              )}
              onSort={() => {}}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              paginationComponent={CustomPagination}
              data={data?.comments || []}
              subHeaderComponent={
                <CustomHeader
                  data={data?.comments}
                  searchQuery={searchQuery}
                  rowsPerPage={rowsPerPage}
                  handleSearch={setSearchQuery}
                  handlePerPage={(e) => {
                    setRowsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                />
              }
            />
          )}
        </div>
      </Card>

      <AddReplyCommentModal
        openReply={sidebarOpen}
        handleReplyModal={() => setSidebarOpen(!sidebarOpen)}
        CommentId={commentToReply?.commentId || null}
        CourseId={commentToReply?.courseId || null}
      />

      {showReplyList && (
        <ReplyListModal
          open={showReplyList}
          handleModal={() => setShowReplyList(!showReplyList)}
          courseId={commentToReply?.courseId || null}
          commentId={commentToReply?.commentId || null}
          commentTitle={commentToReply?.commentTitle || ""}
          setDeleteModal={setDeleteModal}
          setCommentToDelete={setCommentToDelete}
          handleAcceptComment={acceptComment}
          handleRejectComment={rejectComment}
          isAccepting={isAccepting}
          isRejecting={isRejecting}
          setSidebarOpen={setSidebarOpen}
          setCommentToReply={setCommentToReply}
          handleConfirmDelete={handleConfirmDelete}
          deleteModal={deleteModal}
          commentToDelete={commentToDelete}
          isDeleting={isDeleting}
        />
      )}

      <DeleteCommentModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        commentToDelete={commentToDelete}
        setCommentToDelete={setCommentToDelete}
        handleConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </Fragment>
  );
};

export default CommentList;