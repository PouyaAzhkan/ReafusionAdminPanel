import { Fragment, useState, useEffect } from "react";
import {
    Row,
    Col,
    Card,
    Input,
    Button,
    Label,
} from "reactstrap";
import { ChevronDown } from "react-feather";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";

import toast from "react-hot-toast";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import SchedualCalendar from "../Calendar";
import UserListModal from "./UserListModal";
import EditSchedualModal from "../EditSchedualModal";
import SchedualSessionModal from "../Sessions/SchedualSessionModal";
import { columns } from "../columns";
import { getStudentSchedual, useEditForming, useEditLockToRaise } from "../../../@core/Services/Api/Schedual/Schedual";

// کامپوننت هدر سفارشی
const CustomHeader = ({ handlePerPage, rowsPerPage, handleUserListModal }) => {
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
                        <Button className="add-new-item" color="primary" onClick={handleUserListModal}>
                            انتخاب دانشجو
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

// کامپوننت اصلی
const StudentSchedualList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateRange, setDateRange] = useState({ startDate: "2020-01-01", endDate: "" });
    const [openUserListModal, setOpenUserListModal] = useState(false);
    const [openSessionModal, setOpenSessionModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedUser, setSelectedUser] = useState({ id: null, name: "" });
    const [tableData, setTableData] = useState([]);

    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];

    useEffect(() => {
        setDateRange((prev) => ({ ...prev, endDate: formattedToday }));
    }, []);

    const handleUserListModal = () => setOpenUserListModal(!openUserListModal);

    const handleSessionModal = (row) => {
        setSelectedRow(row);
        setOpenSessionModal(!openSessionModal);
    };

    const handleEditModal = (row) => {
        setSelectedRow(row);
        setOpenEditModal(!openEditModal);
    };

    const handleSelectUser = (id, name) => {
        setSelectedUser({ id, name });
        toast.success(`دانشجو ${name} انتخاب شد`);
        console.log("کاربر انتخاب‌شده:", { id, name });
    };

    const handleScheduleUpdate = (updatedData) => {
        setTableData((prevData) =>
            prevData.map((item) =>
                item.id === updatedData.id ? { ...item, ...updatedData } : item
            )
        );
    };

    const { mutate: editForming } = useEditForming();

    const { mutate: editLockToRaise } = useEditLockToRaise();

    const { data, isError, isLoading } = getStudentSchedual({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        StudentId: selectedUser.id,
    });

    const toggleForming = (row) => {
        const newStatus = !row.forming;
        editForming(
            { id: row.id, active: newStatus },
            {
                onSuccess: (response) => {
                    if (response?.success) {
                        toast.success(`حالت دوره ${newStatus ? "فعال" : "غیرفعال"} شد!`);
                        setTableData((prevData) =>
                            prevData.map((item) =>
                                item.id === row.id ? { ...item, forming: newStatus } : item
                            )
                        );
                    } else {
                        toast.error("خطا در تغییر حالت دوره");
                    }
                },
                onError: (error) => {
                    toast.error(error.message || "خطا در تغییر حالت دوره");
                },
            }
        );
    };

    const toggleLockToRaise = (row) => {
        const newStatus = !row.lockToRaise;
        editLockToRaise(
            { id: row.id, active: newStatus },
            {
                onSuccess: (response) => {
                    if (response?.success) {
                        toast.success(`حالت حضور ${newStatus ? "فعال" : "غیرفعال"} شد!`);
                        setTableData((prevData) =>
                            prevData.map((item) =>
                                item.id === row.id ? { ...item, lockToRaise: newStatus } : item
                            )
                        );
                    } else {
                        toast.error("خطا در تغییر حالت حضور");
                    }
                },
                onError: (error) => {
                    toast.error(error.message || "خطا در تغییر حالت حضور");
                },
            }
        );
    };

    useEffect(() => {
        if (isLoading) {
            toast.loading("در حال بارگذاری داده‌ها...");
            console.log("در حال ارسال درخواست به API:", {
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                StudentId: selectedUser.id,
            });
        } else {
            toast.dismiss();
        }
        if (isError) {
            toast.error("خطا در دریافت داده‌ها!");
            console.error("خطای API:", isError);
        }
        if (data) {
            setTableData(data);
            console.log("پاسخ API دریافت شد:", data);
        }
    }, [isLoading, isError, data, dateRange.startDate, dateRange.endDate, selectedUser.id]);

    const filteredData = tableData || [];

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
        console.log("تاریخ انتخاب‌شده:", { startDate, endDate });
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
                containerClassName={
                    "pagination react-paginate justify-content-end my-2 pe-1"
                }
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
                                columns={columns(handleEditModal, toggleForming, toggleLockToRaise, handleSessionModal)}
                                onSort={() => { }}
                                sortIcon={<ChevronDown />}
                                className="react-dataTable"
                                paginationComponent={CustomPagination}
                                data={paginatedData}
                                subHeaderComponent={
                                    <CustomHeader
                                        rowsPerPage={rowsPerPage}
                                        handlePerPage={handlePerPage}
                                        handleUserListModal={handleUserListModal}
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

            <UserListModal
                toggle={handleUserListModal}
                isOpen={openUserListModal}
                onSelectUser={handleSelectUser}
                selectedUserId={selectedUser.id}
            />

            <EditSchedualModal
                handleModal={handleEditModal}
                open={openEditModal}
                scheduleData={selectedRow}
                onScheduleUpdate={handleScheduleUpdate}
            />

            <SchedualSessionModal
                handleModal={handleSessionModal}
                open={openSessionModal}
                schedualData={selectedRow}
            />
        </Fragment>
    );
};

export default StudentSchedualList;