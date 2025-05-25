import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
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
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { getAdminFavoriteCourseList, useDeleteAdminFavoriteCourse } from "../../@core/Services/Api/AdminInfo/AdminInfo";
import { ChevronDown, MoreVertical, Trash2 } from "react-feather";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Avatar from '@components/avatar';
import { toast } from "react-hot-toast";
import emptyImg from "../../assets/images/emptyImage/CourseImage.jpg";

// ** Table Header
const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleSearch,
  searchQuery,
}) => {
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center w-100">
            <Label htmlFor="rows-per-page">تعداد ردیف</Label>
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
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export const columns = (handleDeleteCourse, isDeleting) => [
  {
    name: "عنوان دوره",
    selector: (row) => row.courseTitle,
    width: "250px",
    cell: (row) => (
      <div className="d-flex align-items-center">
        <Link to={`/courses/${row?.courseId}`}>
          <Avatar
            className="me-1"
            img={row?.tumbImageAddress || emptyImg}
            alt=""
            imgWidth="32"
          />
        </Link>
        <div className="d-flex flex-column">
          <Link
            to={`/courses/${row?.courseId}`}
            className="fw-bolder text-truncate"
          >
            {row?.courseTitle || "نام ندارد"}
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: "استاد",
    selector: (row) => row?.teacheName,
    sortField: "teacheName",
    width: "150px",
    cell: (row) => <span className="text-truncate">{row?.teacheName || "-"}</span>,
  },
  {
    name: "سطح",
    selector: (row) => row?.levelName,
    width: "100px",
    cell: (row) => <span className="text-truncate">{row?.levelName || "-"}</span>,
  },
  {
    name: "حالت برگزاری",
    selector: (row) => row?.typeName,
    width: "130px",
    cell: (row) => <span className="text-truncate">{row?.typeName || "-"}</span>,
  },
  {
    name: "توضیحات",
    selector: (row) => row?.describe,
    sortField: "describe",
    width: "200px",
    cell: (row) => <span className="text-truncate">{row?.describe || "-"}</span>,
  },
  {
    name: "آخرین بروزرسانی",
    selector: (row) => row?.lastUpdate,
    width: "150px",
    cell: (row) => {
      const date = row?.lastUpdate
        ? new Date(row.lastUpdate).toLocaleDateString("fa-IR")
        : "-";
      return <span>{date}</span>;
    },
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
              tag="button"
              className="w-100"
              onClick={() => handleDeleteCourse(row?.favoriteId)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Spinner size="sm" className="me-50" />
              ) : (
                <Trash2 size={14} className="me-50" />
              )}
              <span className="align-middle">حذف</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];

const FavoritesCoursesTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isError, isLoading, refetch } = getAdminFavoriteCourseList({
    cacheTime: 0, // غیرفعال کردن کش
  });
  const { mutate: deleteCourse, isLoading: isDeleting } = useDeleteAdminFavoriteCourse();

  // handle delete course
  const handleDeleteCourse = (favoriteId) => {
    if (!favoriteId) {
      toast.error("شناسه دوره نامعتبر است!");
      return;
    }
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این دوره را از علاقه‌مندی‌ها حذف کنید؟")) {
      deleteCourse(favoriteId, {
        onSuccess: (data) => {
          const responseData = data?.data || data || {};
          const isSuccess = responseData?.success === true || responseData?.status === 200;
          const message = responseData?.message || (isSuccess ? "دوره با موفقیت حذف شد!" : "خطایی در پردازش پاسخ رخ داده است!");
          toast[isSuccess ? "success" : "error"](message);
          refetch();
        },
        onError: (error) => {
          const message = error.response?.status === 404
            ? "دوره موردنظر در لیست علاقه‌مندی‌ها یافت نشد!"
            : error.message || "خطایی در ارتباط با سرور رخ داده است!";
          toast.error(message);
        },
      });
    }
  };

  // Debounce برای جستجو
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // بازنشانی صفحه به ۱ هنگام جستجو
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // فیلتر کردن داده‌ها بر اساس جستجو
  const filteredData = data?.favoriteCourseDto?.filter((item) =>
    [
      item.courseTitle,
      item.describe,
    ].some((field) =>
      field?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  ) || [];

  // برش داده‌ها برای صفحه‌بندی
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = (e) => {
    const newRowsPerPage = parseInt(e.target.value);
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  const handleSearch = (val) => {
    setSearchQuery(val);
  };

  const handleSort = (column, sortDir) => {
    // مرتب‌سازی سمت کلاینت (در صورت نیاز به مرتب‌سازی سمت سرور، باید API اصلاح شود)
    setSortColumn(column.sortField);
    setSortDirection(sortDir.toUpperCase());
    setCurrentPage(1);
  };

  const CustomPagination = () => {
    const totalRows = data?.totalCount;
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

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle tag="h4">دوره‌های مورد علاقه شما</CardTitle>
        </CardHeader>
        <CardBody>
          {isLoading && (
            <div className="text-center">
              <Spinner color="primary" />
              <p>در حال بارگذاری...</p>
            </div>
          )}
          {isError && (
            <div className="text-center text-danger">
              <p>خطایی در بارگذاری داده‌ها رخ داد. لطفاً دوباره تلاش کنید.</p>
              <Button color="primary" onClick={() => window.location.reload()}>
                تلاش مجدد
              </Button>
            </div>
          )}

          {!isLoading && !isError && (
            <div className="react-dataTable">
              <DataTable
                noHeader
                subHeader
                sortServer={false}
                pagination
                responsive
                paginationServer={false}
                columns={columns(handleDeleteCourse, isDeleting)}
                onSort={handleSort}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                paginationComponent={CustomPagination}
                data={paginatedData}
                subHeaderComponent={
                  <CustomHeader
                    searchQuery={searchQuery}
                    rowsPerPage={rowsPerPage}
                    handleSearch={handleSearch}
                    handlePerPage={handlePerPage}
                  />
                }
                noDataComponent={<div className="text-center">هیچ دوره‌ای یافت نشد.</div>}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default FavoritesCoursesTab;