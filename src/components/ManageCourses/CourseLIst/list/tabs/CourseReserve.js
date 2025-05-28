import React, { useRef, useState, useMemo, useEffect } from "react";
import { Table, Badge, Button, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { CourseTableTitles } from "../../../../../@core/constants/courses";
import HeaderTable from "../../../../../@core/components/header-table/HeaderTable";
import CustomPagination from "../../../../../@core/components/pagination";
import GetReservedCourses from "../../../../../@core/Services/Api/Courses/CourseList/GetReserveCourses";
import IMG from "../../../../../assets/images/element/UnKnownUser.jpg";

const CourseReserve = () => {
  const [coursesState, setCoursesState] = useState([]);
  const [PageNumber, setPageNumber] = useState(1);
  const [RowsOfPage, setRowsOfPage] = useState(18);
  const [searchQuery, setSearchQuery] = useState(""); // State برای جستجو
  const ref = useRef();

  // Getting Courses Reserved from API
  const { data, isLoading, error } = GetReservedCourses();

  useEffect(() => {
    if (data) {
      setCoursesState(data);
    }
  }, [data]);

  // فیلتر کردن داده‌ها بر اساس عبارت جستجو
  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return coursesState; // اگر عبارت جستجو خالی باشد، همه داده‌ها را برگردان
    return coursesState.filter(
      (course) =>
        course.studentName?.toLowerCase().includes(query) ||
        course.courseName?.toLowerCase().includes(query)
    );
  }, [coursesState, searchQuery]);

  // Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + RowsOfPage;

  const handleWithOutDispatch = (page) => {
    const newOffset = (page.selected * RowsOfPage) % filteredCourses.length;
    setItemOffset(newOffset);
    setPageNumber(page.selected + 1);
  };

  // مدیریت جستجو با تأخیر (debounce)
  const handleDebounceSearch = (e) => {
    const value = e.target.value;
    clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setSearchQuery(value);
      setItemOffset(0); // ریست صفحه‌بندی به صفحه اول هنگام جستجو
      setPageNumber(1);
    }, 1000);
  };

  if (isLoading) return <p>در حال بارگذاری اطلاعات</p>;
  if (error) return <p>خطا در بارگذاری اطلاعات</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <Input
        type="text"
        placeholder="جستجو در دوره‌های رزرو شده / نشده ..."
        className="mb-1 text-primary"
        onChange={handleDebounceSearch}
      />
      <Table hover>
        <HeaderTable titles={CourseTableTitles} />
        <tbody>
          {filteredCourses.slice(itemOffset, endOffset)?.map((item, index) => (
            <tr key={index}>
              <td>
                <img
                  src={IMG}
                  className="me-75 rounded-circle overflow-hidden"
                  height="30"
                  width="30"
                  alt="User"
                />
                <span className="align-middle fw-bold text-dark">{item.studentName}</span>
              </td>
              <td className="text-dark">{item.courseName}</td>
              <td>
                {item.accept === true ? (
                  <Badge pill color="light-success" className="me-1">
                    تایید شده
                  </Badge>
                ) : (
                  <Badge pill color="light-danger" className="me-1">
                    تایید نشده
                  </Badge>
                )}
              </td>
              <td>
                <Link to={`/courses/${item.courseId}`} state={{ tab: "3" }}>
                  <Button color="primary">جزئیات</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {filteredCourses.length === 0 ? (
        <p className="text-center">دوره‌ای یافت نشد</p>
      ) : (
        <CustomPagination
          total={filteredCourses.length}
          current={PageNumber - 1}
          rowsPerPage={RowsOfPage}
          handleClickFunc={handleWithOutDispatch}
        />
      )}
    </div>
  );
};

export default CourseReserve;