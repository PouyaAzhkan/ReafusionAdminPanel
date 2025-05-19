import { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
import { useEditTermTime } from "../../@core/Services/Api/Terms/Terms";
import "@styles/react/libs/react-select/_react-select.scss";

const EditTermTimeInfo = ({
  showEditModal,
  setShowEditModal,
  selectedTermTime,
  onBuildingUpdated,
}) => {
  const { mutate, isLoading } = useEditTermTime();

  const {
    reset,
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      closeReason: "",
      startCloseDate: "",
      endCloseDate: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (selectedTermTime) {
      reset({
        closeReason: selectedTermTime.closeReason || "",
        startCloseDate: selectedTermTime.startCloseDate?.split("T")[0] || "",
        endCloseDate: selectedTermTime.endCloseDate?.split("T")[0] || "",
      });
    }
  }, [selectedTermTime, reset]);

  const onSubmit = (data) => {
    if (new Date(data.startCloseDate) > new Date(data.endCloseDate)) {
      setError("endCloseDate", {
        type: "manual",
        message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
      });
      return;
    }

    const termId = parseInt(selectedTermTime?.termId);
    if (!termId || isNaN(termId)) {
      Swal.fire({
        icon: "error",
        title: "خطا",
        text: "شناسه ترم معتبر نیست.",
        customClass: { confirmButton: "btn btn-danger" },
      });
      return;
    }

    const formattedData = {
      id: selectedTermTime?.id || 0,
      closeReason: data.closeReason,
      startCloseDate: data.startCloseDate ? `${data.startCloseDate}T00:00:00Z` : null,
      endCloseDate: data.endCloseDate ? `${data.endCloseDate}T00:00:00Z` : null,
      termId: termId,
      command: "UpdateTermCloseDate",
    };

    mutate(formattedData, {
      onSuccess: (response) => {
        Swal.fire({
          icon: "success",
          title: "ویرایش موفقیت‌آمیز",
          text: "اطلاعات زمان بسته شدن ترم با موفقیت به‌روزرسانی شد.",
          customClass: { confirmButton: "btn btn-success" },
        });
        setShowEditModal(false);
        if (onBuildingUpdated) {
          onBuildingUpdated(formattedData);
        }
        reset();
      },
      onError: (error) => {
        let errorText = "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
        if (error.response?.data) {
          errorText = error.response.data.title || errorText;
          if (error.response.data.errors) {
            errorText += ": " + Object.values(error.response.data.errors).join(", ");
          }
        }
        Swal.fire({
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
          <h1 className="mb-1">ویرایش اطلاعات زمان بسته شدن ترم</h1>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="gy-1 pt-75">
            <Col md={12} xs={12}>
              <Label className="form-label" for="termName">
                نام ترم
              </Label>
              <Input
                id="termName"
                value={selectedTermTime?.termName || "—"}
                disabled
              />
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="closeReason">
                توضیحات بسته شدن <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="closeReason"
                name="closeReason"
                rules={{
                  required: "توضیحات بسته شدن الزامی است",
                  minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد" },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="closeReason"
                    placeholder="توضیح دهید"
                    invalid={!!errors.closeReason}
                  />
                )}
              />
              {errors.closeReason && (
                <div className="invalid-feedback">{errors.closeReason.message}</div>
              )}
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="startCloseDate">
                تاریخ شروع بسته شدن <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="startCloseDate"
                name="startCloseDate"
                rules={{ required: "تاریخ شروع بسته شدن الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    id="startCloseDate"
                    invalid={!!errors.startCloseDate}
                  />
                )}
              />
              {errors.startCloseDate && (
                <div className="invalid-feedback">{errors.startCloseDate.message}</div>
              )}
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="endCloseDate">
                تاریخ پایان بسته شدن <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="endCloseDate"
                name="endCloseDate"
                rules={{ required: "تاریخ پایان بسته شدن الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    id="endCloseDate"
                    invalid={!!errors.endCloseDate}
                  />
                )}
              />
              {errors.endCloseDate && (
                <div className="invalid-feedback">{errors.endCloseDate.message}</div>
              )}
            </Col>
          </Row>

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

export default EditTermTimeInfo;