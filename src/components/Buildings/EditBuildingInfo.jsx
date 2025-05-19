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
import "@styles/react/libs/react-select/_react-select.scss";
import { useEffect, useRef, useState } from "react";
import { useEditBuilding } from "../../@core/Services/Api/Buildings/Buildings";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// تنظیم آیکون Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// کامپوننت نقشه
const MapComponent = ({ position, setPosition, setValue }) => {
  const mapRef = useRef(null);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setValue("latitude", lat.toString());
        setValue("longitude", lng.toString());
      },
    });
    return null;
  };

  return (
    <MapContainer
      ref={mapRef}
      center={position}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      key={`${position[0]}-${position[1]}`}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler />
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            setPosition([lat, lng]);
            setValue("latitude", lat.toString());
            setValue("longitude", lng.toString());
          },
        }}
      />
    </MapContainer>
  );
};

const MySwal = withReactContent(Swal);

const statusOptions = [
  { value: true, label: "فعال" },
  { value: false, label: "غیرفعال" },
];

const EditBuildingInfo = ({
  showEditModal,
  setShowEditModal,
  selectedBuilding,
  onBuildingUpdated,
}) => {
  const { mutate, isLoading } = useEditBuilding(); // فرض بر وجود این هوک
  const containerRef = useRef(null); // تعریف containerRef
  const [position, setPosition] = useState([35.6892, 51.3890]); // موقعیت اولیه (مثال: تهران)
  const [isClient, setIsClient] = useState(false); // برای رندر کلاینت‌ساید

  const {
    reset,
    control,
    setError,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      buildingName: "",
      workDate: "",
      floor: "",
      latitude: "",
      longitude: "",
      active: statusOptions[0],
    },
    mode: "onChange",
  });

  // تنظیم موقعیت اولیه نقشه و فرم بر اساس داده‌های ساختمان
  useEffect(() => {
    if (selectedBuilding) {
      const lat = parseFloat(selectedBuilding.latitude);
      const lng = parseFloat(selectedBuilding.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setPosition([lat, lng]);
      } else {
        setPosition([35.6892, 51.3890]); // موقعیت پیش‌فرض
      }

      reset({
        buildingName: selectedBuilding.buildingName || "",
        workDate: selectedBuilding.workDate?.split("T")[0] || "",
        floor: selectedBuilding.floor?.toString() || "",
        latitude: selectedBuilding.latitude?.toString() || "",
        longitude: selectedBuilding.longitude?.toString() || "",
        active:
          selectedBuilding.active !== undefined
            ? statusOptions.find((s) => s.value === selectedBuilding.active) ||
              statusOptions[0]
            : statusOptions[0],
      });
    }
  }, [selectedBuilding, reset]);

  // اطمینان از رندر کلاینت‌ساید
  useEffect(() => {
    setIsClient(true); // بعد از مونت شدن کامپوننت، isClient را true کنید
  }, []);

  const onSubmit = (data) => {
    // اعتبارسنجی تاریخ کاری
    const workDate = data.workDate ? new Date(data.workDate) : null;
    if (!workDate || isNaN(workDate.getTime())) {
      setError("workDate", { type: "manual", message: "تاریخ کاری نامعتبر است" });
      return;
    }

    const minDate = new Date("1753-01-01");
    const maxDate = new Date("9999-12-31");
    if (workDate < minDate || workDate > maxDate) {
      setError("workDate", {
        type: "manual",
        message: "تاریخ کاری باید بین 1753 و 9999 باشد",
      });
      return;
    }

    // اعتبارسنجی مختصات
    const lat = parseFloat(data.latitude);
    const lng = parseFloat(data.longitude);
    if (
      data.latitude &&
      data.longitude &&
      (isNaN(lat) ||
        isNaN(lng) ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180)
    ) {
      setError("latitude", {
        type: "manual",
        message: "مختصات نامعتبر است",
      });
      setError("longitude", {
        type: "manual",
        message: "مختصات نامعتبر است",
      });
      return;
    }

    // تبدیل تاریخ به فرمت ISO 8601
    const formattedWorkDate = workDate.toISOString();

    const payload = {
      id: selectedBuilding?.id,
      buildingName: data.buildingName,
      workDate: formattedWorkDate,
      floor: parseInt(data.floor),
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      active: data.active.value,
    };

    mutate(payload, {
      onSuccess: () => {
        MySwal.fire({
          icon: "success",
          title: "ویرایش موفقیت‌آمیز",
          text: "اطلاعات ساختمان با موفقیت به‌روزرسانی شد.",
          customClass: { confirmButton: "btn btn-success" },
        });
        setShowEditModal(false);
        if (onBuildingUpdated) {
          onBuildingUpdated(payload);
        }
        reset();
      },
      onError: (error) => {
        let errorText = "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
        if (error.response?.data) {
          errorText = error.response.data.ErrorMessage || errorText;
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
    setShowEditModal(false);
    setPosition([35.6892, 51.3890]); // بازگرداندن به موقعیت اولیه
  };

  return (
    <Modal
      isOpen={showEditModal}
      toggle={() => setShowEditModal(!showEditModal)}
      className="modal-dialog-centered modal-lg"
    >
      <ModalHeader
        className="bg-transparent"
        toggle={() => setShowEditModal(!showEditModal)}
      ></ModalHeader>
      <ModalBody className="px-sm-5 pt-50 pb-5">
        <div className="text-center mb-2">
          <h1 className="mb-1">ویرایش اطلاعات ساختمان</h1>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* بخش فیلدها */}
          <Row className="gy-1 pt-75">
            <Col md={6} xs={12}>
              <Label className="form-label" for="buildingName">
                نام ساختمان <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="buildingName"
                name="buildingName"
                rules={{
                  required: "نام ساختمان الزامی است",
                  minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد" },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="buildingName"
                    placeholder="نام ساختمان"
                    invalid={!!errors.buildingName}
                  />
                )}
              />
              {errors.buildingName && (
                <div className="invalid-feedback">{errors.buildingName.message}</div>
              )}
            </Col>
            <Col md={6} xs={12}>
              <Label className="form-label" for="workDate">
                تاریخ کاری <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="workDate"
                name="workDate"
                rules={{ required: "تاریخ کاری الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    id="workDate"
                    invalid={!!errors.workDate}
                  />
                )}
              />
              {errors.workDate && (
                <div className="invalid-feedback">{errors.workDate.message}</div>
              )}
            </Col>
            <Col md={6} xs={12}>
              <Label className="form-label" for="floor">
                تعداد طبقات <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="floor"
                name="floor"
                rules={{
                  required: "تعداد طبقات الزامی است",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "فقط اعداد مجاز هستند",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="floor"
                    placeholder="تعداد طبقات"
                    invalid={!!errors.floor}
                  />
                )}
              />
              {errors.floor && (
                <div className="invalid-feedback">{errors.floor.message}</div>
              )}
            </Col>
            <Col md={6} xs={12}>
              <Label className="form-label" for="latitude">
                عرض جغرافیایی
              </Label>
              <Controller
                control={control}
                id="latitude"
                name="latitude"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="latitude"
                    placeholder="عرض جغرافیایی"
                    invalid={!!errors.latitude}
                  />
                )}
              />
              {errors.latitude && (
                <div className="invalid-feedback">{errors.latitude.message}</div>
              )}
            </Col>
            <Col md={6} xs={12}>
              <Label className="form-label" for="longitude">
                طول جغرافیایی
              </Label>
              <Controller
                control={control}
                id="longitude"
                name="longitude"
                render={({ field }) => (
                  <Input
                    {...field}
                    id="longitude"
                    placeholder="طول جغرافیایی"
                    invalid={!!errors.longitude}
                  />
                )}
              />
              {errors.longitude && (
                <div className="invalid-feedback">{errors.longitude.message}</div>
              )}
            </Col>
            <Col md={6} xs={12}>
              <Label className="form-label" for="active">
                وضعیت <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="active"
                name="active"
                rules={{ required: "وضعیت الزامی است" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="active"
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={statusOptions}
                    theme={selectThemeColors}
                    onChange={(option) => field.onChange(option)}
                  />
                )}
              />
              {errors.active && (
                <div className="invalid-feedback d-block">{errors.active.message}</div>
              )}
            </Col>
          </Row>

          {/* بخش نقشه */}
          <div className="mt-2">
            <Label className="form-label">
              انتخاب لوکیشن <span className="text-danger">*</span>
            </Label>
            <div
              ref={containerRef}
              style={{ height: "300px", width: "100%", position: "relative" }}
            >
              {isClient && (
                <MapComponent
                  position={position}
                  setPosition={setPosition}
                  setValue={setValue}
                />
              )}
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="text-center mt-2 pt-50">
            <Button
              type="submit"
              className="me-1"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? "در حال ارسال..." : "ثبت"}
            </Button>
            <Button type="reset" color="secondary" outline onClick={handleReset}>
              انصراف
            </Button>
          </div>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default EditBuildingInfo;