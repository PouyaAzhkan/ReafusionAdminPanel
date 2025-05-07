import { Link } from "react-router-dom";
import {
  Badge,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { Archive, MoreVertical, Trash2 } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import api from "../../../@core/Services/interceptor/index";

export const columns = (setDeleteModal, setUserToDelete) => [
  {
    name: "کاربر",
    sortable: true,
    width: "170px",
    sortField: "userName",
    selector: (row) => {
      // Fetch user data directly in the column
      const { data: user, isLoading, isError } = useQuery({
        queryKey: ["UserDetail", row.userId],
        queryFn: async () => {
          try {
            const response = await api.get(`/User/UserDetails/${row.userId}`);
            return response || {};
          } catch (error) {
            console.error(`Error fetching user ${row.userId} in columns:`, error);
            return {};
          }
        },
        enabled: !!row.userId,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });


      if (isLoading) return "در حال بارگذاری...";
      if (isError || !user || !user.id) return "بدون نام";

      return `${user.fName || ""} ${user.lName || ""}`.trim() || user.userName || "بدون نام";
    },
    cell: (row) => {
      // Same logic for rendering the cell
      const { data: user, isLoading, isError } = useQuery({
        queryKey: ["UserDetail", row.userId],
        queryFn: async () => {
          try {
            const response = await api.get(`/User/UserDetails/${row.userId}`);
            return response || {};
          } catch (error) {
            console.error(`Error fetching user ${row.userId} in columns:`, error);
            return {};
          }
        },
        enabled: !!row.userId,
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      });

      const displayName = isLoading
        ? "در حال بارگذاری..."
        : isError || !user || !user.id
        ? "بدون نام"
        : `${user.fName || ""} ${user.lName || ""}`.trim() || user.userName || "بدون نام";

      return (
        <Link
          to={`/users/view/${row.userId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{displayName}</span>
        </Link>
      );
    },
  },
  {
    name: "عنوان شغل",
    width: "150px",
    sortable: true,
    sortField: "jobTitle",
    selector: (row) => row.jobTitle,
    cell: (row) => <span className="text-truncate">{row.jobTitle || "—"}</span>,
  },
  {
    name: "توضیحات شغل",
    width: "200px",
    sortable: true,
    sortField: "aboutJob",
    selector: (row) => row.aboutJob,
    cell: (row) => <span className="text-truncate">{row.aboutJob || "—"}</span>,
  },
  {
    name: "تاریخ شروع و پایان",
    width: "220px",
    sortable: true,
    sortField: "workStartDate",
    selector: (row) => row.workStartDate,
    cell: (row) => (
      <span className="text-capitalize">
        از {row.workStartDate?.split("T")[0] || "—"} تا{" "}
        {row.workEndDate?.split("T")[0] || "—"}
      </span>
    ),
  },
  {
    name: "شرکت",
    width: "150px",
    sortable: true,
    sortField: "companyName",
    selector: (row) => row.companyName,
    cell: (row) => (
      <span className="text-truncate">{row.companyName || "—"}</span>
    ),
  },
  {
    name: "نمایش",
    width: "100px",
    sortable: true,
    sortField: "showInFirstPage",
    selector: (row) => row.showInFirstPage,
    cell: (row) => (
      <Badge
        color={row.showInFirstPage ? "light-success" : "light-danger"}
        pill
      >
        {row.showInFirstPage ? "فعال" : "غیرفعال"}
      </Badge>
    ),
  },
  {
    name: "وضعیت کار",
    width: "120px",
    sortable: true,
    sortField: "inWork",
    selector: (row) => row.inWork,
    cell: (row) => (
      <Badge color={row.inWork ? "light-success" : "light-danger"} pill>
        {row.inWork ? "فعال" : "غیرفعال"}
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
          <DropdownMenu>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => e.preventDefault()}
            >
              <Archive size={14} className="me-50" />
              <span className="align-middle">ویرایش</span>
            </DropdownItem>
            <DropdownItem
              tag="a"
              href="/"
              className="w-100"
              onClick={(e) => {
                e.preventDefault();
                setDeleteModal(true);
                setUserToDelete(row.id);
              }}
            >
              <Trash2 size={14} className="me-50" />
              <span className="align-middle">حذف</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
  },
];