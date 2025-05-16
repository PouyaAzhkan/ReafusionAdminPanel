import { Fragment, useState, useEffect } from "react";
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
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import AddBuildingModal from "./AddBuildingModal";
import EditBuildingInfo from "./EditBuildingInfo"; // ایمپورت کامپوننت جدید
import { getAllTerms } from "./../../@core/Services/Api/Terms/Terms";

const statusOptions = [
  { value: "", label: "انتخاب" },
  { value: true, label: "منقضی شده" },
  { value: false, label: "منقضی نشده" },
];

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
              onClick={handleModal}
            >
              افزودن ساختمان
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const TermsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState(null); // اضافه کردن state برای ساختمان انتخاب‌شده
  const [currentStatus, setCurrentStatus] = useState({
    value: "",
    label: "انتخاب",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data, isError, isLoading, refetch } = getAllTerms();

  const filteredData =
    data?.filter((item) => {
      const searchText = debouncedSearch?.toLowerCase() || "";

      const matchesSearch = debouncedSearch
        ? item.departmentName?.toLowerCase().includes(searchText) ||
          item.termName?.toLowerCase().includes(searchText)
        : true;

      const matchesStatus =
        currentStatus.value !== "" ? item.expire === currentStatus.value : true;

      return matchesSearch && matchesStatus;
    }) || [];

  const totalRows = filteredData.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handleModal = () => setSidebarOpen(!sidebarOpen);

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

  const handleStatusChange = (option) => {
    setCurrentStatus(option);
    setCurrentPage(1);
  };

  const handleBuildingUpdated = (updatedBuilding) => {
    refetch(); // به‌روزرسانی داده‌ها پس از ویرایش
  };

  const CustomPagination = () => {
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
  if (isError) return <div>خطا در بارگذاری ساختمان‌ها.</div>;

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
                onChange={handleStatusChange}
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
            columns={columns({
              refetch,
              setShowEditModal,
              setSelectedBuilding,
            })}
            onSort={() => {}}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={paginatedData}
            subHeaderComponent={
              <CustomHeader
                data={data}
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

      <AddBuildingModal open={sidebarOpen} handleModal={handleModal} />

      <EditBuildingInfo
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedBuilding={selectedBuilding}
        onBuildingUpdated={handleBuildingUpdated}
      />
    </Fragment>
  );
};

export default TermsList;
