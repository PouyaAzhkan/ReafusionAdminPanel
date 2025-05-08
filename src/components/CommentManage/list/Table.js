import { Fragment, useState, useEffect } from "react";
import AddUserModal from "./AddUserModal";
import DeleteCommentModal from "./DeleteCommentModal";
import { columns } from "./columns";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { selectThemeColors } from "@utils";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  Spinner,
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

// ** Table Header
const CustomHeader = ({
  data,
  handleModal,
  handlePerPage,
  rowsPerPage,
  handleSearch,
  searchQuery,
}) => {
  return (
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
};

const CommentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState({
    value: null,
    label: "انتخاب",
    number: 0,
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);

  // فراخوانی هوک‌ها
  const queryClient = useQueryClient();
  const { mutate: acceptComment, isLoading: isAccepting } = useAcceptComment();
  const { mutate: rejectComment, isLoading: isRejecting } = useRejectComment();
  const { mutate: deleteComment, isLoading: isDeleting } = useDeleteComment();

  // کلید کش پویا
  const queryKey = [
    "comments",
    currentPage,
    rowsPerPage,
    currentStatus.value,
    debouncedSearch,
  ];

  // تابع برای تأیید کامنت
  const handleAcceptComment = (commentId) => {
    if (!commentId) {
      toast.error("شناسه کامنت نامعتبر است");
      return;
    }
    acceptComment(commentId, {
      onSuccess: () => {
        toast.success("کامنت با موفقیت تأیید شد!");
        queryClient.invalidateQueries(queryKey); // به‌روزرسانی داده‌ها
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.ErrorMessage?.[0] || "خطا در تأیید کامنت";
        toast.error(`خطا: ${errorMessage}`);
      },
    });
  };

  // تابع برای رد کامنت
  const handleRejectComment = (commentId) => {
    if (!commentId) {
      toast.error("شناسه کامنت نامعتبر است");
      return;
    }
    rejectComment(commentId, {
      onSuccess: () => {
        toast.success("کامنت با موفقیت رد شد!");
        queryClient.invalidateQueries(queryKey); // به‌روزرسانی داده‌ها
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.ErrorMessage?.[0] || "خطا در رد کامنت";
        toast.error(`خطا: ${errorMessage}`);
      },
    });
  };

  // حذف کامنت
  const handleConfirmDelete = () => {
    if (commentToDelete && typeof commentToDelete === "string") {
      deleteComment(commentToDelete, {
        onSuccess: () => {
          toast.success("کامنت با موفقیت حذف شد!");
          setDeleteModal(false);
          setCommentToDelete(null);
          queryClient.invalidateQueries(queryKey); // به‌روزرسانی داده‌ها
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.ErrorMessage?.[0] || "خطای ناشناخته در حذف کامنت";
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

  // Debounce search with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // بازگشت به صفحه اول
    }, 1000);

    return () => clearTimeout(timer); // پاکسازی تایمر
  }, [searchQuery]);

  // Fetch data
  const { data, isError, isLoading, refetch } = GetCommentList({
    PageNumber: currentPage,
    RowsOfPage: rowsPerPage,
    accept: currentStatus.value,
    Query: debouncedSearch,
  });

  const handleModal = () => setSidebarOpen(!sidebarOpen);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); // بازگشت به صفحه اول
  };

  const handleSearch = (val) => {
    setSearchQuery(val);
  };

  // Pagination component
  const CustomPagination = () => {
    const totalRows = data?.totalCount || 0; // تعداد کل ردیف‌ها
    const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage)); // حداقل 1 صفحه

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

  // Status options
  const statusOptions = [
    { value: "", label: "انتخاب" },
    { value: true, label: "تایید شده" },
    { value: false, label: "تایید نشده" },
  ];

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (isError) return <div>خطا در بارگذاری کامنت ها.</div>;

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
                  setCurrentPage(1); // بازگشت به صفحه اول
                }}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card className="overflow-hidden">
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
              isRejecting
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
                handleSearch={handleSearch}
                handlePerPage={handlePerPage}
                handleModal={handleModal}
              />
            }
          />
        </div>
      </Card>

      <AddUserModal open={sidebarOpen} handleModal={handleModal} />

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