import { Fragment, useState, useEffect } from "react";
import { Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import ModalApiItemList from "../../../@core/components/modal/ModalApiItemList";
import GetCourseUserList from "../../../@core/Services/Api/Courses/ManangeCourseUser/GetCourseUserList";
import UserTableItems from "./UserTableItems";
import { debounce } from "lodash";

const CourseStudentListModal = ({ isOpen, toggle, onSelectUser, selectedUserId, courseId }) => {
  const [userListParams, setUserListParams] = useState({
    CourseId: courseId || null,
    PageNumber: 1,
    RowsOfPage: 6,
  });

  useEffect(() => {
    if (courseId) {
      setUserListParams((prev) => ({ ...prev, CourseId: courseId }));
    }
  }, [courseId]);

  const { data: users, isLoading: usersLoading, error: usersError } = GetCourseUserList(userListParams, {
    enabled: !!courseId,
  });

  console.log("CourseId در CourseStudentListModal:", courseId);
  console.log("userListParams:", userListParams);

  const handleQueryUser = debounce((query) => {
    setUserListParams((prev) => ({ ...prev, Query: query, PageNumber: 1 }));
  }, 300);

  const handleUserPageNumber = (page) => {
    setUserListParams((prev) => ({ ...prev, PageNumber: page }));
  };

  const handleSelectUser = (courseUserId, studentName) => {
    if (typeof onSelectUser === "function") {
      onSelectUser(courseUserId, studentName); // ارسال courseUserId به جای id
      toggle();
    } else {
      console.warn("onSelectUser is not a function");
    }
  };

  const userTableHeader = ["نام کاربر", "وضعیت پرداخت", "اعلانات", "عملیات"];

  if (!courseId) {
    return (
      <Fragment>
        <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
          <ModalHeader toggle={toggle}>انتخاب دانشجو</ModalHeader>
          <ModalBody>
            <p className="text-center">لطفاً ابتدا یک دوره انتخاب کنید.</p>
          </ModalBody>
        </Modal>
      </Fragment>
    );
  }

  if (usersLoading) return <p>در حال بارگذاری...</p>;
  if (usersError) {
    console.error("خطای API کاربران:", usersError);
    return <p>خطا در بارگذاری کاربران: {usersError.message}</p>;
  }

  return (
    <Fragment>
      <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
        <ModalHeader toggle={toggle}>انتخاب دانشجو</ModalHeader>
        <ModalBody>
          <Input
            placeholder="جستجوی دانشجو..."
            onChange={(e) => handleQueryUser(e.target.value)}
            className="mb-2"
          />
          <ModalApiItemList
            PageNumber={userListParams.PageNumber}
            RowsOfPage={userListParams.RowsOfPage}
            isOpen={isOpen}
            toggle={toggle}
            handlePageNumber={handleUserPageNumber}
            handleQuery={handleQueryUser}
            modalTitle={"انتخاب دانشجو"}
            totalCount={users?.length || 0}
            headerTitles={userTableHeader}
          >
            {!users ? (
              <tr>
                <td colSpan="5" className="text-center py-2">
                  کاربران بارگذاری نشدند
                </td>
              </tr>
            ) : !Array.isArray(users) || users.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-2">
                  هیچ کاربری یافت نشد
                </td>
              </tr>
            ) : (
              users.map((item, index) => (
                <UserTableItems
                  item={item}
                  toggle={toggle}
                  key={item.courseUserId || index} // استفاده از courseUserId به جای id
                  onSelect={() => handleSelectUser(item.courseUserId, item.studentName)} // ارسال courseUserId
                  isSelected={selectedUserId === item.courseUserId} // مقایسه با courseUserId
                />
              ))
            )}
          </ModalApiItemList>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default CourseStudentListModal;