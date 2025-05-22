import { useEffect, useState } from "react";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
    Row,
    Col,
    Form,
    Input,
    Label,
    Button,
    FormFeedback,
} from "reactstrap";
import { selectThemeColors } from "@utils";

// ** Leaflet Imports
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { editAdminProfileInfo } from "../../@core/Services/Api/AdminInfo/AdminInfo";

// تنظیم آیکون Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const genderOptions = [
    { value: true, label: "مرد" },
    { value: false, label: "زن" },
];

// کامپوننت نقشه
const MapComponent = ({ position, setPosition, setValue }) => {
    const map = useMap();

    useEffect(() => {
        map.flyTo(position, 13);
    }, [position, map]);

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            setPosition([lat, lng]);
            setValue("latitude", lat.toString());
            setValue("longitude", lng.toString());
            handleReverseGeocode(lat, lng, setValue);
        },
    });

    return (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                    dragend: (e) => {
                        const { lat, lng } = e.target.getLatLng();
                        setPosition([lat, lng]);
                        setValue("latitude", lat.toString());
                        setValue("longitude", lng.toString());
                        handleReverseGeocode(lat, lng, setValue);
                    },
                }}
            />
        </>
    );
};

// تابع معکوس برای تبدیل مختصات به آدرس
const handleReverseGeocode = async (lat, lng, setValue) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );
        const data = await response.json();
        if (data && data.display_name) {
            setValue("address", data.display_name);
        } else {
            toast.error("آدرس برای این مختصات یافت نشد.");
        }
    } catch (error) {
        toast.error("خطا در دریافت آدرس: " + error.message);
    }
};

