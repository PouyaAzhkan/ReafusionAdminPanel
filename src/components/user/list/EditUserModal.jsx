import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useRef, useState, useEffect } from "react";
import Wizard from "@components/wizard";
import AccountDetails from "./steps-with-validation/AccountDetails";
import PersonalInfo from "./steps-with-validation/PersonalInfo";
import Address from "./steps-with-validation/Address";
import OtherInfo from "./steps-with-validation/OtherInfo";
import { useUserDetail, editUserInfo } from "../../../@core/Services/Api/UserManage/user";
import { useQueryClient } from "@tanstack/react-query"; // اضافه کردن برای بی‌اعتبار کردن کوئری
import toast from "react-hot-toast";

const EditUserModal = ({ editModal, setEditModal, userId, refetch }) => {
    const { data, isLoading, isError } = useUserDetail(userId);
    const { mutate, isLoading: isMutating } = editUserInfo();
    const queryClient = useQueryClient(); // برای مدیریت کش کوئری
    const ref = useRef(null);
    const [stepper, setStepper] = useState(null);
    const [formData, setFormData] = useState({});

    // بررسی مقداردهی stepper
    useEffect(() => {
        if (stepper) {
            console.log("Stepper initialized:", stepper);
        } else {
            console.warn("Stepper is not initialized.");
        }
    }, [stepper]);

    const handleNext = (data) => {
        setFormData((prev) => ({ ...prev, ...data }));
        if (stepper) {
            stepper.next();
        } else {
            console.error("Stepper is not initialized for next.");
        }
    };

    const handlePrevious = () => {
        if (stepper) {
            stepper.previous();
        } else {
            console.error("Stepper is not initialized for previous.");
        }
    };

    const handleSubmit = (data) => {
        const finalData = {
            id: userId,
            ...formData,
            ...data,
            gender: data.gender?.value, // تبدیل جنسیت به مقدار بولین
        };

        // لاگ برای بررسی داده‌های خام
        console.log("finalData before validation:", JSON.stringify(finalData, null, 2));

        // اعتبارسنجی birthday (اجباری)
        let formattedBirthDay;
        try {
            if (!finalData.birthday) {
                throw new Error("تاریخ تولد اجباری است و نمی‌تواند خالی باشد.");
            }
            const date = new Date(finalData.birthday);
            if (isNaN(date.getTime())) {
                throw new Error(`مقدار تاریخ تولد نامعتبر است: ${finalData.birthday}`);
            }
            if (date.getFullYear() < 1753 || date.getFullYear() > 9999) {
                throw new Error(`تاریخ تولد خارج از محدوده مجاز است: ${finalData.birthday}`);
            }
            formattedBirthDay = date.toISOString().split("T")[0]; // فرمت: YYYY-MM-DD
        } catch (error) {
            toast.error(error.message);
            console.error("Validation error:", error.message);
            return; // جلوگیری از ارسال درخواست
        }

        // تنظیم insertDate به تاریخ فعلی
        const formattedInsertDate = new Date().toISOString().split("T")[0]; // فرمت: YYYY-MM-DD

        // ساخت payload با حفظ مقادیر اصلی برای فیلدهای ویرایش‌نشده
        const payload = {
            id: userId,
            ...(finalData.firstName && { fName: finalData.firstName }),
            ...(finalData.lastName && { lName: finalData.lastName }),
            ...(finalData.username && { userName: finalData.username }),
            ...(finalData.email && { gmail: finalData.email }),
            ...(finalData.phoneNumber && { phoneNumber: finalData.phoneNumber }),
            ...(finalData.recoveryEmail && { recoveryEmail: finalData.recoveryEmail }),
            ...(finalData.homeAddress && { homeAdderess: finalData.homeAddress }),
            ...(finalData.latitude && { latitude: String(finalData.latitude) }),
            ...(finalData.longitude && { longitude: String(finalData.longitude) }),
            ...(finalData.userAbout && { userAbout: finalData.userAbout }),
            ...(finalData.telegramLink && { telegramLink: finalData.telegramLink }),
            ...(finalData.linkedinLink && { linkdinProfile: finalData.linkedinLink }),
            ...(finalData.isActive !== undefined && { active: finalData.isActive }),
            ...(finalData.isTecher !== undefined && { isTecher: finalData.isTecher }),
            ...(finalData.isStudent !== undefined && { isStudent: finalData.isStudent }),
            ...(finalData.gender !== undefined && { gender: finalData.gender }),
            ...(finalData.nationalCode && { nationalCode: finalData.nationalCode }),
            birthDay: formattedBirthDay, // تاریخ معتبر
            insertDate: formattedInsertDate, // اضافه کردن insertDate
        };

        console.log("Sending payload to API:", JSON.stringify(payload, null, 2));

        mutate(payload, {
            onSuccess: async () => {
                console.log("Mutation successful, calling refetch...");
                toast.success("اطلاعات با موفقیت به‌روزرسانی شد!");
                // بی‌اعتبار کردن کوئری‌های مرتبط
                await queryClient.invalidateQueries({ queryKey: ["UserDetail", userId] });
                await refetch(); // اطمینان از اجرای refetch
                setEditModal(false); // بستن مدال بعد از refetch
            },
            onError: (error) => {
                console.error("API Error:", JSON.stringify(error.response?.data, null, 2));
                toast.error(
                    `خطا در به‌روزرسانی اطلاعات: ${error.response?.data?.ErrorMessage || error.message}`
                );
            },
        });
    };

    const steps = [
        {
            id: "account-details",
            title: "حساب کاربری",
            subtitle: "جزئیات اکانت کاربر",
            content: (
                <AccountDetails
                    stepper={{ next: handleNext }}
                    userAllInfo={data}
                />
            ),
        },
        {
            id: "personal-info",
            title: "مشخصات کاربر",
            subtitle: "اطلاعات شخصی کاربر",
            content: (
                <PersonalInfo
                    stepper={{ next: handleNext, previous: handlePrevious }}
                    userAllInfo={data}
                />
            ),
        },
        {
            id: "step-address",
            title: "آدرس",
            subtitle: "موقعیت مکانی کاربر",
            content: (
                <Address
                    stepper={{ next: handleNext, previous: handlePrevious }}
                    userAllInfo={data}
                />
            ),
        },
        {
            id: "other-info",
            title: "سایر مشخصات",
            subtitle: "اطلاعات دیگر",
            content: (
                <OtherInfo
                    stepper={{ previous: handlePrevious, submit: handleSubmit }}
                    userAllInfo={data}
                />
            ),
        },
    ];

    const toggleModal = () => {
        setEditModal(!editModal);
    };

    return (
        <Modal isOpen={editModal} toggle={toggleModal} size="xl" centered>
            <ModalHeader toggle={toggleModal}>ویرایش اطلاعات کاربر</ModalHeader>
            <ModalBody className="d-flex justify-content-center align-items-center">
                {isLoading ? (
                    <div>در حال بارگذاری...</div>
                ) : isError ? (
                    <div>خطا در بارگذاری اطلاعات کاربر.</div>
                ) : (
                    <div className="horizontal-wizard w-100">
                        <Wizard instance={(el) => setStepper(el)} ref={ref} steps={steps} />
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
};

export default EditUserModal;