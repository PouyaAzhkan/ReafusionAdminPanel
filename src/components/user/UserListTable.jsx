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

// Sample static data
const data = [
  {
    id: 1,
    userName: "متین",
    img: "https://i.pravatar.cc/40?img=1",
    post: "Developer",
    email: "john@example.com",
    sex: "مرد",
    registerDate: "2023-01-15",
    status: 1,
  },
];

const statusMap = {
  1: { title: "فعال", color: "light-success" },
  2: { title: "غیرفعال", color: "light-danger" },
};

const columns = [
  {
    name: "نام کاربر",
    sortable: true,
    selector: (row) => row.userName,
    cell: (row) => (
      <div className="d-flex align-items-center">
        <img
          className="me-1 rounded-circle"
          src={row.img}
          alt="avatar"
          height="32"
          width="32"
        />
        <span className="fw-bold">{row.userName}</span>
      </div>
    ),
  },
  { name: "نفش", selector: (row) => row.post, sortable: true },
  { name: "ایمیل", selector: (row) => row.email, sortable: true, minWidth: "250px" },
  { name: "جنسیت", selector: (row) => row.sex, sortable: true, width: "100px" },
  { name: "تاریخ عضویت", selector: (row) => row.registerDate, sortable: true, minWidth: "200px" },
  {
    name: "وضعیت",
    selector: (row) => row.status,
    cell: (row) => (
      <span className={`badge badge-${statusMap[row.status].color}`}>
        {statusMap[row.status].title}
      </span>
    ),
    width: "100px"
  },
  {
    name: "عملیت",
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

const UserListTable = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 7;

  const filteredData = data.filter(
    (item) =>
      item.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.post.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <Fragment>
      <Card>
        <Row className="justify-content-between mx-0 py-2">
          <Col
            className="d-flex align-items-center"
            md="6"
            sm="12"
          >
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

          <Col
            className="d-flex align-items-center justify-content-end"
            md="6"
            sm="12"
          >
            <Button className="" color="primary">
              <span className="align-middle">اضافه کردن کابر جدید</span>
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
