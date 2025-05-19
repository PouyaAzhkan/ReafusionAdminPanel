import { Card, CardHeader } from "reactstrap";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import Avatar from "@components/avatar";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useState } from "react";
import { Link } from "react-router-dom";
import emptyImg from "../../../assets/images/emptyImage/CourseImage.jpg";

export const columns = [
  {
    name: "عنوان دوره",
    selector: (row) => row.title,
    sortable: true,
    width: "300px",
    cell: (row) => (
      <div className="d-flex align-items-center">
        <Link to={`/course-details/${row.courseId}`}>
          <Avatar
            className="me-1"
            img={row.tumbImageAddress || emptyImg}
            alt=""
            imgWidth="32"
          />
        </Link>
        <div className="d-flex flex-column">
          <Link
            to={`/course-details/${row.courseId}`}
            className="fw-bolder text-truncate text-dark"
          >
            {row.title || "نام ندارد"}
          </Link>
        </div>
      </div>
    ),
  },
  {
    name: "آخرین بروزرسانی",
    selector: (row) => row.lastUpdate,
    sortable: true,
    width: "150px",
    cell: (row) => {
      const date = new Date(row.lastUpdate).toLocaleDateString("fa-IR");
      return <span>{date}</span>;
    },
  },
  {
    name: "توضیحات",
    selector: (row) => row.describe,
    sortable: false,
    width: "350px",
  },
];

const UserCourses = ({ userCourses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  // Handle page change
  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  // Calculate the page count
  const pageCount = Math.ceil(userCourses.length / rowsPerPage);

  // Slice data based on pagination
  const paginatedCourses = userCourses.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card>
      <CardHeader tag="h4">دوره های تایید شده</CardHeader>
      <div className="react-dataTable user-view-account-projects">
        <DataTable
          noHeader
          responsive
          columns={columns}
          data={paginatedCourses}
          className="react-dataTable mb-1"
          sortIcon={<ChevronDown size={10} />}
        />
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePagination}
          containerClassName="pagination"
          activeClassName="active"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item prev"
          previousLinkClassName="page-link"
          nextClassName="page-item next"
          nextLinkClassName="page-link"
        />
      </div>
    </Card>
  );
};

export default UserCourses;
