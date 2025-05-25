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
import { getAdminReservedCourseList } from "../../@core/Services/Api/AdminInfo/AdminInfo";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import moment from "jalali-moment";
import emptyImg from "../../assets/images/emptyImage/CourseImage.jpg";
import { Link } from "react-router-dom";
import Avatar from "@components/avatar";

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
    name: "نام دوره",
    selector: (row) => row.courseName || "نام ندارد",
    sortable: true,
    width: "250px",
    cell: (row) => (
      <div className="d-flex align-items-center">
        <Link to={`/courses/${row?.courseId}`}>
          <Avatar
            className="me-1"
            img={emptyImg}
            alt=""
            imgWidth="32"
          />
        </Link>
        <div className="d-flex flex-column">
          <Link
            to={`/courses/${row?.courseId}`}
            className="fw-bolder text-truncate"
          >
            {row?.courseName || "نام ندارد"}
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: "دانشجو",
    selector: (row) => row?.studentName,
    sortable: true,
    sortField: "studentName",
    width: "200px",
    cell: (row) => <span className="text-truncate">{row?.studentName || "-"}</span>,
  },
  {
    name: "تاریخ رزرو",
    selector: (row) => row.reserverDate,
    sortable: true,
    width: "220px",
    cell: (row) => {
      const date = new Date(row.reserverDate);
      const formattedDate = date.toLocaleDateString("fa-IR");
      const formattedTime = date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return <span>{`${formattedDate} ساعت ${formattedTime}`}</span>;
    },
  },
  {
    name: "وضعیت",
    selector: (row) => row?.accept,
    sortable: true,
    sortField: "accept",
    width: "100px",
    cell: (row) => (
      <Badge color={row?.accept ? "light-success" : "light-danger"} pill>
        {row?.accept ? "فعال" : "غیرفعال"}
      </Badge>
    ),
  },
];

const ReservedCoursesTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null); // بدون مرتب‌سازی پیش‌فرض
  const [sortDirection, setSortDirection] = useState(null); // بدون جهت پیش‌فرض

  const { data, isError, isLoading } = getAdminReservedCourseList();

  // Debounce برای جستجو
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // بازنشانی صفحه به ۱ هنگام جستجو
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // فیلتر کردن داده‌ها بر اساس جستجو
  const filteredData = data?.filter((item) =>
    [
      item.courseName,
      item.studentName,
    ].some((field) =>
      field?.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
  ) || [];

  // مرتب‌سازی داده‌ها فقط در صورت وجود sortColumn
  const sortedData = sortColumn && sortDirection
    ? [...filteredData].sort((a, b) => {
      const fieldA = a[sortColumn] || "";
      const fieldB = b[sortColumn] || "";
      if (sortColumn === "lastUpdate") {
        const dateA = new Date(a.workStartDate || a.lastUpdate);
        const dateB = new Date(b.workStartDate || b.lastUpdate);
        return sortDirection === "ASC" ? dateA - dateB : dateB - dateA;
      }
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        return sortDirection === "ASC"
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }
      return sortDirection === "ASC" ? fieldA - fieldB : fieldB - fieldA;
    })
    : filteredData; // استفاده از داده‌های فیلترشده بدون مرتب‌سازی

  // برش داده‌ها برای صفحه‌بندی
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

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
    setSortColumn(column.sortField);
    setSortDirection(sortDir.toUpperCase());
    setCurrentPage(1);
  };

  const CustomPagination = () => {
    const totalRows = filteredData.length;
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
          <CardTitle tag="h4">دوره های رزور شده</CardTitle>
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
                columns={columns}
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
                noDataComponent={<div className="text-center">هیچ شغلی یافت نشد.</div>}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default ReservedCoursesTab;