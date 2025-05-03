import { Fragment, useEffect, useState, useRef } from "react";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import {
  ChevronDown,
  Plus,
  MoreVertical,
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
import Select from "react-select";
import { GetUserList } from "../../@core/Services/Api/UserManage/user";
import moment from "moment-jalaali";

const statusMap = {
  "True": { title: "فعال", color: "light-success" },
  "False": { title: "غیرفعال", color: "light-danger" },
};

const roleMap = {
  "Administrator": 1,
  "Teacher": 2,
  "Employee.Admin": 3,
  "Employee.Writer": 4,
  "Student": 5,
  "CourseAssistance": 6,
  "TournamentAdmin": 7,
  "Referee": 8,
  "TournamentMentor": 9,
  "Support": 10,
};

const roleOptions = Object.keys(roleMap).map((key) => ({
  value: key,
  label: key,
}));

const statusOptions = [
  { value: "True", label: "فعال" },
  { value: "False", label: "غیرفعال" },
];

const UserListTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [tableLoading, setTableLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  const debounceTimer = useRef(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
  }, [searchQuery]);

  const { data, isLoading, isError, refetch, isFetching } = GetUserList(
    null,
    null,
    debouncedSearch,
    currentPage + 1,
    itemsPerPage,
    selectedStatus?.value,
    false,
    selectedRole ? roleMap[selectedRole.value] : null, 
    null
  );

  useEffect(() => {
    setTableLoading(true);
    const refetchData = async () => {
      await refetch();
      setTableLoading(false);
    };
    refetchData();
  }, [debouncedSearch, itemsPerPage, currentPage, selectedStatus, selectedRole]);

  // Filter data based on role
  useEffect(() => {
    if (data?.listUser) {
      const filtered = data.listUser.filter((user) => {
        if (selectedRole) {
          return user.userRoles?.includes(selectedRole.value);
        }
        return true; // If no role filter, show all users
      });
      setFilteredData(filtered);
    }
  }, [selectedRole, data]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handlePerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(0);
  };

  const handlePagination = (page) => setCurrentPage(page.selected);

  const handleRoleChange = (option) => {
    setSelectedRole(option);
    setCurrentPage(0);
  };

  const handleStatusChange = (option) => {
    setSelectedStatus(option);
    setCurrentPage(0);
  };

  const columns = [
    {
      name: "نام کاربر",
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
        return roles.length === 0 ? (
          <span>بدون نقش</span>
        ) : (
          <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>
            {roles.slice(0, 2).map((role, i) => (
              <span key={i}>
                {role}
                {i < roles.length - 1 && ", "}
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
      cell: (row) => <span>{moment(row.insertDate).format("jYYYY/jMM/jDD")}</span>,
      width: "150px"
    },
    {
      name: "وضعیت",
      selector: (row) => row.active,
      cell: (row) => {
        const isActive = row.active === "True";
        return <span className={`badge badge-${isActive ? "light-success" : "light-danger"}`}>
          {isActive ? "فعال" : "غیرفعال"}
        </span>;
      },
      width: "100px"
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
    }
  ];

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=""
      nextLabel=""
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={Math.ceil((data?.totalCount || 0) / itemsPerPage)}
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

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 py-2 justify-content-between align-items-center">
          <Col md="6" sm="12" className="d-flex flex-wrap gap-2 align-items-center">
            <Label className="mb-0" for="search-input">جستجو:</Label>
            <Input
              id="search-input"
              value={searchQuery}
              onChange={handleSearch}
              className="w-50"
              bsSize="sm"
              placeholder="نام، ایمیل یا نقش..."
            />
          </Col>

          <Col md="6" sm="12" className="d-flex justify-content-end gap-2 align-items-center">
            <Input
              type="select"
              value={itemsPerPage}
              onChange={handlePerPageChange}
              style={{ width: "80px" }}
              bsSize="sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </Input>
            <Select
              placeholder="فیلتر نقش"
              options={roleOptions}
              value={selectedRole}
              onChange={handleRoleChange}
              isClearable
              className="react-select w-25"
              classNamePrefix="select"
            />
            <Select
              placeholder="فیلتر وضعیت"
              options={statusOptions}
              value={selectedStatus}
              onChange={handleStatusChange}
              isClearable
              className="react-select w-25"
              classNamePrefix="select"
            />
            <Button color="primary">
              <span className="align-middle">اضافه کردن کاربر جدید</span>
              <Plus size={15} />
            </Button>
          </Col>
        </Row>

        <div className="react-dataTable position-relative">
          {tableLoading && (
            <div className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-50 zindex-2" style={{ top: 0, left: 0 }}>
              <span>در حال بارگذاری...</span>
            </div>
          )}
          <DataTable
            noHeader
            pagination
            paginationServer
            paginationTotalRows={filteredData.length}
            paginationPerPage={itemsPerPage}
            paginationDefaultPage={currentPage + 1}
            columns={columns}
            data={filteredData || []}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            progressPending={isLoading || tableLoading}
          />
        </div>
      </Card>
    </Fragment>
  );
};

export default UserListTable;
