import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Row, Col, Card, Input, Label, CardBody, CardTitle, CardHeader, Spinner, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Badge } from "reactstrap";
import { getAdminCourseComments } from "../../@core/Services/Api/AdminInfo/AdminInfo";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

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

// ** Table Columns
const columns = () => [
  {
    name: "عنوان دوره",
    width: "250px",
    cell: (row) => (
      <Link className="d-flex align-items-center w-100" to={`/WeblogAndNewsList/${row?.newsId}`}>
        <span className="fw-bolder text-truncate">{row?.courseTitle || "عنوان ندارد"}</span>
      </Link>
    ),
  },
  {
    name: "عنوان کامنت",
    width: "200px",
    cell: (row) => <span className="text-truncate">{row?.title || "0"}</span>,
  },
  {
    name: "متن کامنت",
    width: "250px",
    cell: (row) => <span className="text-truncate">{row?.describe || "0"}</span>,
  },
  {
    name: "تاریخ",
    width: "120px",
    cell: (row) => (
      <span>{row?.insertDate ? new Date(row.insertDate).toLocaleDateString("fa-IR") : "-"}</span>
    ),
  },
  {
    name: "وضعیت",
    width: "150px",
    cell: (row) => (
      <Badge color={row?.accept ? "light-success" : "light-danger"} pill>
        {row?.accept ? "تایید شده" : "تایید نشده"}
      </Badge>
    ),
  },
];

const CourseCommentsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isError, isLoading, refetch } = getAdminCourseComments({ cacheTime: 0 });

  // Debounce برای جستجو
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // فیلتر کردن داده‌ها
  const filteredData = data?.myCommentsDtos?.filter((item) =>
    item?.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  // صفحه‌بندی
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePagination = (page) => setCurrentPage(page.selected + 1);

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (val) => setSearchQuery(val);

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={"قبلی"}
      nextLabel={"بعدی"}
      activeClassName="active"
      forcePage={currentPage - 1}
      onPageChange={handlePagination}
      pageCount={Math.max(1, Math.ceil(data?.totalCount / rowsPerPage))}
      pageClassName={"page-item"}
      nextLinkClassName={"page-link"}
      nextClassName={"page-item next"}
      previousClassName={"page-item prev"}
      previousLinkClassName={"page-link"}
      pageLinkClassName={"page-link"}
      containerClassName={"pagination react-paginate justify-content-end my-2 pe-1"}
      disabledClassName={"disabled"}
    />
  );

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle tag="h4">کامنت های شما در دوره ها</CardTitle>
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
              <p>خطایی در بارگذاری داده‌ها رخ داد.</p>
              <Button color="primary" onClick={() => window.location.reload()}>
                تلاش مجدد
              </Button>
            </div>
          )}
          {!isLoading && !isError && (
            <DataTable
              noHeader
              subHeader
              pagination
              responsive
              columns={columns()}
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
              noDataComponent={<div className="text-center">هیچ خبری یافت نشد.</div>}
            />
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default CourseCommentsTab;