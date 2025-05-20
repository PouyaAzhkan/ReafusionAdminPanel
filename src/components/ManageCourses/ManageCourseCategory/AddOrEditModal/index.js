import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { Camera } from "react-feather";
import {TechnologiesValidation} from "../../../../@core/utils/Validation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddTecnology from "../../../../@core/Services/Api/Courses/ManageCategory/AddTecnology";
import EditTecnology from "../../../../@core/Services/Api/Courses/ManageCategory/EditTecnology";
import toast from "react-hot-toast";

const AddTechnologyModal = ({
  showModal,
  setShowModal,
  refetch,
  variantState,
  categoryDetails,
}) => {
  const [src, setSrc] = useState(null);
  const prevUrlRef = useRef(null); // برای مدیریت URL.createObjectURL

  const titleVariant = {
    create: "افزودن تکنولوژی جدید",
    update: "ویرایش تکنولوژی",
  };

  // Mutation برای ایجاد تکنولوژی
  const { mutate: AddTechnology } = AddTecnology();
  const { mutate: EditTecnologys } = EditTecnology();

  const handleAddtecnology = (data) => {
      AddTechnology(data, {
         onSuccess: () => {
          toast.success('تکنولوژی با موفیت اضافه شد');
          console.log(data);
          refetch();
          setShowModal(false);
         },
         onError: () => {
          toast.error('خطا در افزودن تکنولوژی')
         }
      })
  }
   const handleEdittecnology = (data) => {
      EditTecnologys(data, {
         onSuccess: () => {
          toast.success('تکنولوژی با موفیت ویرایش شد');
          console.log(data);
          refetch();
          setShowModal(false);
         },
         onError: () => {
          toast.error('خطا در ویرایش تکنولوژی')
         }
      })
  }

  // مقادیر اولیه فرم
  const defaultValues = {
    iconAddress: variantState === "update" && categoryDetails?.iconAddress ? categoryDetails.iconAddress : "",
    techName: variantState === "update" && categoryDetails?.techName ? categoryDetails.techName : "",
    describe: variantState === "update" && categoryDetails?.describe ? categoryDetails.describe : "",
  };

  // تنظیم فرم با react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm({
    defaultValues,
    resolver: yupResolver(TechnologiesValidation),
  });

  // مدیریت انتخاب تصویر
  const handleChooseImage = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 200 * 1024) {
    alert("حجم تصویر نباید بیشتر از ۲۰۰ کیلوبایت باشد.");
    return;
  }

  const fileUrl = URL.createObjectURL(file);
  setSrc(fileUrl);
  prevUrlRef.current = fileUrl;

  // ثبت فایل در فرم
  setValue("iconAddress", file, { shouldValidate: true });
};


  // ارسال فرم
  const onSubmit = (values) => {
  const dataToSend = {
    techName: values.techName,
    describe: values.describe,
    iconAddress: values.iconAddress?.name || "", // فقط name فایل
  };

  if (variantState === "create") {
    handleAddtecnology(dataToSend);
  } else {
    handleEdittecnology({ ...dataToSend, id: categoryDetails.id });
  }
};

  return (
    <div className="vertically-centered-modal">
      <Modal
        className="modal-dialog-centered modal-lg"
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
      >
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          {titleVariant?.[variantState] || "مدیریت تکنولوژی"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col
                md="6"
                className="mb-1"
                style={{ height: "230px", position: "relative" }}
              >
                {src && (
                  <img
                    className="w-100 h-100 rounded-4"
                    src={src}
                    alt="تصویر تکنولوژی"
                    onError={(e) => {
                      e.target.src = "/assets/images/fallback.jpg";
                    }}
                  />
                )}
                <Label
                  for="iconAddress"
                  style={{
                    border: "1px solid #ccc",
                    overflow: "hidden",
                    width: "80px",
                    height: "80px",
                    borderRadius: "100%",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    zIndex: "10",
                    transform: "translate(-50%, -50%)",
                    cursor: "pointer",
                  }}
                  className="d-flex align-items-center justify-content-center"
                >
                  <Camera />
                  <input
                    type="file"
                    accept="image/jpg, image/jpeg, image/png"
                    id="iconAddress"
                    className="h-100"
                    style={{ display: "none" }}
                    onChange={handleChooseImage}
                  />
                </Label>
                {errors.iconAddress && (
                  <div className="text-danger mt-1">{errors.iconAddress.message}</div>
                )}
              </Col>
              <Col md="6" sm="12">
                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="techName">
                    عنوان تکنولوژی
                  </Label>
                  <Controller
                    name="techName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="techName"
                        className="text-primary"
                        placeholder="نام تکنولوژی"
                        invalid={!!errors.techName}
                        {...field}
                      />
                    )}
                  />
                  {errors.techName && (
                    <div className="text-danger">{errors.techName.message}</div>
                  )}
                </Col>
                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="describe">
                    توضیحات تکنولوژی
                  </Label>
                  <Controller
                    name="describe"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="describe"
                        className="text-primary"
                        placeholder="توضیحات"
                        invalid={!!errors.describe}
                        {...field}
                      />
                    )}
                  />
                  {errors.describe && (
                    <div className="text-danger">{errors.describe.message}</div>
                  )}
                </Col>
              </Col>
              <Col sm="12">
                <div className="d-flex mt-1">
                  <Button
                    className="me-1"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "در حال ثبت..." : "ثبت"}
                  </Button>
                  <Button
                    outline
                    color="danger"
                    type="button"
                    onClick={() => {
                      reset(defaultValues);
                      if (prevUrlRef.current) {
                        URL.revokeObjectURL(prevUrlRef.current);
                        prevUrlRef.current = null;
                      }
                      setSrc(
                        variantState === "update" && categoryDetails?.iconAddress
                          ? categoryDetails.iconAddress
                          : null
                      );
                    }}
                  >
                    پاک کردن همه
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AddTechnologyModal;