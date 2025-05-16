import { Row, Col,  Input, Form,Button, Label, Modal, ModalHeader, ModalBody,} from "reactstrap";
import { useEffect } from "react";
import {CourseLevelsValidation} from "../../../../@core/utils/Validation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AddCourseLevel from "../../../../@core/Services/Api/Courses/ManageLevel/AddCourseLevel";
import EditCourseLevel from "../../../../@core/Services/Api/Courses/ManageLevel/EditCourseLevel";

const AddLevelModal = ({
  showModal,
  setShowModal,
  refetch,
  variantState,
  levelDetails,
}) => {

  const titleVariant = {
    create: "افزودن سطح جدید",
    update: "ویرایش سطح",
  };

  const { mutate: AddLevel } = AddCourseLevel();
  const { mutate: UpdateLevel } = EditCourseLevel();

  const handleAddLevel = (data) => {
    AddLevel(data, {
      onSuccess: () => {
        alert("سطح با موفقیت اضافه شد");
        console.log("Added level:", data);
        refetch();
        setShowModal(false);
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || "خطا در افزودن سطح";
        alert(`خطا: ${errorMessage}`);
        console.error("Error adding level:", error);
      },
    });
  };

  const handleUpdateLevel = (data) => {
    UpdateLevel(data, {
      onSuccess: () => {
        alert("سطح با موفقیت ویرایش شد");
        console.log("Updated level:", data);
        refetch();
        setShowModal(false);
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message || "خطا در ویرایش سطح";
        alert(`خطا: ${errorMessage}`);
        console.error("Error updating level:", error);
      },
    });
  };

  // مقادیر اولیه فرم
  const defaultValues = {
    iconAddress: variantState === "update" && levelDetails?.iconAddress ? levelDetails.iconAddress : "",
    levelName: variantState === "update" && levelDetails?.levelName ? levelDetails.levelName : "",
    describe: variantState === "update" && levelDetails?.describe ? levelDetails.describe : "",
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
    resolver: yupResolver(CourseLevelsValidation),
  });

  // ارسال فرم
  const onSubmit = (values) => {
    const dataToSend = {
        levelName: values.levelName,
    };

    console.log("Form submitted:", dataToSend);
    if (variantState === "create") {
      handleAddLevel(dataToSend);
    } else {
      handleUpdateLevel({...dataToSend, id: levelDetails.id});
    }
  };

  // ریست فرم هنگام تغییر showModal یا categoryDetails
  useEffect(() => {
    if (showModal) {
      reset(defaultValues);
    }
  }, [showModal, variantState, levelDetails, reset]);

  return (
    <div className="vertically-centered-modal">
      <Modal
        className="modal-dialog-centered modal-md"
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
      >
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          {titleVariant?.[variantState] || "مدیریت سطح"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="levelName">
                  سطح دوره
                </Label>
                <Controller
                  name="levelName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="text"
                      id="levelName"
                      className="text-primary"
                      placeholder="سطح دوره"
                      invalid={!!errors.levelName}
                      {...field}
                    />
                  )}
                />
                {errors.levelName && (
                  <div className="text-danger">{errors.levelName.message}</div>
                )}
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

export default AddLevelModal;