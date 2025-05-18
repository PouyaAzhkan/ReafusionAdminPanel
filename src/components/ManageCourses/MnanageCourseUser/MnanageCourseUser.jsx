import { useState, useEffect } from "react";
import { Button, Card, Col, Row, Table } from "reactstrap";
import headerTable from "../../../@core/constants/course-user/HeaderTable";
import ModalApiItemList from "../../../@core/components/modal/ModalApiItemList";
import TableItems from "./TableItems";
import CourseTableItems from "../../../view/CourseAssistance/CourseTableItems";
import GetCoursesList from "../../../@core/Services/Api/Courses/ManangeCourseUser/GetCourseList";
import GetCourseUserList from "../../../@core/Services/Api/Courses/ManangeCourseUser/GetCourseUserList";
import CustomPagination2 from "../../../@core/components/pagination/index2";
import HeaderTable2 from "../../../@core/components/table-list/HeaderTable2";

const ManageCourseUser = () => {
  // Local state replacing Redux
  const [params, setParams] = useState({
    CourseId: null,
    PageNumber: 1,
    RowsOfPage: 10,
    Query: "",
  });
  const [courseParams, setCourseParams] = useState({
    PageNumber: 1,
    RowsOfPage: 6,
    Query: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [courseId, setCourseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch user list for the selected course
  const { data: userList, isLoading: userLoading, error: userError } = GetCourseUserList({
    ...params,
    CourseId: courseId || params.CourseId,
  });

  // Fetch courses list
  const { data: courses, isLoading: courseLoading, error: courseError } = GetCoursesList({
    ...courseParams,
  });

  // Pagination
  const rowsPerPage = params.RowsOfPage;
  const totalItems = userList?.length || 0;

  const handleMovePage = (page) => {
    const newPage = page.selected + 1; // ReactPaginate is 0-based
    setCurrentPage(newPage);
    setParams((prev) => ({ ...prev, PageNumber: newPage }));
  };

  // Handle RowsOfPage for list
  const handleRows = (e) => {
    const value = parseInt(e.currentTarget.value);
    setParams((prev) => ({ ...prev, RowsOfPage: value, PageNumber: 1 }));
    setCurrentPage(1);
  };

  // Handle search query
  const handleSearch = (value) => {
    setSearchTerm(value);
    setParams((prev) => ({ ...prev, Query: value }));
  };

  // Handle course selection
  useEffect(() => {
    if (courseId) {
      setParams((prev) => ({ ...prev, CourseId: courseId }));
    }
  }, [courseId]);

  // Choose Course Modal
  const [chooseCourseModal, setChooseCourseModal] = useState(false);
  const toggleChooseCourseModal = () => setChooseCourseModal(!chooseCourseModal);

  const courseTableHeader = ["", "نام دوره", "وضعیت", "عملیات"];

  // Filter and sort users
  const filteredAndSortedUsers = userList
    ?.filter((item) => item.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.studentName.localeCompare(b.studentName);
      else return b.studentName.localeCompare(a.studentName);
    });

  const paginatedUsers = filteredAndSortedUsers?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Loading and error handling
  if (userLoading || courseLoading) return <p>در حال بارگزاری اطلاعات</p>;
  if (userError || courseError) return <p>خطا در بارگزرای اطلاعات</p>;

  return (
    <div className="app-user-list">
      <Row>
        <Col sm="12">
          <Card className="overflow-hidden">
            <div className="react-dataTable">
              <div className="d-flex align-items-center">
                <HeaderTable2
                  isCreate={false}
                  rowOfPage={rowsPerPage}
                  handleRowOfPage={handleRows}
                  handleSearch={handleSearch}
                />
                <Button
                  style={{ width: "120px", height: "39px", marginLeft: "14px" }}
                  color="primary"
                  onClick={toggleChooseCourseModal}
                >
                  انتخاب دوره
                </Button>
              </div>
              <Table hover>
                <thead className="text-center">
                  <tr>
                    {headerTable.map((item, index) => (
                      <th key={index} className="px-0">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers?.length > 0 ? (
                    paginatedUsers.map((item, index) => (
                      <TableItems key={item.id || index} item={item} />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={headerTable.length} className="text-center py-5 fs-1 text-primary">
                        دوره مورد نظر را انتخاب کنید
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <CustomPagination2
              total={totalItems}
              current={currentPage}
              rowsPerPage={rowsPerPage}
              handleClickFunc={handleMovePage}
            />
          </Card>
        </Col>
      </Row>
      <ModalApiItemList
        PageNumber={courseParams.PageNumber}
        RowsOfPage={courseParams.RowsOfPage}
        isOpen={chooseCourseModal}
        toggle={toggleChooseCourseModal}
        handlePageNumber={(page) =>
          setCourseParams((prev) => ({ ...prev, PageNumber: page }))
        }
        handleQuery={(query) =>
          setCourseParams((prev) => ({ ...prev, Query: query }))
        }
        modalTitle={"دوره را انتخاب کنید"}
        totalCount={courses?.totalCount}
        headerTitles={courseTableHeader}
      >
        {courses?.courseDtos?.map((item, index) => (
          <CourseTableItems
            item={item}
            toggle={toggleChooseCourseModal}
            key={index}
            setId={setCourseId}
          />
        ))}
      </ModalApiItemList>
    </div>
  );
};

export default ManageCourseUser;