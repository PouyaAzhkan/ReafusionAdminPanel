import React, { useRef, useState, useMemo } from "react";
import '../../../../assets/scss/PanelResponsive/CoursesPages.scss';
import Tabs from "./Tabs";
import Select from "react-select";
import { Row, Col, Input, TabContent, TabPane, Button, ButtonGroup } from "reactstrap";
import CourseCard from "./CourseCard";
import CustomPagination2 from "../../../../@core/components/pagination/index2";
import StatsHorizontal2 from "../../../../@core/components/widgets/stats/StatsHorizontal2";
import { Activity, Book, Clock, Grid, Menu, X } from "react-feather";
import CourseReserve from "./tabs/CourseReserve";
import PaymentOfCourses from "./tabs/PaymentOfCourses";
import ActiveOrDeActive from "../../../../@core/Services/Api/Courses/CourseList/ActiveDectiveCourses";
import GetCourses from "../../../../@core/Services/Api/Courses/CourseList/GetCourses";
import { getItem } from "../../../../@core/Services/common/storage.services";
import GetUserImage from "../../../../@core/Services/Api/chat/GetAdminImage";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("1");
  const ref1 = useRef();
  const ref4 = useRef();
  const id = getItem('userId');

  // State for tab 1
  const [paramsTab1, setParamsTab1] = useState({ PageNumber: 1, RowsOfPage: 12, SortingCol: "DESC", SortType: "expire", Query: "" });
  const [sortTypeTab1, setSortTypeTab1] = useState("");
  const [priceSortTab1, setPriceSortTab1] = useState("");
  const [activeViewTab1, setActiveViewTab1] = useState("flex");

  // State for tab 4
  const [paramsTab4, setParamsTab4] = useState({ PageNumber: 1, RowsOfPage: 12, SortingCol: "DESC", SortType: "expire", Query: "" });
  const [sortTypeTab4, setSortTypeTab4] = useState("");
  const [priceSortTab4, setPriceSortTab4] = useState("");
  const [activeViewTab4, setActiveViewTab4] = useState("flex");

  const { data: GetCourse, isLoading: loading1, error: error1, refetch: refetchTab1 } = GetCourses(paramsTab1);
  const { data: userDetail, isLoading: loadingUser, error: errorUser } = GetUserImage(id);

  const toggleTab = tab => setActiveTab(tab);

  const handleSearch = (query, tab) => {
    const updateParams = prev => ({ ...prev, Query: query, PageNumber: 1 });
    tab === 1 ? setParamsTab1(updateParams) : setParamsTab4(updateParams);
    tab === 1 ? refetchTab1() : refetchTab1();
  };

  const handleDebounceSearch = (e, tab) => {
    const ref = tab === 1 ? ref1 : ref4;
    clearTimeout(ref.current);
    ref.current = setTimeout(() => handleSearch(e.target.value, tab), 1000);
  };

  const handleRowsChange = (rows, tab) => {
    const updateParams = prev => ({ ...prev, RowsOfPage: Number(rows), PageNumber: 1 });
    tab === 1 ? setParamsTab1(updateParams) : setParamsTab4(updateParams);
    tab === 1 ? refetchTab1() : refetchTab1();
  };

  const handlePagination = (page, tab) => {
    const updateParams = prev => ({ ...prev, PageNumber: page.selected + 1 });
    tab === 1 ? setParamsTab1(updateParams) : setParamsTab4(updateParams);
    tab === 1 ? refetchTab1() : refetchTab1();
  };

  const activeOrDeActive = async (boolean, id) => {
    try {
      const data = { active: boolean, id };
      await ActiveOrDeActive(data, refetchTab1);
    } catch (error) {
      console.error("Error in activeOrDeActive:", error);
    }
  };

  const sortedCoursesTab1 = useMemo(() => {
    let data = [...(GetCourse?.courseDtos || [])];
    if (sortTypeTab1 === "reserveCount") data.sort((a, b) => b.reserveCount - a.reserveCount);
    else if (sortTypeTab1 === "nearest") data.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
    if (priceSortTab1 === "highestPrice") data.sort((a, b) => b.cost - a.cost);
    else if (priceSortTab1 === "lowestPrice") data.sort((a, b) => a.cost - b.cost);
    return data;
  }, [GetCourse?.courseDtos, sortTypeTab1, priceSortTab1]);

  const sortedCoursesTab4 = useMemo(() => {
    let data = [...(GetCourse?.courseDtos || [])];
    // نرمال‌سازی نام کامل برای مقایسه
    const fullName = userDetail ? `${userDetail.fName} ${userDetail.lName}`.trim().replace(/-/g, ' ') : "";
    const query = paramsTab4.Query ? paramsTab4.Query.trim().toLowerCase() : "";
    
    data = data.filter(course => {
      // حذف خط تیره و نرمال‌سازی نام کامل مدرس
      const teacherFullName = course.fullName ? course.fullName.trim().replace(/-/g, ' ') : "";
      // بررسی تطابق نام کامل مدرس
      const matchesFullName = teacherFullName.toLowerCase() === fullName.toLowerCase();
      // بررسی تطابق عبارت جستجو با نام دوره
      const matchesQuery = query ? course.title?.toLowerCase().includes(query) : true;
      return matchesFullName && matchesQuery;
    });
    
    // اعمال مرتب‌سازی
    if (sortTypeTab4 === "reserveCount") data.sort((a, b) => b.reserveCount - a.reserveCount);
    else if (sortTypeTab4 === "nearest") data.sort((a, b) => new Date(b.lastUpdate) - new Date(a.lastUpdate));
    if (priceSortTab4 === "highestPrice") data.sort((a, b) => b.cost - a.cost);
    else if (priceSortTab4 === "lowestPrice") data.sort((a, b) => a.cost - b.cost);
    
    return data;
  }, [GetCourse?.courseDtos, sortTypeTab4, priceSortTab4, userDetail, paramsTab4.Query]);

  // نمایش اسکلتون در حالت لودینگ
  if (loading1 || loadingUser) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="courses-container">
          <div className="courseStatus gap-2">
            {/* اسکلتون برای کارت‌های آماری */}
            <Skeleton height={100} width={300} borderRadius={8} className="shadow-sm" />
            <Skeleton height={100} width={300} borderRadius={8} className="shadow-sm" />
            <Skeleton height={100} width={300} borderRadius={8} className="shadow-sm" />
            <Skeleton height={100} width={300} borderRadius={8} className="shadow-sm" />
          </div>
          <div className="courseList w-100 mt-2">
            {/* اسکلتون برای تب‌ها */}
            <Skeleton height={50} width="40%" borderRadius={8} className="mb-2 shadow-sm" />
            <div className="tab-content">
              {/* اسکلتون برای فیلترها */}
              <Col className="w-100 d-flex justify-content-between flex-wrap align-items-center mb-2">
                <div className="d-flex gap-1 align-items-center">
                  <Skeleton width={60} height={38} borderRadius={6} />
                  <Skeleton width={100} height={38} borderRadius={6} className="react-select" />
                </div>
                <div className="d-flex gap-1 align-items-center">
                  <Skeleton width={60} height={38} borderRadius={6} />
                  <Skeleton width={120} height={38} borderRadius={6} className="react-select" />
                  <Skeleton width={120} height={38} borderRadius={6} className="react-select" />
                  <Skeleton width={80} height={38} borderRadius={6} />
                </div>
              </Col>
              {/* اسکلتون برای ورودی جستجو */}
              <Skeleton height={38} width="100%" borderRadius={6} className="mt-2" />
              {/* اسکلتون برای کارت‌های دوره */}
              <div className="mt-2 d-flex justify-content-around flex-wrap gap-2">
                {[...Array(9)].map((_, index) => (
                  <Skeleton
                    key={index}
                    height={350}
                    width={350}
                    borderRadius={8}
                    className="shadow-sm"
                    style={{ marginBottom: "16px" }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error1 || errorUser) return <div className="text-center text-danger">خطا در بارگذاری داده‌ها</div>;

  const totalCount = GetCourse?.totalCount || 0;
  const expiredCount = (GetCourse?.courseDtos || []).filter(course => course.isdelete).length;
  const activeCount = (GetCourse?.courseDtos || []).filter(course => course.isActive).length;
  const expiredData = (GetCourse?.courseDtos || []).filter(course => course.isExpire).length;

  const renderViewToggle = (tab) => (
    <div className="d-flex justify-content-start">
      <ButtonGroup>
        <Button
          color="primary"
          outline={tab === 1 ? activeViewTab1 !== "flex" : activeViewTab4 !== "flex"}
          onClick={() => (tab === 1 ? setActiveViewTab1("flex") : setActiveViewTab4("flex"))}
        >
          <Grid size={15}/>
        </Button>
        <Button
          color="primary"
          outline={tab === 1 ? activeViewTab1 !== "table" : activeViewTab4 !== "table"}
          onClick={() => (tab === 1 ? setActiveViewTab1("table") : setActiveViewTab4("table"))}
        >
          <Menu size={15}/>
        </Button>
      </ButtonGroup>
    </div>
  );

  const renderFilters = (tab) => (
    <Col className="w-100 d-flex justify-content-between flex-wrap align-items-center">
      <div className="d-flex gap-1 align-items-center">
        <label>نمایش:</label>
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={{ label: tab === 1 ? paramsTab1.RowsOfPage : paramsTab4.RowsOfPage, value: tab === 1 ? paramsTab1.RowsOfPage : paramsTab4.RowsOfPage }}
          onChange={e => handleRowsChange(e.value, tab)}
          options={[{ value: 12, label: 12 }, { value: 24, label: 24 }, { value: 48, label: 48 }]}
        />
      </div>
      <div className="d-flex gap-1 align-items-center">
        <div>مرتب‌سازی:</div>
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={{ value: "", label: "همه" }}
          onChange={e => {
            tab === 1 ? setSortTypeTab1(e.value) : setSortTypeTab4(e.value);
            tab === 1 ? setParamsTab1(p => ({ ...p, PageNumber: 1 })) : setParamsTab4(p => ({ ...p, PageNumber: 1 }));
            tab === 1 ? refetchTab1() : refetchTab1();
          }}
          options={[{ value: "", label: "همه" }, { value: "reserveCount", label: "بیشترین رزروشده" }, { value: "nearest", label: "جدیدترین" }]}
        />
        <Select
          className="react-select"
          classNamePrefix="select"
          defaultValue={{ value: "", label: "همه" }}
          onChange={e => {
            tab === 1 ? setPriceSortTab1(e.value) : setPriceSortTab4(e.value);
            tab === 1 ? setParamsTab1(p => ({ ...p, PageNumber: 1 })) : setParamsTab4(p => ({ ...p, PageNumber: 1 }));
            tab === 1 ? refetchTab1() : refetchTab1();
          }}
          options={[{ value: "", label: "همه" }, { value: "highestPrice", label: "گران‌ترین" }, { value: "lowestPrice", label: "ارزان‌ترین" }]}
        />
        {renderViewToggle(tab)}
      </div>
    </Col>
  );

  return (
    <div className="courses-container">
      <div className="courseStatus gap-2">
        <StatsHorizontal2 icon={<Book size={21} />} color="primary" stats={totalCount} statTitle="مجموع تمام دوره‌ها" />
        <StatsHorizontal2 icon={<Activity size={21} />} color="success" stats={activeCount} statTitle="دوره‌های فعال" />
        <StatsHorizontal2 icon={<Clock size={20} />} color="warning" stats={expiredData} statTitle="دوره‌های غیرفعال" />
        <StatsHorizontal2 icon={<X size={20} />} color="danger" stats={expiredCount} statTitle="دوره‌های حذف‌شده" />
      </div>
      <div className="courseList w-100">
        <Tabs className="mb-2" activeTab={activeTab} toggleTab={toggleTab} />
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            {renderFilters(1)}
            <Input type="text" onChange={e => handleDebounceSearch(e, 1)} placeholder="جستجو در دوره‌ها" className="mt-2" />
            <CourseCard activeView={activeViewTab1} item={sortedCoursesTab1} handleActiveOrDetective={activeOrDeActive} />
            <CustomPagination2 total={totalCount} rowsPerPage={paramsTab1.RowsOfPage} current={paramsTab1.PageNumber} handleClickFunc={page => handlePagination(page, 1)} />
          </TabPane>
          <TabPane tabId="2">
            <CourseReserve />
          </TabPane>
          <TabPane tabId="3">
            <PaymentOfCourses courseId={GetCourse?.courseDtos?.[0]?.courseId} />
          </TabPane>
          <TabPane tabId="4">
            {renderFilters(4)}
            <Input type="text" onChange={e => handleDebounceSearch(e, 4)} placeholder="جستجو در دوره‌ها" className="mt-2" />
            <CourseCard activeView={activeViewTab4} item={sortedCoursesTab4} handleActiveOrDetective={activeOrDeActive} />
            <CustomPagination2 total={sortedCoursesTab4.length} rowsPerPage={paramsTab4.RowsOfPage} current={paramsTab4.PageNumber} handleClickFunc={page => handlePagination(page, 4)} />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

export default Courses;