import { useForm, Controller } from "react-hook-form";
import {
    Row,
    Col,
    Form,
    Button,
    Modal,
    Input,
    Label,
    ModalBody,
    ModalHeader,
    FormFeedback,
} from "reactstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/react-select/_react-select.scss";
import { useEffect } from "react";
import { useEditJobHistory } from "../../../@core/Services/Api/JobHistory/JobHistory";

const MySwal = withReactContent(Swal);

const inWorkOptions = [
    { value: true, label: "در حال کار" },
    { value: false, label: "پایان کار" },
];

const EditJobHistoryModal = ({ show, setShow, selectedJobHistory, onUserUpdated }) => {
    const { mutate, isLoading } = useEditJobHistory();

    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            jobTitle: "",
            aboutJob: "",
            companyWebSite: "",
            companyLinkdin: "",
            workStartDate: "",
            workEndDate: "",
            inWork: inWorkOptions[1], // مقدار پیش‌فرض: پایان کار
            companyName: "",
            userId: "",
            id: "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (selectedJobHistory) {
            reset({
                jobTitle: selectedJobHistory.jobTitle || "",
                aboutJob: selectedJobHistory.aboutJob || "",
                companyWebSite: selectedJobHistory.companyWebSite || "",
                companyLinkdin: selectedJobHistory.companyLinkdin || "",
                workStartDate: selectedJobHistory.workStartDate
                    ? new Date(selectedJobHistory.workStartDate).toISOString().split("T")[0]
                    : "",
                workEndDate: selectedJobHistory.workEndDate
                    ? new Date(selectedJobHistory.workEndDate).toISOString().split("T")[0]
                    : "",
                inWork:
                    inWorkOptions.find((opt) => opt.value === selectedJobHistory.inWork) ||
                    inWorkOptions[1],
                companyName: selectedJobHistory.companyName || "",
                userId: selectedJobHistory.userId?.toString() || "",
                id: selectedJobHistory.id?.toString() || "",
            });
        }
    }, [selectedJobHistory, reset]);

    const onSubmit = (data) => {
        // اعتبارسنجی تاریخ‌ها
        const startDate = data.workStartDate ? new Date(data.workStartDate) : null;
        const endDate = data.workEndDate ? new Date(data.workEndDate) : null;

        if (!startDate || isNaN(startDate.getTime())) {
            setError("workStartDate", { type: "manual", message: "تاریخ شروع نامعتبر است" });
            return;
        }

        if (!data.inWork.value && (!endDate || isNaN(endDate.getTime()))) {
            setError("workEndDate", { type: "manual", message: "تاریخ پایان نامعتبر است" });
            return;
        }

        if (!data.inWork.value && endDate <= startDate) {
            setError("workEndDate", {
                type: "manual",
                message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
            });
            return;
        }

        // آماده‌سازی payload
        const payload = {
            id: parseInt(data.id),
            jobTitle: data.jobTitle,
            aboutJob: data.aboutJob,
            companyWebSite: data.companyWebSite,
            companyLinkdin: data.companyLinkdin,
            workStartDate: startDate.toISOString(),
            workEndDate: data.inWork.value ? null : endDate?.toISOString(),
            inWork: data.inWork.value,
            companyName: data.companyName,
            userId: parseInt(data.userId),
        };

        console.log("Payload being sent:", JSON.stringify(payload, null, 2));

        mutate(payload, {
            onSuccess: () => {
                MySwal.fire({
                    icon: "success",
                    title: "ویرایش موفقیت‌آمیز",
                    text: "سابقه شغلی با موفقیت به‌روزرسانی شد.",
                    customClass: { confirmButton: "btn btn-success" },
                });
                setShow(false);
                if (onUserUpdated) {
                    onUserUpdated(payload);
                }
                reset();
            },
            onError: (error) => {
                console.error("API Error:", error);
                let errorText = "خطایی رخ داد. لطفاً دوباره تلاش کنید.";

                if (error.response?.data) {
                    const errorMessages = error.response.data.ErrorMessage || error.response.data.errors;
                    if (Array.isArray(errorMessages)) {
                        errorText = errorMessages.join("\n");
                    } else if (typeof errorMessages === "object" && errorMessages) {
                        errorText = Object.entries(errorMessages)
                            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
                            .join("\n");
                    } else if (typeof errorMessages === "string") {
                        errorText = errorMessages;
                    }
                } else if (error.response?.status) {
                    errorText = `خطای سرور با کد ${error.response.status}. لطفاً با پشتیبانی تماس بگیرید.`;
                } else {
                    errorText = error.message || errorText;
                }

                MySwal.fire({
                    icon: "error",
                    title: "خطا در ویرایش",
                    text: errorText,
                    customClass: { confirmButton: "btn btn-danger" },
                });
            },
        });
    };

    const handleReset = () => {
        reset();
        setShow(false);
    };

    return (
        <Modal
            isOpen={show}
            toggle={() => setShow(!show)}
            className="modal-dialog-centered modal-lg"
        >
            <ModalHeader
                className="bg-transparent"
                toggle={() => setShow(!show)}
            ></ModalHeader>
            <ModalBody className="px-sm-5 pt-50 pb-5">
                <div className="text-center mb-2">
                    <h1 className="mb-1">ویرایش سابقه شغلی</h1>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-1 pt-75">
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="jobTitle">
                                عنوان شغل <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="jobTitle"
                                name="jobTitle"
                                rules={{
                                    required: "عنوان شغل الزامی است",
                                    minLength: { value: 2, message: "عنوان شغل باید حداقل ۲ حرف باشد" },
                                    maxLength: { value: 100, message: "عنوان شغل نمی‌تواند بیش از ۱۰۰ حرف باشد" },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="jobTitle"
                                        placeholder="مثال: برنامه‌نویس ارشد"
                                        invalid={!!errors.jobTitle}
                                    />
                                )}
                            />
                            {errors.jobTitle && (
                                <FormFeedback>{errors.jobTitle.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="companyName">
                                نام شرکت <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="companyName"
                                name="companyName"
                                rules={{
                                    required: "نام شرکت الزامی است",
                                    minLength: { value: 2, message: "نام شرکت باید حداقل ۲ حرف باشد" },
                                    maxLength: { value: 100, message: "نام شرکت نمی‌تواند بیش از ۱۰۰ حرف باشد" },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="companyName"
                                        placeholder="مثال: شرکت XYZ"
                                        invalid={!!errors.companyName}
                                    />
                                )}
                            />
                            {errors.companyName && (
                                <FormFeedback>{errors.companyName.message}</FormFeedback>
                            )}
                        </Col>
                        <Col xs={12}>
                            <Label className="form-label" for="aboutJob">
                                توضیحات شغل
                            </Label>
                            <Controller
                                control={control}
                                id="aboutJob"
                                name="aboutJob"
                                rules={{
                                    maxLength: { value: 500, message: "توضیحات نمی‌تواند بیش از ۵۰۰ حرف باشد" },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="textarea"
                                        id="aboutJob"
                                        placeholder="توضیحات مربوط به شغل"
                                        invalid={!!errors.aboutJob}
                                    />
                                )}
                            />
                            {errors.aboutJob && (
                                <FormFeedback>{errors.aboutJob.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="companyWebSite">
                                وب‌سایت شرکت <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="companyWebSite"
                                name="companyWebSite"
                                rules={{
                                    required: "وب‌سایت شرکت الزامی است",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="companyWebSite"
                                        placeholder="مثال: https://example.com"
                                        invalid={!!errors.companyWebSite}
                                    />
                                )}
                            />
                            {errors.companyWebSite && (
                                <FormFeedback>{errors.companyWebSite.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="companyLinkdin">
                                لینکدین شرکت <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="companyLinkdin"
                                name="companyLinkdin"
                                rules={{
                                    required: "لینکدین شرکت الزامی است",
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="companyLinkdin"
                                        placeholder="مثال: https://linkedin.com/company/example"
                                        invalid={!!errors.companyLinkdin}
                                    />
                                )}
                            />
                            {errors.companyLinkdin && (
                                <FormFeedback>{errors.companyLinkdin.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="workStartDate">
                                تاریخ شروع <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="workStartDate"
                                name="workStartDate"
                                rules={{ required: "تاریخ شروع الزامی است" }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="date"
                                        id="workStartDate"
                                        invalid={!!errors.workStartDate}
                                    />
                                )}
                            />
                            {errors.workStartDate && (
                                <FormFeedback>{errors.workStartDate.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="workEndDate">
                                تاریخ پایان
                            </Label>
                            <Controller
                                control={control}
                                id="workEndDate"
                                name="workEndDate"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="date"
                                        id="workEndDate"
                                        disabled={control._fields.inWork?.value?.value}
                                        invalid={!!errors.workEndDate}
                                    />
                                )}
                            />
                            {errors.workEndDate && (
                                <FormFeedback>{errors.workEndDate.message}</FormFeedback>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="inWork">
                                وضعیت شغل <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="inWork"
                                name="inWork"
                                rules={{ required: "وضعیت شغل الزامی است" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="inWork"
                                        isClearable={false}
                                        className="react-select"
                                        classNamePrefix="select"
                                        options={inWorkOptions}
                                        theme={selectThemeColors}
                                        onChange={(option) => field.onChange(option)}
                                        value={field.value}
                                    />
                                )}
                            />
                            {errors.inWork && (
                                <FormFeedback>{errors.inWork.message}</FormFeedback>
                            )}
                        </Col>
                        <Col xs={12} className="text-center mt-2 pt-50">
                            <Button
                                type="submit"
                                className="me-1"
                                color="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? "در حال ارسال..." : "ثبت"}
                            </Button>
                            <Button
                                type="reset"
                                color="secondary"
                                outline
                                onClick={handleReset}
                            >
                                انصراف
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </ModalBody>
        </Modal>
    );
};

export default EditJobHistoryModal;