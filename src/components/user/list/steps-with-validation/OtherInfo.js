// ** React Imports
import { Fragment } from "react";

// ** Third Party Components
import { ArrowLeft } from "react-feather";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

// ** Reactstrap Imports
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";

const OtherInfo = ({ stepper, userAllInfo }) => {
  // ** مقادیر پیش‌فرض فرم از userAllInfo
  const defaultValues = {
    userAbout: userAllInfo?.userAbout || "",
    telegramLink: userAllInfo?.telegramLink || "",
    linkedinLink: userAllInfo?.linkdinProfile || "",
    isActive: userAllInfo?.active || false,
    isTecher: userAllInfo?.isTecher || false,
    isStudent: userAllInfo?.isStudent || false,
    gender: userAllInfo?.gender
      ? { value: userAllInfo.gender, label: userAllInfo.gender ? "مرد" : "زن" }
      : null,
  };

  // ** گزینه‌های جنسیت
  const genderOptions = [
    { value: false, label: "زن" },
    { value: true, label: "مرد" },
  ];

  // ** Hooks برای فرم
  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  // ** مدیریت ارسال فرم
  const onSubmit = (data) => {
    const isValid = Object.values(data).every(
      (field) => field !== "" && field !== null && field !== undefined
    );

    if (isValid) {
      stepper.submit(data);
    } else {
      for (const key in data) {
        if (data[key] === "" || data[key] === null || data[key] === undefined) {
          setError(key, {
            type: "manual",
            message: `لطفاً مقدار معتبر برای ${key} وارد کنید`,
          });
        }
      }
    }
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">سایر مشخصات کاربری</h5>
        <small>دیگر اطلاعات کاربر</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="userAbout">
              درباره کاربر
            </Label>
            <Controller
              id="userAbout"
              name="userAbout"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="درباره خودتان بنویسید"
                  invalid={errors.userAbout && true}
                  {...field}
                />
              )}
            />
            {errors.userAbout && (
              <FormFeedback>{errors.userAbout.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="gender">
              جنسیت
            </Label>
            <Controller
              id="gender"
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                  options={genderOptions}
                  value={field.value}
                  onChange={(selected) => field.onChange(selected)}
                  placeholder="انتخاب جنسیت"
                />
              )}
            />
            {errors.gender && (
              <FormFeedback>{errors.gender.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="telegramLink">
              تلگرام
            </Label>
            <Controller
              id="telegramLink"
              name="telegramLink"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="https://t.me/yourLink"
                  invalid={errors.telegramLink && true}
                  {...field}
                />
              )}
            />
            {errors.telegramLink && (
              <FormFeedback>{errors.telegramLink.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="linkedinLink">
              لینکدین
            </Label>
            <Controller
              id="linkedinLink"
              name="linkedinLink"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="https://linkedin.com/in/yourprofile"
                  invalid={errors.linkedinLink && true}
                  {...field}
                />
              )}
            />
            {errors.linkedinLink && (
              <FormFeedback>{errors.linkedinLink.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="2" className="mb-1">
            <Label className="form-label" for="isActive">
              فعال
            </Label>
            <Controller
              id="isActive"
              name="isActive"
              control={control}
              render={({ field }) => (
                <Input
                  type="switch"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  invalid={errors.isActive && true}
                />
              )}
            />
            {errors.isActive && (
              <FormFeedback>{errors.isActive.message}</FormFeedback>
            )}
          </Col>
          <Col md="2" className="mb-1">
            <Label className="form-label" for="isTecher">
              استاد
            </Label>
            <Controller
              id="isTecher"
              name="isTecher"
              control={control}
              render={({ field }) => (
                <Input
                  type="switch"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  invalid={errors.isTecher && true}
                />
              )}
            />
            {errors.isTecher && (
              <FormFeedback>{errors.isTecher.message}</FormFeedback>
            )}
          </Col>
          <Col md="2" className="mb-1">
            <Label className="form-label" for="isStudent">
              دانشجو
            </Label>
            <Controller
              id="isStudent"
              name="isStudent"
              control={control}
              render={({ field }) => (
                <Input
                  type="switch"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  invalid={errors.isStudent && true}
                />
              )}
            />
            {errors.isStudent && (
              <FormFeedback>{errors.isStudent.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            color="primary"
            className="btn-prev"
            onClick={() => stepper.previous()}
          >
            <ArrowLeft
              size={14}
              className="align-middle me-sm-25 me-0"
            ></ArrowLeft>
            <span className="align-middle d-sm-inline-block d-none">قبلی</span>
          </Button>
          <Button type="submit" color="success" className="btn-submit">
            ثبت اطلاعات
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default OtherInfo;