const UserProfileForm = ({ userData }) => {
    const formatDate = (date) => {
        if (!date) return "";
        try {
            const parsedDate = new Date(date);
            if (isNaN(parsedDate)) return "";
            return parsedDate.toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    // ** Hooks
    const { mutate, isLoading } = editAdminProfileInfo();

    const {
        control,
        setError,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            userId: "",
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            userAbout: "",
            linkdin: "",
            telegram: "",
            receiveMessageEvent: false, // مقدار پیش‌فرض معتبر
            address: "",
            nationalCode: "",
            gender: genderOptions[1], // مقدار پیش‌فرض: زن (false)
            birthday: "",
            latitude: "",
            longitude: "",
        },
        mode: "onChange",
        resolver: async (data) => {
            const errors = {};
            if (!data.firstName || data.firstName.trim() === "") {
                errors.firstName = { message: "لطفاً نام را وارد کنید" };
            }
            if (!data.lastName || data.lastName.trim() === "") {
                errors.lastName = { message: "لطفاً نام خانوادگی را وارد کنید" };
            }
            if (!data.nationalCode || data.nationalCode.trim() === "") {
                errors.nationalCode = { message: "لطفاً کدملی را وارد کنید" };
            }
            if (!data.address || data.address.trim().length <= 10) {
                errors.address = { message: "آدرس باید بیشتر از ۱۰ کاراکتر باشد" };
            }
            if (data.latitude) {
                const lat = parseFloat(data.latitude);
                if (isNaN(lat) || lat < -90 || lat > 90) {
                    errors.latitude = { message: "عرض جغرافیایی باید بین -90 و 90 باشد" };
                }
            }
            if (data.longitude) {
                const lon = parseFloat(data.longitude);
                if (isNaN(lon) || lon < -180 || lon > 180) {
                    errors.longitude = { message: "طول جغرافیایی باید بین -180 و 180 باشد" };
                }
            }
            if (data.birthday) {
                const birthDate = new Date(data.birthday);
                const today = new Date();
                if (isNaN(birthDate) || birthDate > today) {
                    errors.birthday = { message: "تاریخ تولد نامعتبر است یا در آینده است" };
                }
            }
            return { values: data, errors };
        },
    });

    // ** States
    const [position, setPosition] = useState([35.6892, 51.3890]); // مختصات پیش‌فرض (تهران)
    const [isClient, setIsClient] = useState(false);

    // نظارت بر تغییرات فیلد آدرس
    const homeAddress = watch("address");

    // به‌روزرسانی فرم هنگام تغییر userData
    useEffect(() => {
        if (userData) {
            const genderData = userData?.gender ? genderOptions[0] : genderOptions[1];
            const latitude = userData?.latitude ? parseFloat(userData.latitude) : 35.6892;
            const longitude = userData?.longitude ? parseFloat(userData.longitude) : 51.3890;

            reset({
                userId: userData?.userImage?.[0]?.userProfileId || "",
                firstName: userData?.fName || "",
                lastName: userData?.lName || "",
                email: userData?.email || "",
                phoneNumber: userData?.phoneNumber || "",
                userAbout: userData?.userAbout || "",
                linkdin: userData?.linkdinProfile || "",
                telegram: userData?.telegramLink || "",
                receiveMessageEvent: userData?.receiveMessageEvent || false,
                address: userData?.homeAdderess || "",
                nationalCode: userData?.nationalCode || "",
                gender: genderData,
                birthday: formatDate(userData?.birthDay) || "",
                latitude: userData?.latitude || "",
                longitude: userData?.longitude || "",
            });
            if (userData?.latitude && userData?.longitude) {
                setPosition([latitude, longitude]);
            }
        }
    }, [userData, reset]);

    // تنظیم isClient برای رندر سمت کلاینت
    useEffect(() => {
        setIsClient(true);
    }, []);

    // تابع جستجوی آدرس با Nominatim
    const handleAddressSearch = async (address) => {
        if (!address || address.trim().length <= 10) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                    address
                )}`
            );
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setPosition([parseFloat(lat), parseFloat(lon)]);
                setValue("latitude", lat.toString());
                setValue("longitude", lon.toString());
            } else {
                toast.error("آدرس وارد شده با نقشه مطابقت ندارد!");
            }
        } catch (error) {
            toast.error("خطا در جستجوی آدرس: " + error.message);
        }
    };

    // نظارت بر تغییرات فیلد آدرس با debouncing
    useEffect(() => {
        const handler = setTimeout(() => {
            if (homeAddress) {
                handleAddressSearch(homeAddress);
            }
        }, 1000);

        return () => clearTimeout(handler);
    }, [homeAddress]);

    const onSubmit = async (data) => {
        try {
            console.log("داده‌های فرم قبل از ارسال:", data);

            const formattedData = {
                lName: data.lastName.trim(),
                fName: data.firstName.trim(),
                userAbout: data.userAbout ? data.userAbout.trim() : "",
                linkdinProfile: data.linkdin ? data.linkdin.trim() : "",
                telegramLink: data.telegram ? data.telegram.trim() : "",
                receiveMessageEvent: data.receiveMessageEvent ?? false,
                homeAdderess: data.address.trim(),
                nationalCode: data.nationalCode.trim(),
                gender: data.gender?.value ?? false,
                birthDay: data.birthday ? new Date(data.birthday).toISOString().slice(0, 19) : null,
                latitude: data.latitude || "",
                longitude: data.longitude || "",
            };

            console.log("داده‌های فرمت‌شده برای API:", formattedData);

            await mutate(formattedData, {
                onSuccess: (response) => {
                    toast.success("تغییرات با موفقیت ذخیره شد!");
                },
                onError: (error) => {
                    console.error("خطای API:", error);
                    const errorMessages = error.response?.data?.ErrorMessage || [error.message];
                    const uniqueMessages = [...new Set(errorMessages)];
                    uniqueMessages.forEach((msg) => toast.error(msg));
                    if (errorMessages.some((msg) => msg.includes("نام"))) {
                        setError("firstName", { message: "لطفاً نام را وارد کنید" });
                    }
                    if (errorMessages.some((msg) => msg.includes("نام خانوادگی"))) {
                        setError("lastName", { message: "لطفاً نام خانوادگی را وارد کنید" });
                    }
                    if (errorMessages.some((msg) => msg.includes("آدرس"))) {
                        setError("address", { message: "آدرس باید بیشتر از ۱۰ کاراکتر باشد" });
                    }
                },
            });
        } catch (error) {
            console.error("خطا در ارسال:", error);
            toast.error("خطا در ذخیره تغییرات: " + error.message);
        }
    };

    return (
        <Form className="mt-2 pt-50" onSubmit={handleSubmit(onSubmit)}>
            <Row>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="firstName">
                        نام
                    </Label>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="firstName"
                                placeholder="نام"
                                invalid={errors.firstName && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.firstName && (
                        <FormFeedback>{errors.firstName.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="lastName">
                        نام خانوادگی
                    </Label>
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="lastName"
                                placeholder="نام خانوادگی"
                                invalid={errors.lastName && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.lastName && (
                        <FormFeedback>{errors.lastName.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="email">
                        ایمیل
                    </Label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="email"
                                id="email"
                                placeholder="ایمیل"
                                invalid={errors.email && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.email && (
                        <FormFeedback>{errors.email.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="phoneNumber">
                        شماره تماس
                    </Label>
                    <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="phoneNumber"
                                placeholder="0999 999 9999"
                                type="tel"
                                invalid={errors.phoneNumber && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.phoneNumber && (
                        <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="userAbout">
                        درباره کاربر
                    </Label>
                    <Controller
                        name="userAbout"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="userAbout"
                                placeholder="یه چیز بگو دیگه"
                                invalid={errors.userAbout && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.userAbout && (
                        <FormFeedback>{errors.userAbout.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="gender">
                        جنسیت
                    </Label>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <Select
                                id="gender"
                                isClearable={false}
                                className="react-select"
                                classNamePrefix="select"
                                options={genderOptions}
                                theme={selectThemeColors}
                                value={field.value}
                                onChange={(selected) => field.onChange(selected)}
                            />
                        )}
                    />
                    {errors.gender && (
                        <FormFeedback>{errors.gender.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="nationalCode">
                        کدملی
                    </Label>
                    <Controller
                        name="nationalCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="nationalCode"
                                placeholder="1111111111"
                                invalid={errors.nationalCode && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.nationalCode && (
                        <FormFeedback>{errors.nationalCode.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="linkdin">
                        لینکدین
                    </Label>
                    <Controller
                        name="linkdin"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="linkdin"
                                placeholder="https://linkedin.com/in/yourprofile"
                                invalid={errors.linkdin && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.linkdin && (
                        <FormFeedback>{errors.linkdin.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="telegram">
                        تلگرام
                    </Label>
                    <Controller
                        name="telegram"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="telegram"
                                placeholder="https://t.me/yourLink"
                                invalid={errors.telegram && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.telegram && (
                        <FormFeedback>{errors.telegram.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="birthday">
                        تاریخ تولد
                    </Label>
                    <Controller
                        name="birthday"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="date"
                                id="birthday"
                                invalid={errors.birthday && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.birthday && (
                        <FormFeedback>{errors.birthday.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="address">
                        آدرس
                    </Label>
                    <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="address"
                                placeholder="خیابون فلان، کوچه بهمان، پلاک ۱۲"
                                invalid={errors.address && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.address && (
                        <FormFeedback>{errors.address.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="latitude">
                        عرض جغرافیایی
                    </Label>
                    <Controller
                        name="latitude"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="latitude"
                                placeholder="35.6892"
                                type="number"
                                step="any"
                                invalid={errors.latitude && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.latitude && (
                        <FormFeedback>{errors.latitude.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="6" className="mb-1">
                    <Label className="form-label" for="longitude">
                        طول جغرافیایی
                    </Label>
                    <Controller
                        name="longitude"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="longitude"
                                placeholder="51.3890"
                                type="number"
                                step="any"
                                invalid={errors.longitude && true}
                                {...field}
                            />
                        )}
                    />
                    {errors.longitude && (
                        <FormFeedback>{errors.longitude.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="4" className="mb-1">
                    <Label className="form-label" for="userId">
                        شناسه کاربری
                    </Label>
                    <Controller
                        name="userId"
                        control={control}
                        render={({ field }) => (
                            <Input id="userId" {...field} disabled />
                        )}
                    />
                </Col>
                <Col sm="2" className="mb-1 pt-2 d-flex justify-content-center align-items-center">
                    <Label className="form-label mx-1" for="receiveMessageEvent">
                        دریافت اعلانات
                    </Label>
                    <Controller
                        id="receiveMessageEvent"
                        name="receiveMessageEvent"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                invalid={errors.receiveMessageEvent && true}
                            />
                        )}
                    />
                    {errors.receiveMessageEvent && (
                        <FormFeedback>{errors.receiveMessageEvent.message}</FormFeedback>
                    )}
                </Col>
                <Col sm="12" className="mb-1">
                    <Label className="form-label" for="map">
                        انتخاب موقعیت مکانی
                    </Label>
                    <div style={{ height: "300px", width: "100%" }}>
                        {isClient && position && (
                            <MapContainer
                                center={position}
                                zoom={13}
                                style={{ height: "100%", width: "100%", zIndex: "1" }}
                            >
                                <MapComponent
                                    position={position}
                                    setPosition={setPosition}
                                    setValue={setValue}
                                />
                            </MapContainer>
                        )}
                    </div>
                </Col>
                <Col className="mt-2" sm="12">
                    <Button
                        type="submit"
                        className="me-1"
                        color="primary"
                        disabled={isLoading || Object.keys(errors).length > 0}
                    >
                        {isLoading ? "در حال ارسال..." : "ویرایش مشخصات"}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default UserProfileForm;