import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Button, Card, Col, Row, Table } from "reactstrap";
import headerTable from "../../../@core/constants/course-user/HeaderTable";
import ModalApiItemList from "../../../@core/components/modal/ModalApiItemList";
import TableItems from "./TableItems";
import CourseTableItems from "../../../view/CourseAssistance/CourseTableItems";
import GetCoursesList from "../../../@core/Services/Api/Courses/ManangeCourseUser/GetCourseList";
import GetCourseUserList from "../../../@core/Services/Api/Courses/ManangeCourseUser/GetCourseUserList";
import CustomPagination2 from "../../../@core/components/pagination/index2";
import HeaderTable2 from "../../../@core/components/table-list/HeaderTable2";
import debounce from "lodash/debounce";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ManageCourseUser = () => {
  const [params, setParams] = useState({
    CourseId: null,
    PageNumber: 1,
    RowsOfPage: 10,
  });
  const [courseParams, setCourseParams] = useState({
    PageNumber: 1,
    RowsOfPage: 6,
    Query: "",
  });
  const searchTermRef = useRef("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [courseId, setCourseId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userList, isLoading: userLoading, error: userError } = GetCourseUserList({
    ...params,
    CourseId: courseId || params.CourseId,
  });

  const { data: courses, isLoading: courseLoading, error: courseError } = GetCoursesList({
    ...courseParams,
  });

  const debouncedSearch = useCallback(
    debounce((value) => {
      setAppliedSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const handleSearch = useCallback(
    (value) => {
      searchTermRef.current = value;
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const rowsPerPage = params.RowsOfPage;
  const totalItems = userList?.length || 0;

  const handleMovePage = useCallback((page) => {
    const newPage = page.selected + 1;
    setCurrentPage(newPage);
    setParams((prev) => ({ ...prev, PageNumber: newPage }));
  }, []);

  const handleRows = useCallback((e) => {
    const value = parseInt(e.currentTarget.value);
    setParams((prev) => ({ ...prev, RowsOfPage: value, PageNumber: 1 }));
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    if (courseId) {
      setParams((prev) => ({ ...prev, CourseId: courseId }));
    }
  }, [courseId]);

  const [chooseCourseModal, setChooseCourseModal] = useState(false);
  const toggleChooseCourseModal = useCallback(() => setChooseCourseModal((prev) => !prev), []);

  const courseTableHeader = ["", "نام دوره", "وضعیت", "عملیات"];

  const filteredAndSortedUsers = useMemo(() => {
    if (!userList) return [];
    return userList
      .filter((item) =>
        item.studentName.toLowerCase().includes(appliedSearchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOrder === "asc") return a.studentName.localeCompare(b.studentName);
        else return b.studentName.localeCompare(a.studentName);
      });
  }, [userList, appliedSearchTerm, sortOrder]);

  const paginatedUsers = useMemo(() => {
    return filteredAndSortedUsers.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredAndSortedUsers, currentPage, rowsPerPage]);

  // نمایش اسکلتون در حالت لودینگ
  if (userLoading || courseLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="app-user-list">
          <Row>
            <Col sm="12">
              <Card className="overflow-hidden">
                <div className="react-dataTable">
                  {/* اسکلتون برای هدر جدول */}
                  <div className="d-flex align-items-center mb-2">
                    <Skeleton width={300} height={38} borderRadius={6} style={{ marginRight: "14px" }} />
                    <Skeleton width={120} height={38} borderRadius={6} />
                  </div>
                  {/* اسکلتون برای جدول */}
                  <Table hover>
                    <thead className="text-center">
                      <tr>
                        {headerTable.map((_, index) => (
                          <th key={index} className="px-0">
                            <Skeleton width="80%" height={20} borderRadius={4} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, index) => (
                        <tr key={index}>
                          {headerTable.map((_, colIndex) => (
                            <td key={colIndex} className="text-center">
                              <Skeleton width="90%" height={20} borderRadius={4} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </SkeletonTheme>
    );
  }

  if (userError || courseError) {
    return <p>خطا در بارگذاری اطلاعات: {userError?.message || courseError?.message}</p>;
  }

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