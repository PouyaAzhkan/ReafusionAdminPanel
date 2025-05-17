import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Col, Row, Table } from "reactstrap";
import { useState, useEffect } from "react";
import { handleCourseId, handleQueryCU, handleRowsOfPage, handlePageNumber } from "./store";
import headerTable from "../../../@core/constants/course-user/HeaderTable";
import ModalApiItemList from "../../../@core/components/modal/ModalApiItemList";
import { handleCoursePageNumber, handleQueryCourse } from "../../../components/ManageCourses/CourseLIst/store/CourseList";
import TableItems from "./TableItems";
import CourseTableItems from "../../../view/CourseAssistance/CourseTableItems";
import GetCoursesList from "../../../@core/Services/Api/Courses/ManangeCourseUser/GetCourseList";
import GetCourseUserList from "../../../@core/Services/Api/Courses/ManangeCourseUser/GetCourseUserList";
import CustomPagination2 from "../../../@core/components/pagination/index2";
import HeaderTable2 from "../../../@core/components/table-list/HeaderTable2";

const MnanageCourseUser = () => {
  const params = useSelector((state) => state.CourseUserSlice) || {};
  const courseParams = useSelector((state) => state.CoursesList) || {};
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [courseId, setCourseId] = useState(null);

  // Update courseId in Redux store
  useEffect(() => {
    if (courseId) {
      dispatch(handleCourseId(courseId));
    }
  }, [courseId, dispatch]);

  // Fetch user list for the selected course
  const { data: userList , isLoading: userLoading, error: UserError } = GetCourseUserList({
    ...params,
    CourseId: courseId || params.CourseId,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(params.PageNumber || 1);
  const rowsPerPage = params.RowsOfPage || 10;
  const totalItems = userList?.length || 0;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const handleMovePage = (page) => {
    const newPage = page.selected + 1; // ReactPaginate is 0-based
    setCurrentPage(newPage);
    dispatch(handlePageNumber(newPage));
  };

  // Handle RowOfPage for list
    const handleRows = (e) => {
      const value = parseInt(e.currentTarget.value);
      dispatch(handleRowsOfPage(value));
      setCurrentPage(1);
    };

  // Choose Course Modal
  const [chooseCourseModal, setChooseCourseModal] = useState(false);
  const toggleChooseCourseModal = () => setChooseCourseModal(!chooseCourseModal);

  const courseTableHeader = ["", "نام دوره", "وضعیت", "عملیات"];

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

  // Get All Courses
  const { data: courses, isLoading: CourseLoading, error: CourseError} = GetCoursesList({ ...courseParams, RowsOfPage: 6 });

  if (userLoading || CourseLoading) return <p>در حال بارگزاری اطلاعات</p>
  if (UserError || CourseError) return <p>خطا در بارگزرای اطلاعات</p>

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
                  handleSearch={(value) => setSearchTerm(value)}
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
        PageNumber={courseParams.PageNumber || 1}
        RowsOfPage={courseParams.RowsOfPage || 6}
        isOpen={chooseCourseModal}
        toggle={toggleChooseCourseModal}
        handlePageNumber={handleCoursePageNumber}
        handleQuery={handleQueryCourse}
        modalTitle={"دوره را انتخاب کنید"}
        totalCount={courses?.totalCount || 0}
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

export default MnanageCourseUser;