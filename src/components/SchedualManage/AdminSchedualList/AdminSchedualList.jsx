import { Fragment, useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    Badge,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    UncontrolledDropdown,
    CardHeader,
    CardTitle,
    Label,
    CardBody,
} from "reactstrap";
import { MoreVertical, ChevronDown, Edit } from "react-feather";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import { getAdminSchedual, getCourseGroupDetail } from "../../../@core/Services/Api/Schedual/Schedual";
import toast from "react-hot-toast";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { gregorian } from "react-date-object/calendars/gregorian";
import SchedualCalendar from "../Calendar";
import AddSchedualModal from "./AddSchedualModal";
import EditSchedualModal from "./EditSchedualModal";

// تعریف ستون‌ها
export const columns = (handleEditModal) => [
    {
        name: "نام گروه",
        width: "150px",
        sortField: "title",
        selector: (row) => row.courseGroupId,
        cell: (row) => {
            const { data, isLoading, isError } = getCourseGroupDetail(row.courseGroupId);
            useEffect(() => {
            }, [data, row.courseGroupId]);
            if (isLoading) return <span className="text-truncate">در حال بارگذاری...</span>;
            if (isError) return <span className="text-truncate">خطا در دریافت</span>;
            const groupName = data?.courseGroupDto?.groupName || "—";
            return <span className="text-truncate">{groupName}</span>;
        },
    },
    {
        name: "ساعت",
        width: "90px",
        sortField: "title",
        selector: (row) => row.startTime,
        cell: (row) => (
            <span className="text-truncate">{row.startTime + " تا " + row.endTime || "—"}</span>
        ),
    },
    {
        name: "تعداد در هفته",
        width: "110px",
        sortField: "weekNumber",
        selector: (row) => row.weekNumber,
        cell: (row) => <span className="text-truncate">{row.weekNumber || "—"}</span>,
    },
    {
        name: "تاریخ شروع و پایان",
        width: "160px",
        sortField: "startDate",
        selector: (row) => row.startDate,
        cell: (row) => {
            const startDate = row.startDate?.split("T")[0];
            const endDate = row.endDate?.split("T")[0];
            const startPersian = startDate
                ? new DateObject({ date: startDate, calendar: gregorian })
                    .convert(persian, persian_fa)
                    .format("YYYY/MM/DD")
                : "";
            const endPersian = endDate
                ? new DateObject({ date: endDate, calendar: gregorian })
                    .convert(persian, persian_fa)
                    .format("YYYY/MM/DD")
                : "";
            return startPersian && endPersian ? `${startPersian} تا ${endPersian}` : "—";
        },
    },
    {
        name: "حالت دوره",
        width: "100px",
        sortField: "forming",
        selector: (row) => row.forming,
        cell: (row) => (
            <Badge color={row.forming ? "light-success" : "light-danger"} pill>
                {row.forming ? "تشکیل شده" : "تشکیل نشده"}
            </Badge>
        ),
    },
    {
        name: "حالت حضور",
        width: "100px",
        sortField: "lockToRaise",
        selector: (row) => row.lockToRaise,
        cell: (row) => (
            <Badge color={row.lockToRaise ? "light-success" : "light-danger"} pill>
                {row.lockToRaise ? "فعال" : "غیرفعال"}
            </Badge>
        ),
    },
    {
        name: "عملیات",
        width: "80px",
        cell: (row) => (
            <div className="column-action">
                <UncontrolledDropdown className="dropend">
                    <DropdownToggle tag="div" className="btn btn-sm">
                        <MoreVertical size={14} className="cursor-pointer" />
                    </DropdownToggle>
                    <DropdownMenu container="body">
                        <DropdownItem
                            tag="span"
                            className="w-100"
                            onClick={(e) => {
                                e.preventDefault();
                                handleEditModal(row); // پاس دادن row
                            }}
                        >
                            <Edit size={14} className="me-50" />
                            <span className="align-middle">ویرایش</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        ),
    },
];

// کامپوننت هدر سفارشی
const CustomHeader = ({ handlePerPage, rowsPerPage, handleAddNewModal }) => {
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
                    <div className="d-flex align-items-center table-header-actions">
                        <Button onClick={handleAddNewModal} className="add-new-item" color="primary">
                            افزودن
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

// کامپوننت اصلی
const AdminSchedualList = () => {
    const [openAddNewModal, setOpenAddNewModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null); // استیت برای ردیف انتخاب‌شده

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateRange, setDateRange] = useState({
        startDate: formattedToday,
        endDate: formattedToday,
    });

    const handleAddNewModal = () => setOpenAddNewModal(!openAddNewModal);
    const handleEditModal = (row) => {
        setSelectedRow(row); // ذخیره ردیف انتخاب‌شده
        setOpenEditModal(!openEditModal);
    };

    // fetch data
    const { data, isError, isLoading } = getAdminSchedual({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
    });

    useEffect(() => {
        if (isLoading) {
            toast.loading("در حال بارگذاری داده‌ها...");
        } else {
            toast.dismiss();
        }
        if (isError) {
            toast.error("خطا در دریافت داده‌ها!");
        }
    }, [isLoading, isError]);

    const filteredData = data || [];
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePagination = (page) => {
        setCurrentPage(page.selected + 1);
    };

    const handlePerPage = (e) => {
        const newRowsPerPage = parseInt(e.target.value);
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const handleDateRangeChange = ({ startDate, endDate }) => {
        if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
            toast.error("تاریخ پایان باید بعد از تاریخ شروع باشد!");
            return;
        }
        setDateRange({ startDate, endDate });
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
                containerClassName={"pagination react-paginate justify-content-end my-2 pe-1"}
                disabledClassName={"disabled"}
            />
        );
    };

    return (
        <Fragment>
            <Row>
                <Col md={8}>
                    <Card className="overflow-hidden">
                        <div className="react-dataTable">
                            <DataTable
                                noHeader
                                subHeader
                                sortServer
                                pagination
                                responsive
                                paginationServer
                                columns={columns(handleEditModal)}
                                onSort={() => { }}
                                sortIcon={<ChevronDown />}
                                className="react-dataTable"
                                paginationComponent={CustomPagination}
                                data={paginatedData}
                                subHeaderComponent={
                                    <CustomHeader
                                        rowsPerPage={rowsPerPage}
                                        handlePerPage={handlePerPage}
                                        handleAddNewModal={handleAddNewModal}
                                    />
                                }
                            />
                        </div>
                    </Card>
                </Col>
                <Col md={4} className="pb-1">
                    <SchedualCalendar onDateRangeChange={handleDateRangeChange} />
                </Col>
            </Row>

            <AddSchedualModal handleModal={handleAddNewModal} open={openAddNewModal} />
            <EditSchedualModal
                handleModal={handleEditModal}
                open={openEditModal}
                scheduleData={selectedRow} // پاس دادن داده‌های ردیف
            />
        </Fragment>
    );
};

export default AdminSchedualList;