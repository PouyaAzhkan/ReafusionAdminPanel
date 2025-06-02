import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Label, Spinner } from "reactstrap";
import { Camera } from "react-feather";
import { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import ButtonsForMove from "../../../../@core/components/button-for-move/ButtonsForMove";

const validCreateImageCourse = yup.object().shape({
  Text: yup.string().required("لطفا متن جستجو را وارد کنید"),
});

const PictureCourse = ({ courseId, stepper, setImage, setCreateBtn, isPending }) => {
  const [src, setSrc] = useState("");
  const [aiImgStatus, setAiImgStatus] = useState(false);

  const {
    control: searchControl,
    handleSubmit: handleSearchSubmit,
    formState: { errors: searchErrors, isSubmitting: isSearchSubmitting },
  } = useForm({
    defaultValues: { Text: "" },
    resolver: yupResolver(validCreateImageCourse),
  });

  const {
    control: imageControl,
    handleSubmit: handleImageSubmit,
    setValue: setImageValue,
    formState: { isSubmitting: isImageSubmitting },
  } = useForm({
    defaultValues: { Image: "" },
  });

  const onImageSubmit = async (values) => {
    console.log("Image values:", values);
    if (aiImgStatus && src) {
      setImage({ Image: src });
    } else if (values.Image) {
      setImage({ Image: values.Image });
      toast.success("عکس مورد نظر ثبت شد");
    } else {
      toast.error("لطفا یک تصویر انتخاب کنید");
    }
  };

  return (
    <>
      <form onSubmit={handleImageSubmit(onImageSubmit)}>
        <div
          md="6"
          className="mb-1"
          style={{ height: "300px", position: "relative" }}
        >
          <img className="w-100 h-100 rounded-4" src={src} alt="" />
          <Label
            for="Image"
            style={{
              border: "1px solid #ccc",
              overflow: "hidden",
              width: "80px",
              height: "80px",
              borderRadius: "100%",
              position: "absolute",
              top: "50%",
              left: "50%",
              zIndex: "10px",
              translate: "-50% -50%",
              cursor: "pointer",
            }}
            className="d-flex align-items-center justify-content-center"
          >
            <Camera />
            <Controller
              name="Image"
              control={imageControl}
              render={({ field: { onChange } }) => (
                <input
                  type="file"
                  accept="image/jpg, image/jpeg, image/png"
                  id="Image"
                  className="h-100"
                  style={{ display: "none" }}
                  onChange={(event) => {
                    const file = event.target.files[0];
                    const fileUrl = file ? URL.createObjectURL(file) : "";
                    setSrc(fileUrl);
                    if (file) {
                      onChange(file);
                      setImageValue("Image", file);
                    }
                  }}
                />
              )}
            />
          </Label>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          style={{ height: "38px" }}
          disabled={isImageSubmitting}
        >
          ثبت تصویر
        </button>
        <button
          className="btn btn-success ms-2"
          style={{ height: "38px" }}
          onClick={() => setCreateBtn(true)}
          disabled={isPending}
        >
          ساخت دوره {isPending && <Spinner size="sm" color="light" />}
        </button>
      </form>

      <div>
        <ButtonsForMove stepper={stepper} text="برای افزودن دسته‌بندی، به مرحله بعد بروید"/>
      </div>
    </>
  );
};

export default PictureCourse;