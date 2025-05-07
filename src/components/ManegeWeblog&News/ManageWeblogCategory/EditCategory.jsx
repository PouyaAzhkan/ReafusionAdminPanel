import { Fragment, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Col,
  FormFeedback,
} from "reactstrap";
import { Camera } from "react-feather";
import { EditCategoryWeblog } from "../../../@core/Services/Api/Weblog&News/EditWeblogCategory";

const EditCategory = ({ isOpen, toggle, category }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      googleTitle: "",
      googleDescribe: "",
    },
    mode: "onChange",
  });

  const [imageSrc, setImageSrc] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // تنظیم مقادیر فرم بعد از دریافت category از API
  useEffect(() => {
    if (category) {
      reset({
        title: category.categoryName || "",
        googleTitle: category.googleTitle || "",
        googleDescribe: category.googleDescribe || "",
      });
      setImageSrc(category.image || "");
    }
  }, [category, reset]);

  const { mutate } = EditCategoryWeblog();

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append('Id', category.id)
    formData.append("CategoryName", data.title);
    formData.append("GoogleTitle", data.googleTitle);
    formData.append("GoogleDescribe", data.googleDescribe);
    if (Image) formData.append("Image", Image);

    mutate(formData, {
      onSuccess: (data) => {
         console.log(formData); 
         console.log(data);
         alert("دسته بنید با موفقیت ویرایش شد")
         toggle();       
      },
      onError: (error) => {
         alert("خطا در ویرایش");
         console.log(error);
         toggle();       
      }
    })
  };

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader toggle={toggle}>ویرایش دسته‌بندی</ModalHeader>
        <ModalBody className="d-flex gap-2">
          <div className="w-50">
            <form className="w-100">
              {/* عنوان دسته‌بندی */}
              <Col md="12" className="mb-1">
                <Label>عنوان دسته‌بندی</Label>
                <Controller
                  control={control}
                  name="title"
                  rules={{ required: "این فیلد اجباری است" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      className="text-primary"
                      placeholder="عنوان دسته‌بندی"
                      invalid={!!errors.title}
                    />
                  )}
                />
                {errors.title && (
                  <FormFeedback>{errors.title.message}</FormFeedback>
                )}
              </Col>

              {/* عنوان گوگل */}
              <Col md="12" className="mb-1">
                <Label>عنوان گوگل</Label>
                <Controller
                  control={control}
                  name="googleTitle"
                  rules={{
                    required: "این فیلد اجباری است",
                    minLength: {
                      value: 40,
                      message: "حداقل باید ۴۰ کاراکتر باشد",
                    },
                    maxLength: {
                      value: 70,
                      message: "حداکثر باید ۷۰ کاراکتر باشد",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="text"
                      className="text-primary"
                      placeholder="عنوان گوگل"
                      invalid={!!errors.googleTitle}
                    />
                  )}
                />
                {errors.googleTitle && (
                  <FormFeedback>{errors.googleTitle.message}</FormFeedback>
                )}
              </Col>

              {/* توضیحات گوگل */}
              <Col md="12" className="mb-1">
                <Label>توضیحات گوگل</Label>
                <Controller
                  control={control}
                  name="googleDescribe"
                  rules={{
                    required: "این فیلد اجباری است",
                    minLength: {
                      value: 70,
                      message: "حداقل باید ۷۰ کاراکتر باشد",
                    },
                    maxLength: {
                      value: 150,
                      message: "حداکثر باید ۱۵۰ کاراکتر باشد",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="textarea"
                      className="text-primary"
                      placeholder="توضیحات گوگل"
                      invalid={!!errors.googleDescribe}
                    />
                  )}
                />
                {errors.googleDescribe && (
                  <FormFeedback>{errors.googleDescribe.message}</FormFeedback>
                )}
              </Col>
            </form>
          </div>

          {/* آپلود تصویر */}
          <div className="w-50">
            <Col
              md="6"
              className="mb-1"
              style={{ width: "100%", height: "250px", position: "relative" }}
            >
              <img
                className="w-100 h-100 rounded-4"
                src={imageSrc || ""}
              />
              <Label
                for="Image"
                style={{
                  border: "1px solid #ccc",
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
                  accept="image/*"
                  id="Image"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageSrc(URL.createObjectURL(file));
                      setImageFile(file);
                    }
                  }}
                />
              </Label>
            </Col>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit(onSubmit)}>
            ویرایش دسته‌بندی
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default EditCategory;
