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
  Badge,
  Spinner,
} from "reactstrap";
import { getAdminCourseList } from "../../@core/Services/Api/AdminInfo/AdminInfo";
import { ChevronDown } from "react-feather";
import Avatar from "@components/avatar";
import emptyImg from "../../assets/images/emptyImage/CourseImage.jpg";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

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

export const columns = [
  {
    name: "عنوان دوره",
    selector: (row) => row.courseTitle || "نام ندارد",
    width: "200px",
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
    name: "بروزرسانی",
    selector: (row) => row?.lastUpdate,
    width: "120px",
    cell: (row) => {
      const date = row?.lastUpdate
        ? new Date(row.lastUpdate).toLocaleDateString("fa-IR")
        : "-";
      return <span>{date}</span>;
    },
  },
  {
    name: "استاد دوره",
    selector: (row) => row?.fullName || "-",
    width: "170px",
    cell: (row) => <span className="text-truncate">{row?.fullName || "-"}</span>,
  },
  {
    name: "توضیحات",
    selector: (row) => row?.describe || "-",
    width: "150px",
    cell: (row) => <span className="text-truncate">{row?.describe || "-"}</span>,
  },
  {
    name: "حالت برگزاری",
    selector: (row) => row?.statusName || "-",
    width: "130px",
    cell: (row) => <span className="text-truncate">{row?.statusName || "-"}</span>,
  },
  {
    name: "وضعیت",
    width: "100px",
    sortField: "isActive",
    selector: (row) => row.isActive,
    cell: (row) => (
      <Badge color={row.isActive ? "light-success" : "light-danger"} pill>
        {row.isActive ? "فعال" : "غیرفعال"}
      </Badge>
    ),
  },
  {
    name: "مبلغ",
    selector: (row) => row?.cost || 0,
    width: "150px",
    cell: (row) => {
      const formattedPaid = Number(row?.cost || 0).toLocaleString("fa-IR");
      return <span className="text-truncate">{formattedPaid + " تومان"}</span>;
    },
  },
  {
    name: "وضعیت پرداخت",
    width: "150px",
    sortField: "statusName",
    selector: (row) => row.statusName,
    cell: (row) => (
      <Badge color={row.statusName === "پرداخت شده" ? "light-success" : "light-danger"} pill>
        {row.statusName === "پرداخت شده" ? "پرداخت شده" : "پرداخت نشده"}
      </Badge>
    ),
  },
];

const CoursesTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState("LastUpdate");
  const [sortDirection, setSortDirection] = useState("DESC");

  const { data, isError, isLoading, refetch } = getAdminCourseList({
    PageNumber: currentPage,
    RowsOfPage: rowsPerPage,
    Query: debouncedSearch,
    SortColumn: sortColumn,
    SortDirection: sortDirection,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // صفحه را به ۱ بازنشانی می‌کند
    }, 500); // کاهش تأخیر به 500 میلی‌ثانیه برای تجربه بهتر
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    refetch();
  }, [currentPage, rowsPerPage, debouncedSearch, sortColumn, sortDirection]);

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

  const handleSort = (column, sortDirection) => {
    setSortColumn(column.sortField || column.selector);
    setSortDirection(sortDirection === "asc" ? "ASC" : "DESC");
  };

  const CustomPagination = () => {
    const totalRows = data?.totalCount || 0; // محاسبه تعداد کل از داده‌های دریافتی
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
          <CardTitle tag="h4">لیست دوره‌ها</CardTitle>
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
              <Button color="primary" onClick={refetch}>
                تلاش مجدد
              </Button>
            </div>
          )}
          {!isLoading && !isError && (
            <div className="react-dataTable">
              <DataTable
                noHeader
                subHeader
                sortServer
                pagination
                responsive
                paginationServer
                columns={columns}
                onSort={handleSort}
                sortIcon={<ChevronDown />}
                className="react-dataTable"
                paginationComponent={CustomPagination}
                data={data?.listOfMyCourses || []} // استفاده مستقیم از آرایه داده‌ها
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

export default CoursesTab;