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
import Select from "react-select";
import { selectThemeColors } from "@utils";
import "@styles/react/libs/react-select/_react-select.scss";
import { useEditTerm } from "../../@core/Services/Api/Terms/Terms";
import Swal from "sweetalert2";

const expireOption = [
  { value: true, label: "منقضی شده" },
  { value: false, label: "منقضی نشده" },
];

const EditTermInfo = ({
  showEditModal,
  setShowEditModal,
  selectedTerm,
  onBuildingUpdated,
}) => {
  const { mutate, isLoading } = useEditTerm();

  const {
    reset, // اصلاح: از resets به reset تغییر کرد
    control,
    setError,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      termName: '',
      startDate: '',
      endDate: '',
      departmentId: '',
      expire: expireOption[0],
    },
    mode: "onChange",
  });

  // تنظیم داده‌های اولیه فرم بر اساس selectedTerm
  useEffect(() => {
    if (selectedTerm) {
      reset({
        termName: selectedTerm.termName || "",
        startDate: selectedTerm.startDate?.split("T")[0] || "",
        endDate: selectedTerm.endDate?.split("T")[0] || "",
        departmentId: selectedTerm.departmentId?.toString() || "", // تبدیل به string برای input
        expire:
          selectedTerm.expire !== undefined
            ? expireOption.find((s) => s.value === selectedTerm.expire) ||
              expireOption[0]
            : expireOption[0],
      });
    }
  }, [selectedTerm, reset]);

  const onSubmit = (data) => {
    // اعتبارسنجی اضافی
    if (new Date(data.startDate) > new Date(data.endDate)) {
      setError("endDate", {
        type: "manual",
        message: "تاریخ پایان باید بعد از تاریخ شروع باشد",
      });
      return;
    }

    // تبدیل داده‌ها به فرمت مورد نیاز API
    const formattedData = {
      id: selectedTerm?.id,
      termName: data.termName,
      startDate: data.startDate ? `${data.startDate}T00:00:00Z` : null,
      endDate: data.endDate ? `${data.endDate}T00:00:00Z` : null,
      departmentId: parseInt(data.departmentId) || null,
      expire: data.expire.value,
    };

    mutate(formattedData, {
      onSuccess: (response) => {
        Swal.fire({
          icon: "success",
          title: "ویرایش موفقیت‌آمیز",
          text: "اطلاعات ترم با موفقیت به‌روزرسانی شد.",
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
          errorText = error.response.data.ErrorMessage || errorText;
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
          <h1 className="mb-1">ویرایش اطلاعات ترم</h1>
        </div>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="gy-1 pt-75">
            <Col md={12} xs={12}>
              <Label className="form-label" for="termName">
                نام ترم <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="termName"
                name="termName"
                rules={{
                  required: "نام ترم الزامی است",
                  minLength: { value: 2, message: "نام باید حداقل ۲ حرف باشد" },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="termName"
                    placeholder="نام ترم"
                    invalid={!!errors.termName}
                  />
                )}
              />
              {errors.termName && (
                <div className="invalid-feedback">{errors.termName.message}</div>
              )}
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="startDate">
                تاریخ شروع <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="startDate"
                name="startDate"
                rules={{ required: "تاریخ شروع الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    id="startDate"
                    invalid={!!errors.startDate}
                  />
                )}
              />
              {errors.startDate && (
                <div className="invalid-feedback">{errors.startDate.message}</div>
              )}
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="endDate">
                تاریخ پایان <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="endDate"
                name="endDate"
                rules={{ required: "تاریخ پایان الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    id="endDate"
                    invalid={!!errors.endDate}
                  />
                )}
              />
              {errors.endDate && (
                <div className="invalid-feedback">{errors.endDate.message}</div>
              )}
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="departmentId">
                دپارتمان <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="departmentId"
                name="departmentId"
                rules={{
                  required: "شناسه دپارتمان الزامی است",
                  pattern: {
                    value: /^[0-9]+$/,
                    message: "فقط اعداد مجاز هستند",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="departmentId"
                    placeholder="شناسه دپارتمان"
                    invalid={!!errors.departmentId}
                  />
                )}
              />
              {errors.departmentId && (
                <div className="invalid-feedback">{errors.departmentId.message}</div>
              )}
            </Col>
            <Col md={12} xs={12}>
              <Label className="form-label" for="expire">
                وضعیت <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="expire"
                name="expire"
                rules={{ required: "وضعیت الزامی است" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    id="expire"
                    isClearable={false}
                    className="react-select"
                    classNamePrefix="select"
                    options={expireOption}
                    theme={selectThemeColors}
                    onChange={(option) => field.onChange(option)}
                  />
                )}
              />
              {errors.expire && (
                <div className="invalid-feedback d-block">{errors.expire.message}</div>
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

export default EditTermInfo;