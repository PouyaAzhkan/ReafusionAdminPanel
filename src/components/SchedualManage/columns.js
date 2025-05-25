import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { MoreVertical, Airplay, Edit, Check, X } from "react-feather";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { gregorian } from "react-date-object/calendars/gregorian";
import { getCourseGroupDetail } from "../../@core/Services/Api/Schedual/Schedual";

export const columns = (handleEditModal, toggleForming, toggleLockToRaise, handleSessionModal) => [
    {
        name: "نام گروه",
        width: "150px",
        sortField: "title",
        selector: (row) => row.courseGroupId,
        cell: (row) => {
            const { data, isLoading, isError } = getCourseGroupDetail(row.courseGroupId);
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
        width: "150px",
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
        width: "100px",
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
                                handleSessionModal(row);
                            }}
                        >
                            <Airplay size={14} className="me-50" />
                            <span className="align-middle">نمایش جلسه</span>
                        </DropdownItem>
                        <DropdownItem
                            tag="span"
                            className="w-100"
                            onClick={(e) => {
                                e.preventDefault();
                                handleEditModal(row);
                            }}
                        >
                            <Edit size={14} className="me-50" />
                            <span className="align-middle">ویرایش</span>
                        </DropdownItem>
                        <DropdownItem
                            tag="span"
                            className="w-100"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleForming(row);
                            }}
                        >
                            {row.forming ? <X size={14} className="me-50" /> : <Check size={14} className="me-50" />}
                            <span className="align-middle">
                                {row.forming ? "غیرفعال کردن دوره" : "فعال کردن دوره"}
                            </span>
                        </DropdownItem>
                        <DropdownItem
                            tag="span"
                            className="w-100"
                            onClick={(e) => {
                                e.preventDefault();
                                toggleLockToRaise(row);
                            }}
                        >
                            {row.lockToRaise ? <X size={14} className="me-50" /> : <Check size={14} className="me-50" />}
                            <span className="align-middle">
                                {row.lockToRaise ? "غیرفعال کردن حضور" : "فعال کردن حضور"}
                            </span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
        ),
    },
];