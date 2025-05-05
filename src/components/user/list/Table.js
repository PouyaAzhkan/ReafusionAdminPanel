// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Components
import Sidebar from "./Sidebar";
import { columns } from "./columns";
import Select from "react-select";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
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
} from "reactstrap";

// ** Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { GetUserList } from "../../../@core/Services/Api/UserManage/user";

// ** Table Header
const CustomHeader = ({
  data,
  toggleSidebar,
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

          <div className="d-flex align-items-center table-header-actions">
            <Button
              className="add-new-user"
              color="primary"
              onClick={toggleSidebar}
            >
              افزودن کاربر
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState(""); // برای ورودی لحظه‌ای
  const [debouncedSearch, setDebouncedSearch] = useState(""); // برای جستجوی واقعی
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({
    value: "",
    label: "انتخاب",
  });

  const [currentStatus, setCurrentStatus] = useState({
    value: null,
    label: "انتخاب",
    number: 0,
  });

  // Debounce search with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Debounced search term:", searchQuery);
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // بازگشت به صفحه اول
    }, 1000);

    return () => clearTimeout(timer); // پاکسازی تایمر
  }, [searchQuery]);

  // Fetch data
  const { data, isError, isLoading } = GetUserList({
    PageNumber: currentPage,
    RowsOfPage: rowsPerPage,
    roleId: currentRole.number,
    IsActiveUser: currentStatus.value,
    Query: debouncedSearch, // استفاده از debouncedSearch
  });

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  // Role options from API
  const roleOptions = data?.roles
    ? [
        { value: "", label: "انتخاب" },
        ...data?.roles.map((role) => ({
          number: role.id,
          value: role.roleName,
          label: role.roleName,
        })),
      ]
    : [{ value: "", label: "انتخاب" }];

  // Status options
  const statusOptions = [
    { value: "", label: "انتخاب" },
    { value: true, label: "فعال" },
    { value: false, label: "غیرفعال" },
  ];

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (isError) return <div>خطا در بارگذاری کاربران.</div>;

  return (
    <Fragment>
      <Card>
        <CardHeader>
          <CardTitle tag="h4">فیلترها</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <Label for="role-select">نقش</Label>
              <Select
                isClearable={false}
                value={currentRole}
                options={roleOptions}
                className="react-select"
                classNamePrefix="select"
                theme={selectThemeColors}
                onChange={(data) => {
                  console.log("Role changed:", data);
                  setCurrentRole(data);
                  setCurrentPage(1); // بازگشت به صفحه اول
                }}
              />
            </Col>

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
                  console.log("Status changed:", data);
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
            columns={columns}
            onSort={() => {}}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={data?.listUser || []} // فال‌بک به آرایه خالی
            subHeaderComponent={
              <CustomHeader
                data={data?.listUser}
                searchQuery={searchQuery}
                rowsPerPage={rowsPerPage}
                handleSearch={handleSearch}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
  );
};

export default UsersList;
