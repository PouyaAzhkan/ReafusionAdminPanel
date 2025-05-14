import { Fragment, useState, useEffect, useMemo } from "react";
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
import { Check, X } from "react-feather";
import { selectThemeColors } from "@utils";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/react-select/_react-select.scss";
import useGetCourseDetailInfo from "../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import GetCourseGroup from "../../../@core/Services/Api/Courses/CourseDetail/GetCourseGroup";
import toast from "react-hot-toast";
import { getCourseGroupDetail, useUpdateSchedule } from "../../../@core/Services/Api/Schedual/Schedual";

const defaultValues = {
    startDate: "",
    courseId: "",
    courseName: "",
    groupId: "",
    startTime: "",
    endTime: "",
    weekNumber: "",
    rowEffect: "",
    endDate: "",
    isActive: false,
    attendanceEnabled: false,
};

const schema = yup.object().shape({
    courseId: yup.string().required("دوره معتبر نیست"),
    groupId: yup.string().required("لطفا گروه دوره را انتخاب کنید"),
    startDate: yup.string().required("لطفا تاریخ شروع را وارد کنید"),
    endDate: yup
        .string()
        .required("لطفا تاریخ پایان را وارد کنید")
        .test("is-after-startDate", "تاریخ پایان باید بعد از تاریخ شروع باشد", function (value) {
            const { startDate } = this.parent;
            return !startDate || !value || new Date(value) >= new Date(startDate);
        }),
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

const EditSchedualModal = ({ open, handleModal, scheduleData }) => {
    const [courseGroups, setCourseGroups] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
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

    // بررسی معتبر بودن scheduleData
    const isValidScheduleData = scheduleData && !Array.isArray(scheduleData) && scheduleData.courseGroupId;
    const isValidCourseGroupId = isValidScheduleData && Number.isInteger(Number(scheduleData.courseGroupId)) && Number(scheduleData.courseGroupId) > 0;

    // دیباگ
    useEffect(() => {
        if (!open) return;
        console.log("وضعیت open:", open);
        console.log("scheduleData:", scheduleData);
        console.log("isValidScheduleData:", isValidScheduleData);
        console.log("isValidCourseGroupId:", isValidCourseGroupId);
        console.log("groupDetail request enabled:", open && isValidCourseGroupId);
    }, [open, scheduleData]);

    // دریافت اطلاعات گروه
    const { data: groupDetail, isLoading: groupDetailLoading, error: groupDetailError } = getCourseGroupDetail(
        isValidCourseGroupId ? scheduleData.courseGroupId : null,
        { enabled: open && isValidCourseGroupId }
    );

    // دریافت اطلاعات دوره
    const { data: courseDetail, isLoading: courseDetailLoading, error: courseDetailError } = useGetCourseDetailInfo(
        selectedCourseId || null,
        { enabled: open && !!selectedCourseId }
    );

    // پر کردن فرم و لود داده‌ها
    useEffect(() => {
        if (!open || !isValidScheduleData) {
            reset(defaultValues);
            setCourseGroups([]);
            setSelectedCourseId(null);
            if (open && !isValidScheduleData) {
                toast.error("داده‌های بازه زمانی نامعتبر است");
                handleModal(); // بستن مودال اگه داده نامعتبره
            }
            return;
        }

        const courseId = groupDetail?.courseGroupDto?.courseId || scheduleData.courseId || "";
        const courseName = groupDetail?.courseGroupDto?.courseName || courseDetail?.courseName || "";
        const groupId = isValidCourseGroupId ? scheduleData.courseGroupId.toString() : "";

        if (courseId) {
            setSelectedCourseId(courseId);
            setValue("courseId", courseId, { shouldValidate: true });
            setValue("courseName", courseName, { shouldValidate: true });
            setValue("groupId", groupId, { shouldValidate: true });
        } else {
            setError("courseId", { type: "manual", message: "دوره مرتبط یافت نشد" });
        }

        const formatTime = (time) => {
            if (!time && time !== 0) return "";
            const hours = Math.floor(time);
            const minutes = Math.round((time - hours) * 60);
            return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
        };

        reset({
            startDate: scheduleData.startDate?.split("T")[0] || "",
            endDate: scheduleData.endDate?.split("T")[0] || "",
            courseId,
            courseName,
            groupId,
            startTime: formatTime(scheduleData.startTime) || "",
            endTime: formatTime(scheduleData.endTime) || "",
            weekNumber: scheduleData.weekNumber?.toString() || "",
            rowEffect: scheduleData.rowEffect?.toString() || "",
            isActive: scheduleData.forming || false,
            attendanceEnabled: scheduleData.lockToRaise || false,
        });
    }, [open, scheduleData, groupDetail, courseDetail, reset, setValue, setError, handleModal]);

    // استخراج courseId و teacherId
    const courseId = courseDetail?.courseId || groupDetail?.courseGroupDto?.courseId || selectedCourseId;
    const teacherId = courseDetail?.teacherId || groupDetail?.courseGroupDto?.teacherId || null;

    // دریافت گروه‌های دوره
    const {
        data: courseGroup,
        isLoading: courseGroupLoading,
        error: courseGroupError,
    } = GetCourseGroup(courseId && teacherId !== null ? courseId : null, teacherId, {
        enabled: open && !!(courseId && teacherId !== null),
    });

    // به‌روزرسانی گروه‌ها
    useEffect(() => {
        if (!open || !courseId) return;

        if (courseGroupLoading) return;

        if (courseGroup) {
            setCourseGroups(courseGroup);
            const groupId = isValidCourseGroupId ? scheduleData.courseGroupId.toString() : "";
            if (groupId && courseGroup.find((g) => g.groupId === Number(groupId))) {
                setValue("groupId", groupId, { shouldValidate: true });
            } else if (groupId) {
                setError("groupId", { type: "manual", message: "گروه انتخاب‌شده معتبر نیست" });
            }
        } else if (courseGroupError) {
            setCourseGroups([]);
            toast.error("خطا در دریافت گروه‌ها");
        }
    }, [open, courseId, courseGroup, courseGroupLoading, courseGroupError, scheduleData, setValue, setError]);

    // مدیریت خطاها
    useEffect(() => {
        if (!open) return;

        if (courseDetailError) {
            toast.error("خطا در دریافت اطلاعات دوره");
        }
        if (groupDetailError) {
            toast.error("خطا در دریافت اطلاعات گروه");
        }
    }, [open, courseDetailError, groupDetailError]);

    const { mutate: updateSchedule } = useUpdateSchedule(courseId);

    const convertTimeToDouble = (timeString) => {
        if (!timeString) return 0;
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours + minutes / 60;
    };

    const onSubmit = (data) => {
        if (!data.courseId || !data.groupId) {
            setError("courseId", { type: "manual", message: "دوره معتبر نیست" });
            setError("groupId", { type: "manual", message: "لطفا گروه معتبر انتخاب کنید" });
            return;
        }

        setIsSubmitting(true);

        const payload = {
            id: scheduleData?.id,
            courseGroupId: Number(data.groupId),
            startDate: new Date(data.startDate).toISOString().split("T")[0],
            endDate: new Date(data.endDate).toISOString().split("T")[0],
            startTime: convertTimeToDouble(data.startTime),
            endTime: convertTimeToDouble(data.endTime),
            weekNumber: Number(data.weekNumber),
            rowEffect: Number(data.rowEffect),
            isActive: data.isActive,
            attendanceEnabled: data.attendanceEnabled,
            teacherId: Number(teacherId),
        };

        updateSchedule(payload, {
            onSuccess: () => {
                toast.success("بازه زمانی با موفقیت ویرایش شد!");
                setIsSubmitting(false);
                reset(defaultValues);
                setCourseGroups([]);
                setSelectedCourseId(null);
                handleModal();
            },
            onError: (error) => {
                setIsSubmitting(false);
                toast.error(`خطا در ویرایش بازه زمانی: ${error.message || "خطای ناشناخته"}`);
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

    const groupOptions = useMemo(
        () => courseGroups.map((group) => ({
            value: group.groupId.toString(),
            label: group.groupName,
        })),
        [courseGroups]
    );

    return (
        <Fragment>
            <Modal isOpen={open} toggle={handleModal} className="modal-dialog-centered modal-lg">
                <ModalHeader className="bg-transparent" toggle={handleModal}></ModalHeader>
                <ModalBody className="pb-5 px-sm-4 mx-50">
                    <h1 className="address-title text-center mb-1">ویرایش بازه زمانی</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row className="gy-1 gx-2">
                            <Col xs={12} md={6}>
                                <Label className="form-label" for="courseId">
                                    دوره
                                </Label>
                                <Controller
                                    name="courseName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="courseId"
                                            placeholder="دوره"
                                            readOnly
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
                                {courseDetailLoading || groupDetailLoading ? (
                                    <small className="text-muted ms-1">در حال بارگذاری...</small>
                                ) : null}
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
                            <Col xs={12} md={6}>
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
                                <Label className="form-label" for="endDate">
                                    تاریخ پایان
                                </Label>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            id="endDate"
                                            type="date"
                                            invalid={errors.endDate && true}
                                            {...field}
                                        />
                                    )}
                                />
                                {errors.endDate && <FormFeedback>{errors.endDate.message}</FormFeedback>}
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
                                {errors.submit && (
                                    <FormFeedback className="d-block">{errors.submit.message}</FormFeedback>
                                )}
                                <Button
                                    type="submit"
                                    className="me-1 mt-2"
                                    color="primary"
                                    disabled={isSubmitting || courseDetailLoading || courseGroupLoading || groupDetailLoading}
                                >
                                    {isSubmitting ? "در حال ارسال..." : "ویرایش بازه زمانی"}
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
        </Fragment>
    );
};

export default EditSchedualModal;