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
import { useQueryClient } from "@tanstack/react-query";
import "@styles/react/libs/react-select/_react-select.scss";
import CourseListModal from "./CourseListModal";
import useGetCourseDetailInfo from "../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import GetCourseGroup from "../../../@core/Services/Api/Courses/CourseDetail/GetCourseGroup";
import {
  useAddNewSchedule,
  useAddNewScheduleAuto,
  useEditForming,
  useEditLockToRaise,
} from "../../../@core/Services/Api/Schedual/Schedual";
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
  forming: false,
  lockToRaise: false,
};

const schema = yup.object().shape({
  courseId: yup.string().required("لطفا دوره معتبر انتخاب کنید"),
  groupId: yup.string().required("لطفا گروه دوره را انتخاب کنید"),
  startDate: yup.string().required("لطفا تاریخ شروع را وارد کنید"),
  startTime: yup
    .string()
    .required("لطفا ساعت شروع را وارد کنید")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "فرمت ساعت شروع نامعتبر است"),
  endTime: yup
    .string()
    .required("لطفا ساعت پایان را وارد کنید")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "فرمت ساعت پایان نامعتبر است"),
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
  const [scheduleId, setScheduleId] = useState(null);
  const [scheduleType, setScheduleType] = useState("manual");

  const queryClient = useQueryClient();

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

  const { mutate: editFroming, isLoading: isEditingFroming } = useEditForming();
  const { mutate: editLockToRiase, isLoading: isEditingLockToRiase } = useEditLockToRaise();
  const { mutate: addNewScheduleManual } = useAddNewSchedule(selectedCourseId);
  const { mutate: addNewScheduleAuto } = useAddNewScheduleAuto(selectedCourseId);

  const { data: courseDetail, isLoading: courseDetailLoading, error: courseDetailError } =
    useGetCourseDetailInfo(selectedCourseId || null);

  const {
    data: courseGroup,
    isLoading: courseGroupLoading,
    error: courseGroupError,
  } = GetCourseGroup(courseDetail?.courseId, courseDetail?.teacherId);

  const convertTimeToDouble = (timeString) => {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    return hours + minutes / 60;
  };

  useEffect(() => {
    if (courseGroupLoading) return;
    if (!courseGroupError && courseGroup) {
      setCourseGroups(courseGroup);
    } else if (courseGroupError) {
      setCourseGroups([]);
      toast.error("خطا در دریافت گروه‌ها: " + courseGroupError.message);
    }
  }, [courseGroup, courseGroupLoading, courseGroupError]);

  useEffect(() => {
    let timeout;
    if (courseDetailLoading || courseGroupLoading) {
      timeout = setTimeout(() => {
        toast.error("بارگذاری اطلاعات بیش از حد طول کشید. لطفا دوباره تلاش کنید.");
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [courseDetailLoading, courseGroupLoading]);

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
      setIsSubmitting(false);
      return;
    }

    if (!courseDetail?.teacherId) {
      setError("submit", {
        type: "manual",
        message: "شناسه استاد یافت نشد. لطفاً دوره را دوباره انتخاب کنید.",
      });
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);

    const basePayload = {
      courseGroupId: Number(data.groupId),
      startDate: new Date(data.startDate).toISOString().split("T")[0],
      startTime: convertTimeToDouble(data.startTime),
      endTime: convertTimeToDouble(data.endTime),
      weekNumber: Number(data.weekNumber),
      rowEffect: Number(data.rowEffect),
      forming: data.forming,
      lockToRaise: data.lockToRaise,
      teacherId: Number(courseDetail.teacherId), // استفاده از courseDetail.teacherId
    };

    const payload = scheduleType === "auto"
      ? [{ ...basePayload, data: {} }]
      : basePayload;

    console.log(`Payload sent to API (${scheduleType}):`, payload);

    if (isNaN(basePayload.startTime) || isNaN(basePayload.endTime)) {
      setError("startTime", {
        type: "manual",
        message: "ساعت شروع یا پایان نامعتبر است",
      });
      setIsSubmitting(false);
      return;
    }

    if (basePayload.startTime < 8 || basePayload.startTime > 20) {
      setError("startTime", {
        type: "manual",
        message: "ساعت شروع باید بین 8 صبح و 8 شب باشد",
      });
      setIsSubmitting(false);
      return;
    }

    if (basePayload.endTime <= basePayload.startTime) {
      setError("endTime", {
        type: "manual",
        message: "ساعت پایان باید بعد از ساعت شروع باشد",
      });
      setIsSubmitting(false);
      return;
    }

    const validGroup = courseGroups.find((group) => group.groupId === Number(data.groupId));
    if (!validGroup) {
      setError("groupId", {
        type: "manual",
        message: "گروه دوره نامعتبر است",
      });
      setIsSubmitting(false);
      return;
    }

    const mutate = scheduleType === "manual" ? addNewScheduleManual : addNewScheduleAuto;

    mutate(payload, {
      onSuccess: (response) => {
        console.log(`API response (${scheduleType}):`, response);
        toast.success("بازه زمانی با موفقیت اضافه شد!");

        if (scheduleType === "auto" && response?.responseShow) {
          const expectedCount = basePayload.rowEffect;
          const actualCount = response.responseShow.length;
          if (actualCount !== expectedCount) {
            toast("تعداد برنامه‌های ایجاد‌شده با تعداد درخواستی مطابقت ندارد.", {
              type: "warning",
            });
          }

          const formingMismatch = response.responseShow.some(
            (schedule) => schedule.forming !== basePayload.forming
          );
          if (formingMismatch) {
            toast("وضعیت برگزاری در برنامه‌های ایجاد‌شده با مقدار درخواستی مطابقت ندارد.", {
              type: "warning",
            });
          }

          const hasInvalidIds = response.responseShow.every(
            (schedule) => schedule.id === "00000000-0000-0000-0000-000000000000"
          );
          if (hasInvalidIds) {
            toast("شناسه‌های برنامه‌های ایجاد‌شده نامعتبر هستند. لطفاً با پشتیبانی تماس بگیرید.", {
              type: "warning",
            });
          }
        }

        queryClient.invalidateQueries(["schedules", data.courseId]);

        setIsSubmitting(false);
        setScheduleId(
          scheduleType === "auto"
            ? response?.responseShow?.[0]?.id || response?.id
            : response?.id
        );
        reset(defaultValues);
        setCourseGroups([]);
        setSelectedCourseId(null);
        handleModal();
      },
      onError: (error) => {
        console.log(`API error (${scheduleType}):`, error);
        setIsSubmitting(false);
        if (error?.ErrorMessage) {
          error.ErrorMessage.forEach((msg) => toast.error(msg));
          setError("submit", {
            type: "manual",
            message: error.ErrorMessage.join(", "),
          });
        } else {
          toast.error(`خطا در افزودن بازه زمانی: ${error.message || "خطای ناشناخته"}`);
          setError("submit", {
            type: "manual",
            message: error.message || "خطای ناشناخته",
          });
        }
      },
    });
  };

  const onDiscard = () => {
    clearErrors();
    reset(defaultValues);
    setCourseGroups([]);
    setSelectedCourseId(null);
    handleModal();
  };

  const handleCourseSelect = (courseId, courseName) => {
    if (!courseId) {
      setError("courseId", { type: "manual", message: "دوره معتبر انتخاب نشده است" });
      return;
    }
    setSelectedCourseId(courseId);
    setValue("courseId", courseId, { shouldValidate: true });
    setValue("courseName", courseName, { shouldValidate: true });
    setValue("groupId", "", { shouldValidate: true });
  };

  const handleFormingChange = (isChecked) => {
    if (!scheduleId) {
      setValue("forming", isChecked, { shouldValidate: true });
      return;
    }

    const payload = { id: scheduleId, active: isChecked };
    console.log("Payload sent to editFroming API:", payload);

    editFroming(payload, {
      onSuccess: (response) => {
        console.log("API response from editFroming:", response);
        toast.success("وضعیت برگزاری با موفقیت به‌روزرسانی شد!");
        setValue("forming", isChecked, { shouldValidate: true });
        queryClient.invalidateQueries(["schedules", selectedCourseId]);
      },
      onError: (error) => {
        console.log("API error from editFroming:", error);
        toast.error("خطا در به‌روزرسانی وضعیت برگزاری: " + error.message);
        setValue("forming", !isChecked, { shouldValidate: true });
      },
    });
  };

  const handleLockToRaiseChange = (isChecked) => {
    if (!scheduleId) {
      setValue("lockToRaise", isChecked, { shouldValidate: true });
      return;
    }

    const payload = { id: scheduleId, active: isChecked };
    console.log("Payload sent to editLockToRiase API:", payload);

    editLockToRiase(payload, {
      onSuccess: (response) => {
        console.log("API response from editLockToRiase:", response);
        toast.success("وضعیت حضور و غیاب با موفقیت به‌روزرسانی شد!");
        setValue("lockToRaise", isChecked, { shouldValidate: true });
        queryClient.invalidateQueries(["schedules", selectedCourseId]);
      },
      onError: (error) => {
        console.log("API error from editLockToRiase:", error);
        toast.error("خطا در به‌روزرسانی وضعیت حضور و غیاب: " + error.message);
        setValue("lockToRaise", !isChecked, { shouldValidate: true });
      },
    });
  };

  const groupOptions = courseGroups.map((group) => ({
    value: group.groupId,
    label: group.groupName,
  }));

  return (
    <Fragment>
      <Modal
        isOpen={open}
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
                      id="homeAddress"
                      name="addressBundles"
                      value="manual"
                      className="custom-option-item-check"
                      checked={scheduleType === "manual"}
                      onChange={() => setScheduleType("manual")}
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
                      name="addressBundles"
                      value="auto"
                      className="custom-option-item-check"
                      checked={scheduleType === "auto"}
                      onChange={() => setScheduleType("auto")}
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
                    name="forming"
                    control={control}
                    render={({ field }) => (
                      <div className="form-check form-switch form-check-primary me-25">
                        <Input
                          type="switch"
                          id="billing-switch"
                          name="billing-switch"
                          checked={field.value}
                          onChange={(e) => handleFormingChange(e.target.checked)}
                          disabled={isEditingFroming}
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
                    name="lockToRaise"
                    control={control}
                    render={({ field }) => (
                      <div className="form-check form-switch form-check-primary me-25">
                        <Input
                          type="switch"
                          id="attendance-switch"
                          name="attendance-switch"
                          checked={field.value}
                          onChange={(e) => handleLockToRaiseChange(e.target.checked)}
                          disabled={isEditingLockToRiase}
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