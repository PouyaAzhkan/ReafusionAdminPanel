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
} from "reactstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { selectThemeColors } from "@utils";
import { editUserInfo } from "../../@core/Services/Api/UserManage/user";
import "@styles/react/libs/react-select/_react-select.scss";
import { useEffect } from "react";

const MySwal = withReactContent(Swal);

const gender = [
    { value: true, label: "مرد" },
    { value: false, label: "زن" },
];

const EditUserInfo = ({ show, setShow, selectedUser, onUserUpdated }) => {
    const { mutate, isLoading } = editUserInfo();

    const {
        reset,
        control,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fName: selectedUser?.fName?.split(" ")[0] || "",
            lName: selectedUser?.lName?.split(" ")[0] || "",
            userName: selectedUser?.userName || "",
            nationalCode: selectedUser?.nationalCode || "",
            phoneNumber: selectedUser?.phoneNumber || "",
            gmail: selectedUser?.gmail || "",
            gender: selectedUser?.gender !== undefined
                ? gender.find((g) => g.value === selectedUser.gender) || gender[1]
                : gender[1],
            birthDay: selectedUser?.birthDay || "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        reset({
            fName: selectedUser?.fName?.split(" ")[0] || "",
            lName: selectedUser?.lName?.split(" ")[0] || "",
            userName: selectedUser?.userName || "",
            nationalCode: selectedUser?.nationalCode || "",
            phoneNumber: selectedUser?.phoneNumber || "",
            gmail: selectedUser?.gmail || "",
            gender: selectedUser?.gender !== undefined
                ? gender.find((g) => g.value === selectedUser.gender) || gender[1]
                : gender[1],
            birthDay: selectedUser?.birthDay || "",
        });
    }, [selectedUser, reset]);

    const onSubmit = (data) => {
        // اعتبارسنجی تاریخ تولد
        const birthDayDate = data.birthDay ? new Date(data.birthDay) : null;
        if (!birthDayDate || isNaN(birthDayDate.getTime())) {
            setError("birthDay", { type: "manual", message: "تاریخ تولد نامعتبر است" });
            return;
        }

        const minDate = new Date("1753-01-01");
        const maxDate = new Date("9999-12-31");
        if (birthDayDate < minDate || birthDayDate > maxDate) {
            setError("birthDay", {
                type: "manual",
                message: "تاریخ تولد باید بین 1753 و 9999 باشد",
            });
            return;
        }

        // تبدیل تاریخ به فرمت ISO 8601 (YYYY-MM-DDTHH:mm:ss)
        const formattedBirthDay = birthDayDate.toISOString();

        const payload = {
            id: selectedUser?.id,
            fName: data.fName,
            lName: data.lName,
            userName: data.userName,
            nationalCode: data.nationalCode,
            phoneNumber: data.phoneNumber,
            gmail: data.gmail,
            gender: data.gender.value,
            birthDay: formattedBirthDay,
            active: selectedUser?.active ?? true,
            isDelete: selectedUser?.isDelete ?? false,
            isTecher: selectedUser?.isTecher ?? false,
            isStudent: selectedUser?.isStudent ?? true,
            recoveryEmail: selectedUser?.recoveryEmail ?? "",
            twoStepAuth: selectedUser?.twoStepAuth ?? false,
            userAbout: selectedUser?.userAbout ?? "",
            currentPictureAddress: selectedUser?.currentPictureAddress ?? "",
            linkdinProfile: selectedUser?.linkdinProfile ?? "",
            telegramLink: selectedUser?.telegramLink ?? "",
            receiveMessageEvent: selectedUser?.receiveMessageEvent ?? true,
            homeAdderess: selectedUser?.homeAdderess ?? "",
            latitude: selectedUser?.latitude ?? "",
            longitude: selectedUser?.longitude ?? "",
            insertDate: selectedUser?.insertDate ?? new Date().toISOString(),
            roles: selectedUser?.roles ?? [],
            courses: selectedUser?.courses ?? [],
            coursesReseves: selectedUser?.coursesReseves ?? [],
            userProfileId: selectedUser?.userProfileId ?? selectedUser?.id,
            Command: "update",
        };

        console.log("Payload being sent:", JSON.stringify(payload, null, 2));

        mutate(payload, {
            onSuccess: () => {
                MySwal.fire({
                    icon: "success",
                    title: "ویرایش موفقیت‌آمیز",
                    text: "اطلاعات کاربر با موفقیت به‌روزرسانی شد.",
                    customClass: { confirmButton: "btn btn-success" },
                });
                setShow(false);
                // به‌روزرسانی داده‌های کاربر در صفحه
                if (onUserUpdated) {
                    onUserUpdated(payload);
                }
                reset({
                    ...data,
                    gender: data.gender,
                });
            },
            onError: (error) => {
                console.log("API Error Response:", JSON.stringify(error.response?.data, null, 2));
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
                } else {
                    errorText = error.message || errorText;
                }

                MySwal.fire({
                    icon: "error",
                    title: "خطا در ویرایش",
                    text: errorText,
                    customClass: { confirmButton: "btn btn-danger" },
                });

                if (typeof errorMessages === "object") {
                    Object.entries(errorMessages).forEach(([field, messages]) => {
                        const fieldName = field.toLowerCase();
                        if (fieldName in data) {
                            setError(fieldName, {
                                type: "manual",
                                message: Array.isArray(messages) ? messages[0] : messages,
                            });
                        }
                    });
                }
            },
        });
    };

    const handleReset = () => {
        reset({
            fName: selectedUser?.fName?.split(" ")[0] || "",
            lName: selectedUser?.lName?.split(" ")[0] || "",
            userName: selectedUser?.userName || "",
            nationalCode: selectedUser?.nationalCode || "",
            phoneNumber: selectedUser?.phoneNumber || "",
            gmail: selectedUser?.gmail || "",
            gender: selectedUser?.gender !== undefined
                ? gender.find((g) => g.value === selectedUser.gender) || gender[1]
                : gender[1],
            birthDay: selectedUser?.birthDay || "",
        });
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
                    <h1 className="mb-1">ویرایش اطلاعات کاربر</h1>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="gy-1 pt-75">
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="fName">
                                نام <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="fName"
                                name="fName"
                                rules={{
                                    required: "نام الزامی است",
                                    minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد" },
                                    maxLength: { value: 50, message: "نام نمی‌تواند بیش از ۵۰ حرف باشد" },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="fName"
                                        placeholder="نام"
                                        invalid={!!errors.fName}
                                        className={errors.fName ? "is-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.fName && (
                                <div className="invalid-feedback">{errors.fName.message}</div>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="lName">
                                نام خانوادگی <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="lName"
                                name="lName"
                                rules={{
                                    required: "نام خانوادگی الزامی است",
                                    minLength: { value: 2, message: "نام خانوادگی باید حداقل ۲ حرف باشد" },
                                    maxLength: { value: 50, message: "نام خانوادگی نمی‌تواند بیش از ۵۰ حرف باشد" },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="lName"
                                        placeholder="نام خانوادگی"
                                        invalid={!!errors.lName}
                                        className={errors.lName ? "is-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.lName && (
                                <div className="invalid-feedback">{errors.lName.message}</div>
                            )}
                        </Col>
                        <Col xs={12}>
                            <Label className="form-label" for="userName">
                                نام کاربری <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="userName"
                                name="userName"
                                rules={{
                                    required: "نام کاربری الزامی است",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._]+|[0-9]{11}$/,
                                        message: "نام کاربری باید شامل حروف، اعداد، نقطه، زیرخط یا شماره موبایل ۱۱ رقمی باشد",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="userName"
                                        placeholder="john.doe.007 یا 09123456789"
                                        invalid={!!errors.userName}
                                        className={errors.userName ? "is-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.userName && (
                                <div className="invalid-feedback">{errors.userName.message}</div>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="nationalCode">
                                کدملی <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="nationalCode"
                                name="nationalCode"
                                rules={{
                                    required: "کدملی الزامی است",
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "کدملی باید دقیقاً ۱۰ رقم باشد",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="nationalCode"
                                        placeholder="1234567890"
                                        invalid={!!errors.nationalCode}
                                        className={errors.nationalCode ? "is-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.nationalCode && (
                                <div className="invalid-feedback">{errors.nationalCode.message}</div>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="phoneNumber">
                                شماره تماس <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="phoneNumber"
                                name="phoneNumber"
                                rules={{
                                    required: "شماره تماس الزامی است",
                                    pattern: {
                                        value: /^09\d{9}$/,
                                        message: "شماره تماس باید با 09 شروع شده و ۱۱ رقم باشد",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="phoneNumber"
                                        placeholder="09123456789"
                                        invalid={!!errors.phoneNumber}
                                        className={errors.phoneNumber ? "is-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.phoneNumber && (
                                <div className="invalid-feedback">{errors.phoneNumber.message}</div>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="gmail">
                                ایمیل <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="gmail"
                                name="gmail"
                                rules={{
                                    required: "ایمیل الزامی است",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "ایمیل معتبر وارد کنید",
                                    },
                                }}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="email"
                                        id="gmail"
                                        placeholder="example@domain.com"
                                        invalid={!!errors.gmail}
                                        className={errors.gmail ? "is-invalid" : ""}
                                    />
                                )}
                            />
                            {errors.gmail && (
                                <div className="invalid-feedback">{errors.gmail.message}</div>
                            )}
                        </Col>
                        <Col md={6} xs={12}>
                            <Label className="form-label" for="gender">
                                جنسیت <span className="text-danger">*</span>
                            </Label>
                            <Controller
                                control={control}
                                id="gender"
                                name="gender"
                                rules={{ required: "جنسیت الزامی است" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        id="gender"
                                        isClearable={false}
                                        className="react-select"
                                        classNamePrefix="select"
                                        options={gender}
                                        theme={selectThemeColors}
                                        onChange={(option) => field.onChange(option)}
                                    />
                                )}
                            />
                            {errors.gender && (
                                <div className="invalid-feedback d-block">{errors.gender.message}</div>
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

export default EditUserInfo;