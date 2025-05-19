// ** React Imports
import { Fragment, useState, useEffect } from "react";

// ** Third Party Components
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { toast } from "react-hot-toast";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input } from "reactstrap";

// ** Leaflet Imports
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// تنظیم آیکون Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// کامپوننت نقشه
const MapComponent = ({ position, setPosition, setValue }) => {
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

const Address = ({ stepper, userAllInfo }) => {
  // ** State
  const [position, setPosition] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // ** Hooks
  const { control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      homeAddress: userAllInfo?.homeAdderess || "",
      longitude: userAllInfo?.longitude || "",
      latitude: userAllInfo?.latitude || "",
    },
  });

  const homeAddress = watch("homeAddress");

  useEffect(() => {
    setIsClient(true);
  }, []);

  // دریافت موقعیت پیش‌فرض از userAllInfo
  useEffect(() => {
    if (userAllInfo?.latitude && userAllInfo?.longitude) {
      const lat = parseFloat(userAllInfo.latitude);
      const lng = parseFloat(userAllInfo.longitude);
      setPosition([lat, lng]);
      setValue("latitude", lat.toString());
      setValue("longitude", lng.toString());
    }
  }, [userAllInfo, setValue]);

  // تابع جستجوی آدرس با Nominatim
  const handleAddressSearch = async (address) => {
    if (!address) return;

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
        toast.error("آدرس یافت نشد. لطفاً آدرس دقیق‌تری وارد کنید.");
      }
    } catch (error) {
      toast.error("خطا در جستجوی آدرس: " + error.message);
    }
  };

  // نظارت بر تغییرات فیلد آدرس
  useEffect(() => {
    const handler = setTimeout(() => {
      if (homeAddress) {
        handleAddressSearch(homeAddress);
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [homeAddress]);

  const onSubmit = (data) => {
    stepper.next(data);
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="homeAddress">
              آدرس
            </Label>
            <Controller
              id="homeAddress"
              name="homeAddress"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="مثال: تهران، خیابان ولیعصر، پلاک 123"
                  {...field}
                />
              )}
            />
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="longitude">
              طول جغرافیایی
            </Label>
            <Controller
              id="longitude"
              name="longitude"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="latitude">
              عرض جغرافیایی
            </Label>
            <Controller
              id="latitude"
              name="latitude"
              control={control}
              render={({ field }) => <Input {...field} />}
            />
          </Col>
        </Row>
        <Row>
          <Col md="12" className="mb-1">
            <Label className="form-label" for="location">
              انتخاب موقعیت مکانی
            </Label>
            <div style={{ height: "300px", width: "100%" }}>
              {isClient && position && (
                <MapComponent
                  position={position}
                  setPosition={setPosition}
                  setValue={setValue}
                />
              )}
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            type="button"
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
            <span className="align-middle d-sm-inline-block d-none">قبلی</span>
          </Button>
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">بعدی</span>
            <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default Address;
