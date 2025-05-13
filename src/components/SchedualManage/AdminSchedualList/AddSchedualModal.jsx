import { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Label,
  Input,
  Modal,
  Button,
  CardBody,
  CardText,
  CardTitle,
  ModalBody,
  ModalHeader,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Check, X, Edit, Server } from "react-feather";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/react-select/_react-select.scss";
import CourseListModal from "./CourseListModal";
import useGetCourseDetailInfo from "../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import GetCourseGroup from "../../../@core/Services/Api/Courses/CourseDetail/GetCourseGroup";

const defaultValues = {
  startDate: "",
  courseId: "",
  courseName: "",
  groupId: "", // برای گروه دوره
};

const AddSchedualModal = ({ open, handleModal }) => {
  const [show, setShow] = useState(false);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseGroups, setCourseGroups] = useState([]);

  const {
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // دریافت اطلاعات دوره
  const { data: courseDetail, isLoading: courseDetailLoading, error: courseDetailError } = useGetCourseDetailInfo(selectedCourseId);

  // استخراج courseId و teacherId
  const courseId = courseDetail && !courseDetailLoading && !courseDetailError
    ? courseDetail.courseId || selectedCourseId
    : null;
  const teacherId = courseDetail && !courseDetailLoading && !courseDetailError
    ? courseDetail.teacherId || null
    : null;

  // دریافت گروه‌های دوره
  const {
    data: courseGroup,
    isLoading: courseGroupLoading,
    error: courseGroupError,
  } = GetCourseGroup(courseId, teacherId);

  // لاگ برای دیباگ
  useEffect(() => {
    if (selectedCourseId && courseId && teacherId) {
      console.log("courseId و teacherId ارسال‌شده به GetCourseGroup:", { courseId, teacherId });
    }
  }, [selectedCourseId, courseId, teacherId]);

  // به‌روزرسانی گروه‌ها
  useEffect(() => {
    if (!courseGroupLoading && !courseGroupError && courseGroup) {
      setCourseGroups(courseGroup);
      console.log("گروه‌های دریافت‌شده:", courseGroup);
    } else if (courseGroupError) {
      console.error("خطا در دریافت گروه‌ها:", courseGroupError);
      setCourseGroups([]);
    }
  }, [courseGroup, courseGroupLoading, courseGroupError]);

  const onSubmit = (data) => {
    if (data.courseId && data.startDate && data.groupId) {
      setShow(false);
      reset();
      console.log("داده‌های فرم:", data);
    } else {
      if (!data.courseId) {
        setError("courseId", { type: "manual", message: "لطفا دوره معتبر انتخاب کنید" });
      }
      if (!data.startDate) {
        setError("startDate", { type: "manual", message: "لطفا تاریخ شروع را وارد کنید" });
      }
      if (!data.groupId) {
        setError("groupId", { type: "manual", message: "لطفا گروه دوره را انتخاب کنید" });
      }
    }
  };

  const onDiscard = () => {
    clearErrors();
    setShow(false);
    reset();
    setCourseGroups([]);
    setSelectedCourseId(null);
  };

  // مدیریت انتخاب دوره
  const handleCourseSelect = (courseId, courseName) => {
    setSelectedCourseId(courseId);
    setValue("courseId", courseId, { shouldValidate: true });
    setValue("courseName", courseName, { shouldValidate: true });
    setValue("groupId", ""); // ریست گروه
    setCourseModalOpen(false);
  };

  // فرمت گزینه‌های Select برای گروه‌ها
  const groupOptions = courseGroups.map((group) => ({
    value: group.groupId,
    label: group.groupName,
  }));

  return (
    <Fragment>
      <Modal
        isOpen={open}
        onClosed={onDiscard}
        toggle={handleModal}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent"
          toggle={handleModal}
        ></ModalHeader>
        <ModalBody className="pb-5 px-sm-4 mx-50">
          <h1 className="address-title text-center mb-1">افزودن بازه زمانی جدید</h1>
          <Row
            tag="form"
            className="gy-1 gx-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Col xs={12}>
              <Row className="custom-options-checkable">
                <Col md={6} className="mb-md-0 mb-2">
                  <Input
                    type="radio"
                    defaultChecked
                    id="homeAddress"
                    name="addressRadio"
                    value="homeAddress"
                    className="custom-option-item-check"
                  />
                  <label
                    className="custom-option-item px-2 py-1"
                    htmlFor="homeAddress"
                  >
                    <span className="d-flex align-items-center">
                      <Edit className="font-medium-4 me-50" />
                      <span className="custom-option-item-title h4 fw-bolder mb-0">
                        افزودن دستی
                      </span>
                    </span>
                  </label>
                </Col>
                <Col md={6} className="mb-md-0 mb-2">
                  <Input
                    type="radio"
                    id="officeAddress"
                    name="addressRadio"
                    value="officeAddress"
                    className="custom-option-item-check"
                  />
                  <label
                    className="custom-option-item px-2 py-1"
                    htmlFor="officeAddress"
                  >
                    <span className="d-flex align-items-center">
                      <Server className="font-medium-4 me-50" />
                      <span className="custom-option-item-title h4 fw-bolder mb-0">
                        افزودن خودکار
                      </span>
                    </span>
                  </label>
                </Col>
              </Row>
            </Col>
            <Col xs={12} md={6}>
              <Label className="form-label" for="courseId">
                انتخاب دوره
              </Label>
              <Controller
                name="courseName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="courseId"
                    placeholder="دوره"
                    readOnly
                    onClick={() => setCourseModalOpen(true)}
                    invalid={errors.courseId && true}
                    {...field}
                  />
                )}
              />
              <Controller
                name="courseId"
                control={control}
                render={() => <input type="hidden" />}
              />
              {errors.courseId && (
                <FormFeedback>{errors.courseId.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6}>
              <Label className="form-label" for="groupId">
                گروه دوره
              </Label>
              <Controller
                name="groupId"
                control={control}
                render={({ field }) => (
                  <Select
                    id="groupId"
                    isClearable
                    className="react-select"
                    classNamePrefix="select"
                    options={groupOptions}
                    theme={selectThemeColors}
                    placeholder="یک گروه انتخاب کنید"
                    onChange={(option) => field.onChange(option ? option.value : "")}
                    value={groupOptions.find((option) => option.value === field.value) || null}
                    isDisabled={!courseGroups.length || courseGroupLoading}
                    invalid={errors.groupId && true}
                  />
                )}
              />
              {errors.groupId && (
                <FormFeedback>{errors.groupId.message}</FormFeedback>
              )}
              {courseGroupLoading && <small>در حال بارگذاری گروه‌ها...</small>}
              {courseGroupError && <small className="text-danger">خطا در بارگذاری گروه‌ها</small>}
            </Col>
            <Col xs={12} md={6}>
              <Label className="form-label" for="startTime">
                ساعت شروع
              </Label>
              <Input id="startTime" type="time" />
            </Col>
            <Col xs={12} md={6}>
              <Label className="form-label" for="endTime">
                ساعت پایان
              </Label>
              <Input id="endTime" type="time" />
            </Col>
            <Col xs={12} md={6}>
              <Label className="form-label" for="weekNumber">
                تعداد در هفته
              </Label>
              <Input id="weekNumber" type="number" />
            </Col>
            <Col xs={12} md={6}>
              <Label className="form-label" for="rowEffect">
                تعداد کل جلسات
              </Label>
              <Input id="rowEffect" type="number" />
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="startDate">
                تاریخ شروع
              </Label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    id="startDate"
                    type="date"
                    invalid={errors.startDate && true}
                    {...field}
                  />
                )}
              />
              {errors.startDate && (
                <FormFeedback>{errors.startDate.message}</FormFeedback>
              )}
            </Col>
            <Col xs={12} md={6}>
              <div className="d-flex align-items-center">
                <div className="form-check form-switch form-check-primary me-25">
                  <Input
                    type="switch"
                    id="billing-switch"
                    name="billing-switch"
                  />
                  <Label className="form-check-label" htmlFor="billing-switch">
                    <span className="switch-icon-left">
                      <Check size={14} />
                    </span>
                    <span className="switch-icon-right">
                      <X size={14} />
                    </span>
                  </Label>
                </div>
                <label
                  className="form-check-label fw-bolder"
                  htmlFor="billing-switch"
                >
                  وضعیت برگزاری
                </label>
              </div>
            </Col>
            <Col xs={12} md={6}>
              <div className="d-flex align-items-center">
                <div className="form-check form-switch form-check-primary me-25">
                  <Input
                    type="switch"
                    id="attendance-switch"
                    name="attendance-switch"
                  />
                  <Label className="form-check-label" htmlFor="attendance-switch">
                    <span className="switch-icon-left">
                      <Check size={14} />
                    </span>
                    <span className="switch-icon-right">
                      <X size={14} />
                    </span>
                  </Label>
                </div>
                <label
                  className="form-check-label fw-bolder"
                  htmlFor="attendance-switch"
                >
                  وضعیت حضور و غیاب
                </label>
              </div>
            </Col>
            <Col className="text-center" xs={12}>
              <Button type="submit" className="me-1 mt-2" color="primary">
                افزودن بازه زمانی
              </Button>
              <Button
                type="reset"
                className="mt-2"
                color="secondary"
                outline
                onClick={handleModal}
              >
                انصراف
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <CourseListModal
        isOpen={courseModalOpen}
        toggle={() => setCourseModalOpen(false)}
        onSelectCourse={handleCourseSelect}
      />
    </Fragment>
  );
};

export default AddSchedualModal;