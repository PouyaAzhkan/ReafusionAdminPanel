import React, { useRef, useState, useMemo } from "react";
import '../../../../assets/scss/PanelResponsive/CoursesPages.scss'
import Tabs from "./Tabs";
import Select from "react-select";
import { Row, Col, Input, TabContent, TabPane } from "reactstrap";
import CourseCard from "./CourseCard";
import CustomPagination from "../../../../@core/components/pagination";
import StatsHorizontal from "../../../../@core/components/widgets/stats/StatsHorizontal";
import { Activity, Book, Clock, X } from "react-feather";
import CourseReserve from "./tabs/CourseReserve";
import PaymentOfCourses from "./tabs/PaymentOfCourses";
import ActiveOrDeActive from "../../../../@core/Services/Api/Courses/CourseList/ActiveDectiveCourses";
import GetCourses from "../../../../@core/Services/Api/Courses/CourseList/GetCourses";
import GetTeacherCourses from "../../../../@core/Services/Api/Courses/CourseList/GetTeacherCourses";

const Courses = () => {
  const [activeView, setActiveView] = useState("flex");
  const [activeTab, setActiveTab] = useState("1");
  const [sortType, setSortType] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const ref = useRef();
  const [params, setParams] = useState({
    PageNumber: 1,
    RowsOfPage: 12, // Explicitly set to 12
    SortingCol: "DESC",
    SortType: "Expire",
    Query: "",
  });

  // Fetch courses and teacher courses
  const { data: GetCourse, isLoading: GetCourseLoading, error: GetCourseError, refetch } = GetCourses(params);
  const { data: GetTeacherCourse, isLoading: GetTeacherCourseLoading, error: GetTeacherCourseError } = GetTeacherCourses();

  // Debugging logs
  console.log("API Params:", params);
  console.log("API Response Length:", GetCourse?.courseDtos?.length);
  console.log("Total Count:", GetCourse?.totalCount);

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  // Handle search query with debounce
  const handleSearchQuery = (query) => {
    setParams((prev) => ({ ...prev, Query: query, PageNumber: 1 }));
    refetch();
  };

  const handleSetSearch = (e) => {
    clearTimeout(ref.current);
    const timeOut = setTimeout(() => {
      handleSearchQuery(e.target.value);
    }, 1500);
    ref.current = timeOut;
  };

  // Handle rows per page change
  const handleRowsChange = (rows) => {
    console.log("Rows Per Page:", rows);
    setParams((prev) => {
      const newParams = { ...prev, RowsOfPage: Number(rows), PageNumber: 1 };
      console.log("Updated Params:", newParams);
      return newParams;
    });
    refetch();
  };

  // Handle pagination
  const handlePagination = (page) => {
    const newPageNumber = page.selected + 1;
    console.log("New Page Number:", newPageNumber);
    setParams((prev) => ({ ...prev, PageNumber: newPageNumber }));
    refetch();
  };

  // Handle course activation/deactivation
  const activeOrDeActive = async (boolean, id) => {
    try {
      const data = { active: boolean, id };
      await ActiveOrDeActive(data, refetch);
    } catch (error) {
      console.error("Error in activeOrDeActive:", error);
    }
  };

  // Sort course data with useMemo for performance
  const sortedCourseData = useMemo(() => {
    let data = [...(GetCourse?.courseDtos || [])];
    console.log("Sorted Course Data Length:", data.length);
    if (sortType === "reserveCount") {
      data.sort((a, b) => b.reserveCount - a.reserveCount);
    } else if (sortType === "nearest") {
      data.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
    }
    if (priceSort === "highestPrice") {
      data.sort((a, b) => b.cost - a.cost);
    } else if (priceSort === "lowestPrice") {
      data.sort((a, b) => a.cost - b.cost);
    }
    return data;
  }, [GetCourse?.courseDtos, sortType, priceSort]);

  // Handle loading and error states
  if (GetCourseLoading || GetTeacherCourseLoading) {
    return <div className="text-center">در حال بارگذاری...</div>;
  }

  if (GetCourseError || GetTeacherCourseError) {
    return <div className="text-center text-danger">خطا در بارگذاری داده‌ها</div>;
  }

  // Calculate stats
  const CourseCount = GetCourse?.courseDtos || [];
  const expiredCount = CourseCount.filter((course) => course.isdelete === true).length;
  const ActiveData = CourseCount.filter((course) => course.isActive === true).length;
  const ExpireData = CourseCount.filter((course) => course.isExpire === true).length;

  return (
    <div className="courses-container d-flex gap-2">
      <div className="courseStatus w-25">
        <StatsHorizontal icon={<Book size={21} />} color="primary" stats={GetCourse?.totalCount || 0} statTitle="مجموع تمام دوره‌ها" />
        <StatsHorizontal icon={<Activity size={21} />} color="success" stats={ActiveData} statTitle="دوره‌های فعال" />
        <StatsHorizontal icon={<Clock size={20} />} color="warning" stats={ExpireData} statTitle="دوره‌های غیرفعال" />
        <StatsHorizontal icon={<X size={20} />} color="danger" stats={expiredCount} statTitle="دوره‌های حذف‌شده" />
      </div>
      <div className="courseList w-75">
        <Tabs className="mb-2" activeTab={activeTab} toggleTab={toggleTab} />
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Col className="w-100 d-flex justify-content-between flex-wrap">
              <div className="d-flex gap-1 align-items-center">
                <label>نمایش:</label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  defaultValue={{ label: params.RowsOfPage, value: params.RowsOfPage }}
                  onChange={(selectCountPage) => handleRowsChange(selectCountPage.value)}
                  options={[
                    { value: 12, label: 12 },
                    { value: 24, label: 24 },
                    { value: 48, label: 48 },
                  ]}
                />
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>مرتب‌سازی:</div>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  defaultValue={{ value: "", label: "همه" }}
                  onChange={(e) => {
                    setSortType(e.value);
                    setParams((prev) => ({ ...prev, PageNumber: 1 }));
                    refetch();
                  }}
                  options={[
                    { value: "", label: "همه" },
                    { value: "reserveCount", label: "بیشترین رزروشده" },
                    { value: "nearest", label: "جدیدترین" },
                  ]}
                />
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  defaultValue={{ value: "", label: "همه" }}
                  onChange={(e) => {
                    setPriceSort(e.value);
                    setParams((prev) => ({ ...prev, PageNumber: 1 }));
                    refetch();
                  }}
                  options={[
                    { value: "", label: "همه" },
                    { value: "highestPrice", label: "گران‌ترین" },
                    { value: "lowestPrice", label: "ارزان‌ترین" },
                  ]}
                />
              </div>
            </Col>
            <div className="d-flex gap-1 align-items-center mt-2">
              <Input type="text" onChange={handleSetSearch} placeholder="جستجو در دوره‌ها" />
            </div>
            <Col className="w-100" md={9} xs={12}>
              <CourseCard activeView={activeView} item={sortedCourseData} handleActiveOrDetective={activeOrDeActive} />
              <CustomPagination
                total={GetCourse?.totalCount || 0}
                rowsPerPage={params.RowsOfPage}
                current={params.PageNumber}
                handleClickFunc={handlePagination}
              />
            </Col>
          </TabPane>
          <TabPane tabId="2">
            <CourseReserve />
          </TabPane>
          <TabPane tabId="3">
            <PaymentOfCourses courseId={GetCourse?.courseDtos?.[0]?.courseId} />
          </TabPane>
          <TabPane tabId="4">
            <Col className="w-100 d-flex justify-content-between flex-wrap">
              <div className="d-flex gap-1 align-items-center">
                <label>نمایش:</label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  defaultValue={{ label: params.RowsOfPage, value: params.RowsOfPage }}
                  onChange={(selectCountPage) => handleRowsChange(selectCountPage.value)}
                  options={[
                    { value: 12, label: 12 },
                    { value: 24, label: 24 },
                    { value: 48, label: 48 },
                  ]}
                />
              </div>
              <div className="d-flex gap-1 align-items-center">
                <div>مرتب‌سازی:</div>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  defaultValue={{ value: "", label: "همه" }}
                  onChange={(e) => {
                    setSortType(e.value);
                    setParams((prev) => ({ ...prev, PageNumber: 1 }));
                    refetch();
                  }}
                  options={[
                    { value: "", label: "همه" },
                    { value: "reserveCount", label: "بیشترین رزروشده" },
                    { value: "nearest", label: "جدیدترین" },
                  ]}
                />
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  defaultValue={{ value: "", label: "همه" }}
                  onChange={(e) => {
                    setPriceSort(e.value);
                    setParams((prev) => ({ ...prev, PageNumber: 1 }));
                    refetch();
                  }}
                  options={[
                    { value: "", label: "همه" },
                    { value: "highestPrice", label: "گران‌ترین" },
                    { value: "lowestPrice", label: "ارزان‌ترین" },
                  ]}
                />
              </div>
            </Col>
            <div className="d-flex gap-1 align-items-center mt-2">
              <Input type="text" onChange={handleSetSearch} placeholder="جستجو در دوره‌ها" />
            </div>
            <CourseCard className='courseCard' activeView={activeView} item={GetTeacherCourse?.teacherCourseDtos || []} />
            <CustomPagination
              total={GetTeacherCourse?.totalCount || 0}
              rowsPerPage={params.RowsOfPage}
              current={params.PageNumber}
              handleClickFunc={handlePagination}
            />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default Courses;