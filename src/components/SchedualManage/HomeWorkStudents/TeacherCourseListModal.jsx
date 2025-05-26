import { Fragment, useState } from "react";
import { Input, Modal, ModalBody, ModalHeader, Button } from "reactstrap";
import ModalApiItemList from "./../../../@core/components/modal/ModalApiItemList";
import GetTeacherCourses from "../../../@core/Services/Api/Courses/CourseList/GetTeacherCourses";
import TeacherCourseTableItems from "./TeacherCourseTableItems";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

const TeacherCourseListModal = ({ isOpen, toggle, onSelectCourse, selectedCourseId }) => {
    const [courseParams, setCourseParams] = useState({
        PageNumber: 1,
        RowsOfPage: 10,
        Query: "",
        SortingCol: "",
        SortType: "",
    });

    const { data: courses, isLoading: coursesLoading, error: coursesError, refetch } = GetTeacherCourses(courseParams);

    console.log("داده‌های دریافت‌شده:", courses); // برای دیباگ

    const handleQueryCourse = debounce((query) => {
        setCourseParams((prev) => ({ ...prev, Query: query, PageNumber: 1 }));
    }, 300);

    const handleCoursePageNumber = (page) => {
        setCourseParams((prev) => ({ ...prev, PageNumber: page }));
    };

    const handleSelectCourse = (id, title) => {
        onSelectCourse(id, title);
        toggle();
    };

    const courseTableHeader = ["تصویر", "نام دوره", "وضعیت", "عملیات"];

    if (coursesLoading) return <p>در حال بارگذاری...</p>;
    if (coursesError) {
        console.error("خطای API دوره‌ها:", coursesError);
        return (
            <div>
                <p>خطا در بارگذاری دوره‌ها: {coursesError.message}</p>
                <Button onClick={refetch}>تلاش مجدد</Button>
            </div>
        );
    }

    return (
        <Fragment>
            <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
                <ModalHeader toggle={toggle}>انتخاب دوره</ModalHeader>
                <ModalBody>
                    <Input
                        placeholder="جستجوی دوره..."
                        onChange={(e) => handleQueryCourse(e.target.value)}
                        className="mb-2"
                    />
                    <ModalApiItemList
                        PageNumber={courseParams.PageNumber}
                        RowsOfPage={courseParams.RowsOfPage}
                        isOpen={isOpen}
                        toggle={toggle}
                        handlePageNumber={handleCoursePageNumber}
                        handleQuery={handleQueryCourse}
                        modalTitle={"انتخاب دوره"}
                        totalCount={courses?.totalCount || 0}
                        headerTitles={courseTableHeader}
                    >
                        {!courses?.teacherCourseDtos ? (
                            <tr>
                                <td colSpan="4" className="text-center py-2">دوره‌ها بارگذاری نشدند</td>
                            </tr>
                        ) : !Array.isArray(courses?.teacherCourseDtos) || courses?.teacherCourseDtos.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-2">
                                    هیچ دوره‌ای یافت نشد. <Link to="/courses/new">ایجاد دوره جدید</Link>
                                </td>
                            </tr>
                        ) : (
                            courses?.teacherCourseDtos.map((item, index) => (
                                <TeacherCourseTableItems
                                    item={item}
                                    toggle={toggle}
                                    key={item.id || item.courseId || index}
                                    setId={() => handleSelectCourse(item.id || item.courseId, item.title)}
                                    isSelected={selectedCourseId === (item.id || item.courseId)}
                                />
                            ))
                        )}
                    </ModalApiItemList>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

export default TeacherCourseListModal;