import { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
  Label,
  Input,
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { Check, X, Edit, Server } from "react-feather";
import { selectThemeColors } from "@utils";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/react-select/_react-select.scss";
import CourseListModal from "./CourseListModal";
import useGetCourseDetailInfo from "../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import GetCourseGroup from "../../../@core/Services/Api/Courses/CourseDetail/GetCourseGroup";
import { useAddNewSchedule } from "../../../@core/Services/Api/Schedual/Schedual";
import toast from "react-hot-toast";

const defaultValues = {
  startDate: "",
  courseId: "",
  courseName: "",
  groupId: "",
  startTime: "",
  endTime: "",
  weekNumber: "",
  rowEffect: "",
  isActive: false,
  attendanceEnabled: false,
};

const schema = yup.object().shape({
  courseId: yup.string().required("لطفا دوره معتبر انتخاب کنید"),
  groupId: yup.string().required("لطفا گروه دوره را انتخاب کنید"),
  startDate: yup.string().required("لطفا تاریخ شروع را وارد کنید"),
  startTime: yup.string().required("لطفا ساعت شروع را وارد کنید"),
  endTime: yup.string().required("لطفا ساعت پایان را وارد کنید"),
  weekNumber: yup
    .number()
    .required("لطفا تعداد در هفته را وارد کنید")
    .min(1, "حداقل ۱ جلسه در هفته"),
  rowEffect: yup
    .number()
    .required("لطفا تعداد کل جلسات را وارد کنید")
    .min(1, "حداقل ۱ جلسه"),
});

const AddSchedualModal = ({ open, handleModal }) => {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseGroups, setCourseGroups] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    reset,
    control,
    setValue,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  // دریافت اطلاعات دوره
  const { data: courseDetail, isLoading: courseDetailLoading, error: courseDetailError } =
    useGetCourseDetailInfo(selectedCourseId || null);

  // استخراج courseId و teacherId
  const courseId =
    courseDetail && !courseDetailLoading && !courseDetailError
      ? courseDetail.courseId || selectedCourseId
      : null;
  const teacherId =
    courseDetail && !courseDetailLoading && !courseDetailError
      ? courseDetail.teacherId || null
      : null;

  // دریافت گروه‌های دوره
  const {
    data: courseGroup,
    isLoading: courseGroupLoading,
    error: courseGroupError,
  } = GetCourseGroup(courseId && teacherId ? courseId : null, teacherId);

  // هوک برای افزودن برنامه
  const { mutate: addNewSchedualData } = useAddNewSchedule(courseId);

  // لاگ برای دیباگ
  useEffect(() => {
    console.log("وضعیت مودال:", { open, selectedCourseId, courseId, teacherId });
    if (selectedCourseId && courseId && teacherId) {
      console.log("courseId و teacherId ارسال‌شده به GetCourseGroup:", { courseId, teacherId });
    }
  }, [open, selectedCourseId, courseId, teacherId]);

  // به‌روزرسانی گروه‌ها
  useEffect(() => {
    if (courseGroupLoading) return;
    if (!courseGroupError && courseGroup) {
      setCourseGroups(courseGroup);
      console.log("گروه‌های دریافت‌شده:", courseGroup);
    } else if (courseGroupError) {
      console.error("خطا در دریافت گروه‌ها:", courseGroupError);
      setCourseGroups([]);
      toast.error("خطا در دریافت گروه‌ها: " + courseGroupError.message);
    }
  }, [courseGroup, courseGroupLoading, courseGroupError]);

  // مدیریت تایم‌اوت برای بارگذاری
  useEffect(() => {
    let timeout;
    if (courseDetailLoading || courseGroupLoading) {
      timeout = setTimeout(() => {
        toast.error("بارگذاری اطلاعات بیش از حد طول کشید. لطفا دوباره تلاش کنید.");
      }, 10000); // 10 ثانیه
    }
    return () => clearTimeout(timeout);
  }, [courseDetailLoading, courseGroupLoading]);

  // نمایش خطاها
  useEffect(() => {
    if (courseDetailError) {
      toast.error("خطا در دریافت اطلاعات دوره: " + courseDetailError.message);
    }
    if (courseGroupError) {
      toast.error("خطا در دریافت گروه‌ها: " + courseGroupError.message);
    }
  }, [courseDetailError, courseGroupError]);

  const onSubmit = (data, event) => {
    event.preventDefault();
    if (!data.courseId) {
      setError("courseId", { type: "manual", message: "لطفا دوره معتبر انتخاب کنید" });
      return;
    }

    setIsSubmitting(true);

    // استفاده از زمان به‌صورت رشته خام (بدون تبدیل به اعشاری)
    const startTime = data.startTime; // مثلاً "18:00"
    const endTime = data.endTime;     // مثلاً "19:00"

    // اعتبارسنجی دستی برای محدوده زمانی
    const [startHours] = startTime.split(":").map(Number);
    const [endHours] = endTime.split(":").map(Number);
    if (startHours < 8 || startHours > 20) {
      setError("startTime", {
        type: "manual",
        message: "ساعت شروع باید بین 8 صبح و 8 شب باشد",
      });
      setIsSubmitting(false);
      return;
    }
    if (endHours < 8 || endHours > 20) {
      setError("endTime", {
        type: "manual",
        message: "ساعت پایان باید بین 8 صبح و 8 شب باشد",
      });
      setIsSubmitting(false);
      return;
    }
    if (endHours <= startHours) {
      setError("endTime", {
        type: "manual",
        message: "ساعت پایان باید بعد از ساعت شروع باشد",
      });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      courseGroupId: Number(data.groupId),
      startDate: new Date(data.startDate).toISOString(),
      startTime: startTime, // حالا به‌صورت "18:00"
      endTime: endTime,     // حالا به‌صورت "19:00"
      weekNumber: Number(data.weekNumber),
      rowEffect: Number(data.rowEffect),
      isActive: data.isActive,
      attendanceEnabled: data.attendanceEnabled,
    };

    if (teacherId) {
      payload.teacherId = Number(teacherId);
    }

    console.log("Payload ارسالی:", payload);

    addNewSchedualData(payload, {
      onSuccess: () => {
        toast.success("بازه زمانی با موفقیت اضافه شد!");
        setIsSubmitting(false);
        reset(defaultValues);
        setCourseGroups([]);
        setSelectedCourseId(null);
        handleModal();
      },
      onError: (error) => {
        setIsSubmitting(false);
        console.error("جزئیات خطا:", error);
        if (typeof error === "object" && !Array.isArray(error)) {
          Object.entries(error).forEach(([field, messages]) => {
            setError(field, { type: "manual", message: messages.join(", ") });
          });
          toast.error("لطفا خطاهای فرم را بررسی کنید.");
        } else {
          toast.error(`خطا در افزودن بازه زمانی: ${error.message || error}`);
          setError("submit", {
            type: "manual",
            message: `خطا در افزودن بازه زمانی: ${error.message || error}`,
          });
        }
      },
    });
  };

  const onDiscard = () => {
    console.log("onDiscard فراخوانی شد.");
    clearErrors();
    reset(defaultValues);
    setCourseGroups([]);
    setSelectedCourseId(null);
    handleModal();
  };

  const handleCourseSelect = (courseId, courseName) => {
    if (!courseId) {
      console.error("courseId نامعتبر است:", courseId);
      setError("courseId", { type: "manual", message: "دوره معتبر انتخاب نشده است" });
      return;
    }
    setSelectedCourseId(courseId);
    setValue("courseId", courseId, { shouldValidate: true });
    setValue("courseName", courseName, { shouldValidate: true });
    setValue("groupId", "", { shouldValidate: true });
    setCourseModalOpen(false);
  };

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
        <ModalHeader className="bg-transparent" toggle={handleModal}></ModalHeader>
        <ModalBody className="pb-5 px-sm-4 mx-50">
          <h1 className="address-title text-center mb-1">افزودن بازه زمانی جدید</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-1 gx-2">
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
                    <label className="custom-option-item px-2 py-1" htmlFor="homeAddress">
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
                    <label className="custom-option-item px-2 py-1" htmlFor="officeAddress">
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
                {errors.courseId && <FormFeedback>{errors.courseId.message}</FormFeedback>}
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
                      isDisabled={courseGroupLoading || !courseGroups.length}
                      invalid={errors.groupId && true}
                    />
                  )}
                />
                {errors.groupId && <FormFeedback>{errors.groupId.message}</FormFeedback>}
                {courseGroupLoading && <small>در حال بارگذاری گروه‌ها...</small>}
                {courseGroupError && <small className="text-danger">خطا در بارگذاری گروه‌ها</small>}
              </Col>
              <Col xs={12} md={6}>
                <Label className="form-label" for="startTime">
                  ساعت شروع
                </Label>
                <Controller
                  name="startTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="startTime"
                      type="time"
                      invalid={errors.startTime && true}
                      {...field}
                    />
                  )}
                />
                {errors.startTime && <FormFeedback>{errors.startTime.message}</FormFeedback>}
              </Col>
              <Col xs={12} md={6}>
                <Label className="form-label" for="endTime">
                  ساعت پایان
                </Label>
                <Controller
                  name="endTime"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="endTime"
                      type="time"
                      invalid={errors.endTime && true}
                      {...field}
                    />
                  )}
                />
                {errors.endTime && <FormFeedback>{errors.endTime.message}</FormFeedback>}
              </Col>
              <Col xs={12} md={6}>
                <Label className="form-label" for="weekNumber">
                  تعداد در هفته
                </Label>
                <Controller
                  name="weekNumber"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="weekNumber"
                      type="number"
                      invalid={errors.weekNumber && true}
                      {...field}
                    />
                  )}
                />
                {errors.weekNumber && <FormFeedback>{errors.weekNumber.message}</FormFeedback>}
              </Col>
              <Col xs={12} md={6}>
                <Label className="form-label" for="rowEffect">
                  تعداد کل جلسات
                </Label>
                <Controller
                  name="rowEffect"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="rowEffect"
                      type="number"
                      invalid={errors.rowEffect && true}
                      {...field}
                    />
                  )}
                />
                {errors.rowEffect && <FormFeedback>{errors.rowEffect.message}</FormFeedback>}
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
                {errors.startDate && <FormFeedback>{errors.startDate.message}</FormFeedback>}
              </Col>
              <Col xs={12} md={6}>
                <div className="d-flex align-items-center">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <div className="form-check form-switch form-check-primary me-25">
                        <Input
                          type="switch"
                          id="billing-switch"
                          name="billing-switch"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
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
                    )}
                  />
                  <label className="form-check-label fw-bolder" htmlFor="billing-switch">
                    وضعیت برگزاری
                  </label>
                </div>
              </Col>
              <Col xs={12} md={6}>
                <div className="d-flex align-items-center">
                  <Controller
                    name="attendanceEnabled"
                    control={control}
                    render={({ field }) => (
                      <div className="form-check form-switch form-check-primary me-25">
                        <Input
                          type="switch"
                          id="attendance-switch"
                          name="attendance-switch"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
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
                    )}
                  />
                  <label className="form-check-label fw-bolder" htmlFor="attendance-switch">
                    وضعیت حضور و غیاب
                  </label>
                </div>
              </Col>
              <Col className="text-center" xs={12}>
                {errors.submit && <FormFeedback className="d-block">{errors.submit.message}</FormFeedback>}
                <Button
                  type="submit"
                  className="me-1 mt-2"
                  color="primary"
                  disabled={isSubmitting || courseDetailLoading || courseGroupLoading}
                >
                  {isSubmitting ? "در حال ارسال..." : "افزودن بازه زمانی"}
                </Button>
                <Button
                  type="button"
                  className="mt-2"
                  color="secondary"
                  outline
                  onClick={onDiscard}
                >
                  انصراف
                </Button>
              </Col>
            </Row>
          </form>
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