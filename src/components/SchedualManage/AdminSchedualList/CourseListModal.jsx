import { Fragment, useState } from "react";
import { Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import GetCourses from "./../../../@core/Services/Api/Courses/CourseList/GetCourses";
import ModalApiItemList from "./../../../@core/components/modal/ModalApiItemList";
import CourseTableItems from "./../../../view/CourseAssistance/CourseTableItems";

const CourseListModal = ({ isOpen, toggle, onSelectCourse, selectedCourseId }) => {
    const [courseParams, setCourseParams] = useState({
        PageNumber: 1,
        RowsOfPage: 6,
        Query: "",
    });

    const { data: courses, isLoading: coursesLoading, error: coursesError } = GetCourses(courseParams);

    const handleQueryCourse = (query) => {
        setCourseParams((prev) => ({ ...prev, Query: query, PageNumber: 1 }));
    };

    const handleCoursePageNumber = (page) => {
        setCourseParams((prev) => ({ ...prev, PageNumber: page }));
    };

    const handleSelectCourse = (id, title) => {
        onSelectCourse(id, title);
        toggle();
    };

    const courseTableHeader = ["", "نام دوره", "وضعیت", "عملیات"];

    if (coursesLoading) return <p>در حال بارگذاری...</p>;
    if (coursesError) {
        console.error("خطای API دوره‌ها:", coursesError);
        return <p>خطا در بارگذاری دوره‌ها</p>;
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
                        {!courses?.courseDtos ? (
                            <tr>
                                <td colSpan="4" className="text-center py-2">دوره‌ها بارگذاری نشدند</td>
                            </tr>
                        ) : !Array.isArray(courses.courseDtos) || courses.courseDtos.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center py-2">هیچ دوره‌ای یافت نشد</td>
                            </tr>
                        ) : (
                            courses.courseDtos.map((item, index) => (
                                <CourseTableItems
                                    item={item}
                                    toggle={toggle}
                                    key={item.id || index}
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

export default CourseListModal;