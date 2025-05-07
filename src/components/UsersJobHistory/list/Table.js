import { Fragment, useState, useEffect } from "react";
import AddJobHistoryModal from "./AddJobHistoryModal";
import DeleteJobHistoryModal from "./DeleteJobHistoryModal";
import EditJobHistoryModal from "./EditJobHistoryModal";
import { columns } from "./columns";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { Row, Col, Card, Input, Button } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import {
  getAllUsersJobHistory,
  useDeleteJobHistory,
} from "../../../@core/Services/Api/JobHistory/JobHistory";
import toast from "react-hot-toast";

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
              placeholder="جستجو عنوان شغل یا نام شرکت ..."
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
              افزودن سابقه شغلی
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [jobHistoryToDelete, setJobHistoryToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJobHistory, setSelectedJobHistory] = useState(null);

  const {
    data: jobHistoryData,
    isError,
    isLoading,
    refetch,
  } = getAllUsersJobHistory();
  const { mutate: deleteJobHistory, isLoading: isDeleting } =
    useDeleteJobHistory();

  // ** Filter data based on search query and pagination
  const filteredData =
    jobHistoryData?.filter((item) =>
      debouncedSearch
        ? item.jobTitle
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase()) ||
          item.companyName
            ?.toLowerCase()
            .includes(debouncedSearch.toLowerCase())
        : true
    ) || [];

  // ** Paginate filtered data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // ** Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ** Handle Delete User
  const handleConfirmDelete = () => {
    if (jobHistoryToDelete) {
      deleteJobHistory(jobHistoryToDelete, {
        onSuccess: (result) => {
          toast.success(result.message || "سابقه شغلی با موفقیت حذف شد!", {
            position: "top-right",
            duration: 3000,
          });
          setDeleteModal(false);
          setJobHistoryToDelete(null);
          refetch();
        },
        onError: (error) => {
          const errorMessage = error.message || "خطا در حذف سابقه شغلی";
          toast.error(`خطا: ${errorMessage}`, {
            position: "top-right",
            duration: 3000,
          });
          setDeleteModal(false);
          setJobHistoryToDelete(null);
        },
      });
    } else {
      setDeleteModal(false);
    }
  };

  // ** Handle Job History Update
  const handleJobHistoryUpdate = (updatedJobHistory) => {
    refetch(); // بارگذاری مجدد داده‌ها از API
    setShowEditModal(false); // بستن مودال پس از به‌روزرسانی
  };

  // ** Handlers
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

  // ** Custom Pagination Component
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

  // ** Loading and Error States
  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }
  if (isError) return <div>خطا در بارگذاری کاربران.</div>;

  return (
    <Fragment>
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
              setJobHistoryToDelete,
              setShowEditModal,
              setSelectedJobHistory
            )}
            onSort={() => {}}
            sortIcon={<ChevronDown />}
            className="react-dataTable"
            paginationComponent={CustomPagination}
            data={paginatedData}
            subHeaderComponent={
              <CustomHeader
                data={filteredData}
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

      {/* add job history modal */}
      <AddJobHistoryModal open={sidebarOpen} handleModal={handleModal} />

      {/* delete job history modal */}
      <DeleteJobHistoryModal
        deleteModal={deleteModal}
        setDeleteModal={setDeleteModal}
        jobHistoryToDelete={jobHistoryToDelete}
        setJobHistoryToDelete={setJobHistoryToDelete}
        handleConfirmDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* edit job history modal */}
      <EditJobHistoryModal
        show={showEditModal}
        setShow={setShowEditModal}
        selectedJobHistory={selectedJobHistory}
        onUserUpdated={handleJobHistoryUpdate}
      />
    </Fragment>
  );
};

export default UsersList;
