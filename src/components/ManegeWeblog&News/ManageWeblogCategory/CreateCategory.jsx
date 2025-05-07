import { Fragment, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Label, Col, Input, FormFeedback } from "reactstrap";

const CreateCategory = ({ onDataChange }) => {
  const {
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: "",
      googleTitle: "",
      googleDescribe: "",
    },
    mode: 'onChange' 
  });

  const watchedFields = watch();

  useEffect(() => {
    onDataChange(watchedFields); // ارسال داده به پدر در هر تغییر
  }, [watchedFields]);

  return (
    <Fragment>
      <form className='w-100'>
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
          {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
        </Col>

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
    </Fragment>
  );
};

export default CreateCategory;
