import { useState, useEffect, useMemo } from "react";
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
import toast from "react-hot-toast";
import useGetCourseDetailInfo from "../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import GetCourseGroup from "../../../@core/Services/Api/Courses/CourseDetail/GetCourseGroup";
import {
    getCourseGroupDetail,
    useUpdateSchedule,
    useEditForming,
    useEditLockToRaise,
} from "../../../@core/Services/Api/Schedual/Schedual";

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
    courseId: yup.string().required("دوره معتبر نیست"),
    groupId: yup.string().required("گروه دوره را انتخاب کنید"),
    startDate: yup.string().required("تاریخ شروع را وارد کنید"),
    startTime: yup
        .string()
        .required("ساعت شروع را وارد کنید")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "فرمت ساعت شروع نامعتبر است"),
    endTime: yup
        .string()
        .required("ساعت پایان را وارد کنید")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "فرمت ساعت پایان نامعتبر است"),
    weekNumber: yup.number().required("تعداد در هفته را وارد کنید").min(1, "حداقل ۱ جلسه"),
    rowEffect: yup.number().required("تعداد کل جلسات را وارد کنید").min(1, "حداقل ۱ جلسه"),
});

const EditSchedualModal = ({ open, handleModal, scheduleData, onScheduleUpdate }) => {
    const [courseGroups, setCourseGroups] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        reset,
        control,
        setValue,
        setError,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues,
        resolver: yupResolver(schema),
    });

    const isValidScheduleData = scheduleData && !Array.isArray(scheduleData) && scheduleData.courseGroupId;
    const isValidCourseGroupId = isValidScheduleData && Number.isInteger(Number(scheduleData.courseGroupId));

    const { data: groupDetail, isLoading: groupDetailLoading } = getCourseGroupDetail(
        isValidCourseGroupId ? scheduleData.courseGroupId : null,
        { enabled: open && isValidCourseGroupId }
    );

    const { data: courseDetail, isLoading: courseDetailLoading } = useGetCourseDetailInfo(
        selectedCourseId || null,
        { enabled: open && !!selectedCourseId }
    );

    const courseId = courseDetail?.courseId || groupDetail?.courseGroupDto?.courseId || selectedCourseId;
    const teacherId = courseDetail?.teacherId || groupDetail?.courseGroupDto?.teacherId || null;

    const { data: courseGroup, isLoading: courseGroupLoading } = GetCourseGroup(
        courseId && teacherId !== null ? courseId : null,
        teacherId,
        { enabled: open && !!(courseId && teacherId !== null) }
    );

    const { mutate: editForming } = useEditForming();
    const { mutate: editLockToRaise } = useEditLockToRaise();
    const { mutate: updateSchedule } = useUpdateSchedule(courseId);

    const formingValue = watch("forming");
    const lockToRaiseValue = watch("lockToRaise");

    useEffect(() => {
        if (!open) {
            reset(defaultValues);
            setCourseGroups([]);
            setSelectedCourseId(null);
            return;
        }

        if (!isValidScheduleData) {
            toast.error("داده‌های بازه زمانی نامعتبر است");
            handleModal();
            return;
        }

        const courseId = groupDetail?.courseGroupDto?.courseId || scheduleData.courseId || "";
        const courseName = groupDetail?.courseGroupDto?.courseName || courseDetail?.courseName || "";
        const groupId = isValidCourseGroupId ? scheduleData.courseGroupId.toString() : "";

        setSelectedCourseId(courseId);
        setValue("courseId", courseId);
        setValue("courseName", courseName);
        setValue("groupId", groupId);

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
            forming: scheduleData.forming || false,
            lockToRaise: scheduleData.lockToRaise || false,
        });

        if (courseGroup) {
            setCourseGroups(courseGroup);
            if (groupId && !courseGroup.find((g) => g.groupId === Number(groupId))) {
                setError("groupId", { type: "manual", message: "گروه انتخاب‌شده معتبر نیست" });
            }
        }
    }, [open, scheduleData, groupDetail, courseDetail, courseGroup, reset, setValue, setError, handleModal]);

    const convertTimeToDouble = (timeString) => {
        if (!timeString) return 0;
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours + minutes / 60;
    };

    const onSubmit = async (data) => {
        if (!data.courseId || !data.groupId) {
            setError("courseId", { type: "manual", message: "دوره معتبر نیست" });
            setError("groupId", { type: "manual", message: "گروه معتبر انتخاب کنید" });
            return;
        }

        setIsSubmitting(true);

        try {
            let hasChanges = false;
            const updatedData = { ...scheduleData };

            // تغییر حالت forming اگر تغییر کرده باشد
            if (data.forming !== scheduleData.forming) {
                await new Promise((resolve, reject) => {
                    editForming(
                        { id: scheduleData.id, active: data.forming },
                        {
                            onSuccess: (response) => {
                                if (response?.success) {
                                    toast.success(`حالت دوره ${data.forming ? "فعال" : "غیرفعال"} شد!`);
                                    updatedData.forming = data.forming;
                                    hasChanges = true;
                                    resolve();
                                } else {
                                    toast.error("خطا در تغییر حالت دوره");
                                    reject(new Error("Failed to update forming"));
                                }
                            },
                            onError: (error) => {
                                toast.error(error.message || "خطا در تغییر حالت دوره");
                                reject(error);
                            },
                        }
                    );
                });
            }

            // تغییر حالت lockToRaise اگر تغییر کرده باشد
            if (data.lockToRaise !== scheduleData.lockToRaise) {
                await new Promise((resolve, reject) => {
                    editLockToRaise(
                        { id: scheduleData.id, active: data.lockToRaise },
                        {
                            onSuccess: (response) => {
                                if (response?.success) {
                                    toast.success(`حالت حضور ${data.lockToRaise ? "فعال" : "غیرفعال"} شد!`);
                                    updatedData.lockToRaise = data.lockToRaise;
                                    hasChanges = true;
                                    resolve();
                                } else {
                                    toast.error("خطا در تغییر حالت حضور");
                                    reject(new Error("Failed to update lockToRaise"));
                                }
                            },
                            onError: (error) => {
                                toast.error(error.message || "خطا در تغییر حالت حضور");
                                reject(error);
                            },
                        }
                    );
                });
            }

            // اگر تغییراتی در forming یا lockToRaise اعمال شده، به والد اطلاع بده
            if (hasChanges) {
                onScheduleUpdate(updatedData);
            }

            // به‌روزرسانی سایر فیلدها
            const payload = {
                id: scheduleData?.id,
                courseGroupId: Number(data.groupId),
                startDate: new Date(data.startDate).toISOString().split("T")[0],
                endDate: new Date(data.endDate).toISOString().split("T")[0],
                startTime: convertTimeToDouble(data.startTime),
                endTime: convertTimeToDouble(data.endTime),
                weekNumber: Number(data.weekNumber),
                rowEffect: Number(data.rowEffect),
                forming: data.forming,
                lockToRaise: data.lockToRaise,
                teacherId: Number(teacherId),
            };

            console.log("Payload sent to updateSchedule API:", payload);

            await new Promise((resolve, reject) => {
                updateSchedule(payload, {
                    onSuccess: (response) => {
                        if (response?.success) {
                            toast.success("بازه زمانی ویرایش شد!");
                            onScheduleUpdate({ ...updatedData, ...payload });
                            resolve();
                        } else {
                            toast.error("خطا در ویرایش بازه زمانی");
                            reject(new Error("Failed to update schedule"));
                        }
                    },
                    onError: (error) => {
                        toast.error(error.response?.data?.ErrorMessage?.join(" ") || "خطا در ویرایش");
                        resolve(); // برای جلوگیری از توقف فرایند
                    },
                });
            });

            reset(defaultValues);
            setCourseGroups([]);
            setSelectedCourseId(null);
            handleModal();
        } catch (error) {
            console.error("Error in submission:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const onDiscard = () => {
        reset(defaultValues);
        setCourseGroups([]);
        setSelectedCourseId(null);
        handleModal();
    };

    const groupOptions = useMemo(
        () => courseGroups.map((group) => ({ value: group.groupId.toString(), label: group.groupName })),
        [courseGroups]
    );

    return (
        <Modal isOpen={open} toggle={handleModal} className="modal-dialog-centered modal-lg">
            <ModalHeader toggle={handleModal}></ModalHeader>
            <ModalBody className="pb-5 px-sm-4 mx-50">
                <h1 className="text-center mb-1">ویرایش بازه زمانی</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-1 gx-2">
                        <Col xs={12} md={6}>
                            <Label for="courseId">دوره</Label>
                            <Controller
                                name="courseName"
                                control={control}
                                render={({ field }) => (
                                    <Input id="courseId" readOnly invalid={!!errors.courseId} {...field} />
                                )}
                            />
                            {errors.courseId && <FormFeedback>{errors.courseId.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Label for="groupId">گروه دوره</Label>
                            <Controller
                                name="groupId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        id="groupId"
                                        isClearable
                                        classNamePrefix="select"
                                        options={groupOptions}
                                        theme={selectThemeColors}
                                        placeholder="انتخاب گروه"
                                        onChange={(option) => field.onChange(option ? option.value : "")}
                                        value={groupOptions.find((option) => option.value === field.value) || null}
                                        isDisabled={courseGroupLoading || !courseGroups.length}
                                    />
                                )}
                            />
                            {errors.groupId && <FormFeedback>{errors.groupId.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Label for="startTime">ساعت شروع</Label>
                            <Controller
                                name="startTime"
                                control={control}
                                render={({ field }) => (
                                    <Input type="time" id="startTime" invalid={!!errors.startTime} {...field} />
                                )}
                            />
                            {errors.startTime && <FormFeedback>{errors.startTime.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Label for="endTime">ساعت پایان</Label>
                            <Controller
                                name="endTime"
                                control={control}
                                render={({ field }) => (
                                    <Input type="time" id="endTime" invalid={!!errors.endTime} {...field} />
                                )}
                            />
                            {errors.endTime && <FormFeedback>{errors.endTime.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Label for="weekNumber">تعداد در هفته</Label>
                            <Controller
                                name="weekNumber"
                                control={control}
                                render={({ field }) => (
                                    <Input type="number" id="weekNumber" invalid={!!errors.weekNumber} {...field} />
                                )}
                            />
                            {errors.weekNumber && <FormFeedback>{errors.weekNumber.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Label for="rowEffect">تعداد کل جلسات</Label>
                            <Controller
                                name="rowEffect"
                                control={control}
                                render={({ field }) => (
                                    <Input type="number" id="rowEffect" invalid={!!errors.rowEffect} {...field} />
                                )}
                            />
                            {errors.rowEffect && <FormFeedback>{errors.rowEffect.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Label for="startDate">تاریخ شروع</Label>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <Input type="date" id="startDate" invalid={!!errors.startDate} {...field} />
                                )}
                            />
                            {errors.startDate && <FormFeedback>{errors.startDate.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Label for="endDate">تاریخ پایان</Label>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <Input type="date" id="endDate" invalid={!!errors.endDate} {...field} />
                                )}
                            />
                            {errors.endDate && <FormFeedback>{errors.endDate.message}</FormFeedback>}
                        </Col>
                        <Col xs={12} md={6}>
                            <Controller
                                name="forming"
                                control={control}
                                render={({ field }) => (
                                    <div className="form-check form-switch">
                                        <Input
                                            type="switch"
                                            id="forming-switch"
                                            checked={field.value}
                                            onChange={(e) => setValue("forming", e.target.checked)}
                                        />
                                        <Label className="form-check-label" htmlFor="forming-switch">
                                            وضعیت برگزاری
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
                        </Col>
                        <Col xs={12} md={6}>
                            <Controller
                                name="lockToRaise"
                                control={control}
                                render={({ field }) => (
                                    <div className="form-check form-switch">
                                        <Input
                                            type="switch"
                                            id="lock-switch"
                                            checked={field.value}
                                            onChange={(e) => setValue("lockToRaise", e.target.checked)}
                                        />
                                        <Label className="form-check-label" htmlFor="lock-switch">
                                            وضعیت حضور و غیاب
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
                        </Col>
                        <Col className="text-center" xs={12}>
                            <Button
                                type="submit"
                                className="me-1 mt-2"
                                color="primary"
                                disabled={isSubmitting || courseDetailLoading || courseGroupLoading || groupDetailLoading}
                            >
                                {isSubmitting ? "در حال ارسال..." : "ویرایش"}
                            </Button>
                            <Button type="button" className="mt-2" color="secondary" outline onClick={onDiscard}>
                                انصراف
                            </Button>
                        </Col>
                    </Row>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default EditSchedualModal;