import { Row, Col, Input, Form, Button, Label, Modal, ModalHeader, ModalBody } from "reactstrap";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CourseStatusValidation } from "../../../../@core/utils/Validation";
import AddStatus from "../../../../@core/Services/Api/Courses/ManageStatus/AddStatus";
import EditStatus from "../../../../@core/Services/Api/Courses/ManageStatus/EditStatus";
import toast from "react-hot-toast";

const AddStatusModal = ({
  showModal,
  setShowModal,
  refetch,
  variantState,
  categoryDetails,
}) => {
  const titleVariant = {
    create: "افزودن وضعیت جدید",
    update: "ویرایش وضعیت",
  };

  // Mutation برای افزودن و ویرایش وضعیت
  const { mutate: addStatus } = AddStatus();
  const { mutate: updateStatus } = EditStatus();

  // مقادیر اولیه فرم
  const defaultValues = {
    statusName: variantState === "update" && categoryDetails?.statusName ? categoryDetails.statusName : "",
    describe: variantState === "update" && categoryDetails?.describe ? categoryDetails.describe : "",
    statusNumber: variantState === "update" && categoryDetails?.statusNumber ? Number(categoryDetails.statusNumber) : "",
  };

  // تنظیم فرم با react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(CourseStatusValidation),
    mode: "onSubmit",
  });

  // ریست فرم هنگام باز شدن مودال
  useEffect(() => {
    console.log("useEffect triggered", { showModal, variantState, categoryDetails });
    if (showModal) {
      reset(defaultValues, { keepErrors: false, shouldValidate: false });
    }
  }, [showModal, variantState, categoryDetails, reset]);

  // ریست فرم هنگام بسته شدن مودال
  useEffect(() => {
    if (!showModal) {
      reset(
        { statusName: "", describe: "", statusNumber: "" },
        { keepErrors: false, shouldValidate: false }
      );
    }
  }, [showModal, reset]);

  // مدیریت افزودن وضعیت
  const handleAddStatus = (data) => {
    addStatus(data, {
      onSuccess: () => {
        toast.success("وضعیت با موفقیت اضافه شد");
        console.log("Added status:", data);
        refetch();
        setShowModal(false);
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.ErrorMessage || error.ErrorMessage || "خطا در افزودن وضعیت";
        toast.error(`${errorMessage}`);
      },
    });
  };

  // // مدیریت ویرایش وضعیت
  const handleUpdateStatus = (data) => {
    updateStatus({ ...data, id: categoryDetails.id }, {
      onSuccess: () => {
        toast.success("وضعیت با موفقیت ویرایش شد");
        console.log("Updated status:", data);
        refetch();
        setShowModal(false);
      },
      onError: () => {
        toast.error("خطا در ویرایش وضعیت");
      },
    });
  };

  // ارسال فرم
  const onSubmit = (data) => {
    const dataToSend = {
      statusName: data.statusName,
      describe: data.describe,
      statusNumber: Number(data.statusNumber), // اطمینان از ارسال عدد
    };

    console.log("Form submitted:", dataToSend);
    if (variantState === "create") {
      handleAddStatus(dataToSend);
    } else {
      handleUpdateStatus(dataToSend);
    }
  };

  return (
    <div className="vertically-centered-modal">
      <Modal
        className="modal-dialog-centered modal-md"
        isOpen={showModal}
        toggle={() => setShowModal(false)}
      >
        <ModalHeader toggle={() => setShowModal(false)}>
          {titleVariant[variantState] || "مدیریت وضعیت"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col sm="12">
                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="statusName">
                    نوع وضعیت
                  </Label>
                  <Controller
                    name="statusName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="text"
                        id="statusName"
                        className="text-primary"
                        placeholder="نوع وضعیت"
                        invalid={!!errors.statusName}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          console.log("statusName changed:", e.target.value);
                        }}
                      />
                    )}
                  />
                  {errors.statusName && (
                    <div className="text-danger">{errors.statusName.message}</div>
                  )}
                </Col>

                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="describe">
                    توضیحات وضعیت
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
                        onChange={(e) => {
                          field.onChange(e);
                          console.log("describe changed:", e.target.value);
                        }}
                      />
                    )}
                  />
                  {errors.describe && (
                    <div className="text-danger">{errors.describe.message}</div>
                  )}
                </Col>

                <Col sm="12" className="mb-1">
                  <Label className="form-label" for="statusNumber">
                    شماره یکتا وضعیت
                  </Label>
                  <Controller
                    name="statusNumber"
                    control={control}
                    render={({ field }) => (
                      <Input
                        type="number"
                        id="statusNumber"
                        className="text-primary"
                        placeholder="شماره یکتا"
                        invalid={!!errors.statusNumber}
                        {...field}
                        value={field.value ?? ""} // مدیریت مقدار null
                        onChange={(e) => {
                          field.onChange(Number(e.target.value) || "");
                          console.log("statusNumber changed:", e.target.value);
                        }}
                      />
                    )}
                  />
                  {errors.statusNumber && (
                    <div className="text-danger">{errors.statusNumber.message}</div>
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
                      reset(defaultValues, { keepErrors: false, shouldValidate: false });
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

export default AddStatusModal;