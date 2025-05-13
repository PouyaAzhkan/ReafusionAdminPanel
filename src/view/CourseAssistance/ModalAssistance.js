import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { GetUserList, useUserDetail } from "../../@core/Services/Api/UserManage/user";
import useGetCourseDetailInfo from "../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import ModalApiItemList from "../../@core/components/modal/ModalApiItemList";
import UserTableItems from "./UserTableItems";
import CourseTableItems from "./CourseTableItems";
import AddAssistance from "../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/AddAssistance";
import EditAssistance from "../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/EditAssistance";
import GetCourses from "../../@core/Services/Api/Courses/CourseList/GetCourses";

// تعریف فیلدهای ویرایش دستیار
const EditAssistanceFields = (data) => ({
  userId: data?.userId || "",
  courseId: data?.courseId || "",
  id: data?.id || "", // شامل آیدی برای عملیات ویرایش
});

const ModalAssistance = ({ toggle, isOpen, data, refetch, courseId, section }) => {
  const [initialValues, setInitialValues] = useState({});
  const [userid, setUserId] = useState(initialValues?.userId);
  const [courseid, setCourseId] = useState(courseId); // پیش‌فرض آیدی دوره
  const [chooseUserModal, setChooseUserModal] = useState(false);
  const [chooseCourseModal, setChooseCourseModal] = useState(false);

  // جایگزینی ریداکس با useState
  const [userParams, setUserParams] = useState({
    PageNumber: 1,
    RowsOfPage: 5,
    Query: "",
  });
  const [courseParams, setCourseParams] = useState({
    PageNumber: 1,
    RowsOfPage: 6,
    Query: "",
  });

  // فرم با react-hook-form
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    defaultValues: initialValues,
  });

  // فراخوانی‌های API
  const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseDetailInfo(courseid || courseId);
  const { data: user, isLoading: userLoading, error: userError } = useUserDetail(userid || initialValues?.userId);
  const { data: users, isLoading: usersLoading, error: usersError } = GetUserList(userParams);
  const { data: courses, isLoading: coursesLoading, error: coursesError } = GetCourses(courseParams);

  // هوک‌ها برای جهش‌های API
  const { mutate: AddAssistances } = AddAssistance();
  const { mutate: EditAssistances } = EditAssistance();

  // دیباگ داده‌های API
  useEffect(() => {
    console.log("داده‌های دوره‌ها:", courses);
    console.log("پارامترهای دوره:", courseParams);
    if (coursesError) {
      console.error("خطای API دوره‌ها:", coursesError);
    }
  }, [courses, courseParams, coursesError]);

  // تنظیم مقادیر اولیه فرم
  useEffect(() => {
    const values = EditAssistanceFields(data);
    setInitialValues(values);
    reset({ ...values, courseId: courseId }); // پیش‌فرض آیدی دوره
    setCourseId(courseId); // تنظیم آیدی دوره به‌صورت پیش‌فرض
    console.log("مقادیر اولیه تنظیم شدند:", { ...values, courseId });
  }, [data, courseId, reset]);

  // به‌روزرسانی مقادیر فرم
  useEffect(() => {
    if (userid !== undefined) {
      setValue("userId", userid);
      console.log("آیدی کاربر به‌روزرسانی شد:", userid);
    }
    if (courseid !== undefined) {
      setValue("courseId", courseid);
      console.log("آیدی دوره به‌روزرسانی شد:", courseid);
    }
  }, [userid, courseid, setValue]);

  // ارسال فرم
  const onSubmit = (values) => {
    const dataToSend = {
      courseId: courseid || courseId, // استفاده از courseid در صورت تغییر، در غیر این صورت courseId
      userId: userid, // آیدی کاربر انتخاب‌شده
    };
    const datatoSend2 = {
      courseId: courseid || courseId, // استفاده از courseid در صورت تغییر، در غیر این صورت courseId
      userId: userid,
      id: initialValues?.id, // اطمینان از وجود آیدی برای ویرایش
    };

    console.log("داده‌های ارسالی به API:", section === "create" ? dataToSend : datatoSend2);

    if (section === "create") {
      AddAssistances(dataToSend, {
        onSuccess: (data) => {
          alert("منتور با موفقیت اضافه شد");
          console.log("پاسخ API:", data);
          refetch?.();
          if (typeof toggle === "function") toggle();
        },
        onError: (error) => {
          alert("خطا در افزودن منتور");
          console.error("خطای API:", error);
        },
      });
    } else if (section === "update") {
      console.log("ارسال داده‌های ویرایش:", datatoSend2); // دیباگ داده‌ها
      EditAssistances(datatoSend2, {
        onSuccess: (data) => {
          console.log("داده‌های ارسالی برای ویرایش:", datatoSend2);
          console.log("پاسخ ویرایش:", data);
          alert("منتور با موفقیت ویرایش شد");
          refetch?.();
          if (typeof toggle === "function") toggle();
        },
        onError: (error) => {
          alert("خطا در ویرایش منتور");
          console.error("خطای ویرایش:", error);
        },
      });
    }
  };

  // سربرگ‌های جدول
  const userTableHeader = ["", "نام کاربر", "ایمیل کاربر", "عملیات"];
  const courseTableHeader = ["", "نام دوره", "وضعیت", "عملیات"];

  // تغییر وضعیت مودال‌ها
  const toggleChooseUserModal = () => {
    console.log("تغییر وضعیت مودال کاربر");
    setChooseUserModal((prev) => !prev);
  };

  const toggleChooseCourseModal = () => {
    console.log("تغییر وضعیت مودال دوره، وضعیت فعلی:", chooseCourseModal);
    try {
      setChooseCourseModal((prev) => !prev);
    } catch (error) {
      console.error("خطا در تغییر وضعیت مودال دوره:", error);
    }
  };

  // مدیریت صفحه‌بندی و جستجو
  const handlePageNumber = (page) => {
    setUserParams((prev) => ({ ...prev, PageNumber: page }));
    console.log("صفحه‌بندی کاربران به‌روزرسانی شد:", page);
  };

  const handleQuery = (query) => {
    setUserParams((prev) => ({ ...prev, Query: query }));
    console.log("جستجوی کاربران به‌روزرسانی شد:", query);
  };

  const handleCoursePageNumber = (page) => {
    setCourseParams((prev) => ({ ...prev, PageNumber: page }));
    console.log("صفحه‌بندی دوره‌ها به‌روزرسانی شد:", page);
  };

  const handleQueryCourse = (query) => {
    setCourseParams((prev) => ({ ...prev, Query: query }));
    console.log("جستجوی دوره‌ها به‌روزرسانی شد:", query);
  };

  // بررسی وضعیت بارگذاری و خطا
  if (userLoading || courseLoading || usersLoading || coursesLoading) {
    return <p>در حال بارگذاری...</p>;
  }
  if (userError || courseError || usersError || coursesError) {
    console.error("خطاها:", { userError, courseError, usersError, coursesError });
    return <p>خطا در بارگذاری داده‌ها</p>;
  }

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        toggle={() => {
          console.log("مودال اصلی تغییر وضعیت داد");
          toggle();
        }}
        className="modal-dialog-centered modal-base"
      >
        <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">{section === "create" ? "ایجاد منتور" : "ویرایش اطلاعات منتور"}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-1 pt-75">
              <Col md="12" className="mb-1">
                <Label className="form-label" for="userId">
                  منتور
                </Label>
                <Controller
                  name="userId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="userId"
                      placeholder="یک منتور انتخاب کنید"
                      onClick={toggleChooseUserModal}
                      value={(user?.fName || "") + " " + (user?.lName || "")}
                      invalid={!!errors.userId}
                      readOnly
                      className="form-control text-primary cursor-pointer"
                    />
                  )}
                />
                <FormFeedback>{errors.userId?.message}</FormFeedback>
              </Col>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="courseId">
                  دوره
                </Label>
                <Controller
                  name="courseId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="courseId"
                      placeholder="یک دوره انتخاب کنید"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("کلیک روی ورودی دوره");
                        toggleChooseCourseModal();
                      }}
                      value={course?.title || ""}
                      invalid={!!errors.courseId}
                      readOnly
                      className="form-control text-primary cursor-pointer"
                    />
                  )}
                />
                <FormFeedback>{errors.courseId?.message}</FormFeedback>
              </Col>
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="primary">
                  {section === "create" ? "ایجاد" : "ویرایش"}
                </Button>
                <Button type="reset" color="secondary" outline onClick={toggle}>
                  لغو
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
      <ModalApiItemList
        PageNumber={userParams.PageNumber}
        RowsOfPage={userParams.RowsOfPage}
        isOpen={chooseUserModal}
        toggle={toggleChooseUserModal}
        handlePageNumber={handlePageNumber}
        handleQuery={handleQuery}
        modalTitle={"انتخاب منتور"}
        totalCount={users?.totalCount || 0}
        headerTitles={userTableHeader}
      >
        {users?.listUser?.map((item, index) => (
          <UserTableItems
            item={item}
            toggle={toggleChooseUserModal}
            key={index}
            setId={setUserId}
          />
        ))}
      </ModalApiItemList>
      {console.log("رندر مودال دوره، باز بودن:", chooseCourseModal)}
      <ModalApiItemList
        PageNumber={courseParams.PageNumber}
        RowsOfPage={courseParams.RowsOfPage}
        isOpen={chooseCourseModal}
        toggle={toggleChooseCourseModal}
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
              toggle={toggleChooseCourseModal}
              key={index}
              setId={setCourseId}
            />
          ))
        )}
      </ModalApiItemList>
    </Fragment>
  );
};

export default ModalAssistance;