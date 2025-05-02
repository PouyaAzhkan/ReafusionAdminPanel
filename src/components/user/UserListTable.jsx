import { Fragment, useState } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import {
  ChevronDown,
  Plus,
  MoreVertical,
  Edit,
} from "react-feather";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap";
import { GetUserList } from "../../@core/Services/Api/UserManage/user";
import moment from "moment-jalaali"; // Import moment-jalaali

// Status map for badges
const statusMap = {
  "True": { title: "فعال", color: "light-success" },
  "False": { title: "غیرفعال", color: "light-danger" },
};

// Mapping roles to Persian names
const roleMap = {
  "Administrator": "مدیر",
  "Teacher": "معلم",
  "Employee.Admin": "مدیر کارمند",
  "Employee.Writer": "نویسنده کارمند",
  "Student": "دانش‌آموز",
  "CourseAssistance": "کمک آموزشی",
  "TournamentAdmin": "مدیر مسابقات",
  "Referee": "داور",
  "TournamentMentor": "مربی مسابقات",
  "Support": "پشتیبانی",
};

// Table columns definition
const columns = [
  {
    name: "نام کاربر",
    sortable: true,
    selector: (row) => row.fname,
    cell: (row) => (
      <div className="d-flex align-items-center">
        <img
          className="me-1 rounded-circle"
          src={row.pictureAddress || "https://i.pravatar.cc/40?img=1"}
          alt="avatar"
          height="32"
          width="32"
        />
        <span className="fw-bold">
          {row.fname || "بدون نام"} {row.lname || "بدون نام خانوادگی"}
        </span>
      </div>
    ),
    minWidth: "200px"
  },
  {
    name: "نقش",
    selector: (row) => row.userRoles,
    cell: (row) => {
      const roles = row.userRoles?.split(",") || [];
      if (roles.length === 0) {
        return <span>بدون نقش</span>;
      }

      return (
        <div style={{ whiteSpace: "nowrap" }}>
          {roles.slice(0, 2).map((role, index) => (
            <span key={index}>
              {roleMap[role.trim()] || role}
              {index < roles.length - 1 && ", "}
            </span>
          ))}
          {roles.length > 2 && <span>...</span>}
        </div>
      );
    },
    width: "200px"
  },
  {
    name: "ایمیل",
    selector: (row) => row.gmail,
    sortable: true,
    minWidth: "250px"
  },
  {
    name: "جنسیت",
    selector: (row) => row.gender,
    sortable: true,
    cell: (row) => <span>{row.gender ? "مرد" : "زن"}</span>,
    width: "100px"
  },
  {
    name: "تاریخ عضویت",
    selector: (row) => row.insertDate,
    sortable: true,
    width: "150px",
    cell: (row) => {
      // Convert date to Persian (Jalali) format using moment-jalaali
      const date = moment(row.insertDate).format("jYYYY/jMM/jDD");
      return <span>{date}</span>;
    },
  },
  {
    name: "وضعیت",
    selector: (row) => row.active,
    cell: (row) => {
      const status = row.active === "True" ? "فعال" : "غیرفعال";
      const color = row.active === "True" ? "light-success" : "light-danger";
      
      return (
        <span className={`badge badge-${color}`}>
          {status}
        </span>
      );
    },
    width: "100px",
  },
  {
    name: "عملیات",
    allowOverflow: true,
    cell: (row) => (
      <div className="d-flex align-items-center gap-1 z-3">
        <UncontrolledDropdown>
          <DropdownToggle tag="button" className="btn btn-link p-0">
            <MoreVertical size={16} className="text-secondary" />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem>ویرایش</DropdownItem>
            <DropdownItem>حذف</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </div>
    ),
    width: "100px"
  },
];

// UserListTable component
const UserListTable = () => {
  const { data, isLoading, isError } = GetUserList(); // Fetch data from your API
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 7;

  const filteredData = (data?.listUser || []).filter(
    (item) =>
      (item.fname?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (item.gmail?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      (item.userRoles?.toLowerCase().includes(searchQuery.toLowerCase()) || '')
  );

  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={Math.ceil(filteredData.length / itemsPerPage)}
      breakLabel="..."
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName="active"
      pageClassName="page-item"
      breakClassName="page-item"
      nextLinkClassName="page-link"
      pageLinkClassName="page-link"
      breakLinkClassName="page-link"
      previousLinkClassName="page-link"
      nextClassName="page-item next-item"
      previousClassName="page-item prev-item"
      containerClassName="pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1"
    />
  );

  if (isLoading) return <div>در حال بارگذاری...</div>;
  if (isError) return <div>خطا در بارگذاری داده‌ها</div>;

  return (
    <Fragment>
      <Card>
        <Row className="justify-content-between mx-0 py-2">
          <Col className="d-flex align-items-center" md="6" sm="12">
            <Label className="me-1" for="search-input">
              جستجو :
            </Label>
            <Input
              className="dataTable-filter w-50"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchQuery}
              onChange={handleSearch}
            />
          </Col>

          <Col className="d-flex align-items-center justify-content-end" md="6" sm="12">
            <Button className="" color="primary">
              <span className="align-middle">اضافه کردن کاربر جدید</span>
              <Plus size={15} />
            </Button>
          </Col>
        </Row>
        <div className="react-dataTable react-dataTable-selectable-rows">
          <DataTable
            noHeader
            pagination
            columns={columns}
            paginationPerPage={itemsPerPage}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            paginationDefaultPage={currentPage + 1}
            data={paginatedData}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default UserListTable;
