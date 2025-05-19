import { Fragment, useEffect } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft, ArrowRight } from "react-feather";
import { Label, Row, Col, Button, Form, Input, FormFeedback } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";

const PersonalInfo = ({ stepper, userAllInfo }) => {
  // تبدیل تاریخ به فرمت YYYY-MM-DD
  const formatDate = (date) => {
    if (!date) return "";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) return "";
      return parsedDate.toISOString().split("T")[0]; // خروجی: YYYY-MM-DD
    } catch {
      return "";
    }
  };

  const defaultValues = {
    firstName: userAllInfo?.fName || "",
    lastName: userAllInfo?.lName || "",
    nationalCode: userAllInfo?.nationalCode || "",
    birthday: formatDate(userAllInfo?.birthDay) || "", // تبدیل فرمت تاریخ
  };

  // validayion
  const UserInfoSchema = yup.object().shape({
    firstName: yup
      .string()
      .min(2, "نام باید حداقل 2 کاراکتر باشد")
      .matches(/^[\p{L}\s]+$/u, "نام فقط می‌تواند شامل حروف و فاصله باشد")
      .required("نام اجباری است"),
    lastName: yup
      .string()
      .min(2, "نام خانوادگی باید حداقل 2 کاراکتر باشد")
      .matches(
        /^[\p{L}\s]+$/u,
        "نام خانوادگی فقط می‌تواند شامل حروف و فاصله باشد"
      )
      .required("نام خانوادگی اجباری است"),
    nationalCode: yup
      .string()
      .matches(/^\d{10}$/, "کد ملی باید دقیقاً 10 رقم باشد")
      .required("کد ملی اجباری است"),
    birthday: yup
      .string()
      .required("تاریخ تولد اجباری است")
      .test("is-valid-date", "تاریخ نامعتبر است", (value) => {
        if (!value) return false;
        return !isNaN(new Date(value).getTime());
      })
      .test("is-past-date", "تاریخ تولد باید در گذشته باشد", (value) => {
        if (!value) return false;
        return new Date(value) <= new Date();
      }),
  });

  // ** Hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, // اضافه کردن reset
  } = useForm({ defaultValues, resolver: yupResolver(UserInfoSchema) });

  // به‌روزرسانی فرم در صورت تغییر userAllInfo
  useEffect(() => {
    if (userAllInfo) {
      reset({
        firstName: userAllInfo.fName || "",
        lastName: userAllInfo.lName || "",
        nationalCode: userAllInfo.nationalCode || "",
        birthday: formatDate(userAllInfo.birthDay) || "",
      });
    }
  }, [userAllInfo, reset]);

  const onSubmit = (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      stepper.next(data);
    } else {
      for (const key in data) {
        if (data[key].length === 0) {
          setError(key, {
            type: "manual",
            message: `لطفاً ${key} معتبر وارد کنید`,
          });
        }
      }
    }
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">اطلاعات شخصی</h5>
        <small>مشخصات کاربر را وارد کنید.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="firstName">
              نام
            </Label>
            <Controller
              id="firstName"
              name="firstName"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="فلان"
                  invalid={errors.firstName && true}
                  {...field}
                />
              )}
            />
            {errors.firstName && (
              <FormFeedback>{errors.firstName.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="lastName">
              نام خانوادگی
            </Label>
            <Controller
              id="lastName"
              name="lastName"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="فلانی"
                  invalid={errors.lastName && true}
                  {...field}
                />
              )}
            />
            {errors.lastName && (
              <FormFeedback>{errors.lastName.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="nationalCode">
              کد ملی
            </Label>
            <Controller
              id="nationalCode"
              name="nationalCode"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  invalid={errors.nationalCode && true}
                  {...field}
                />
              )}
            />
            {errors.nationalCode && (
              <FormFeedback>{errors.nationalCode.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="birthday">
              تاریخ تولد
            </Label>
            <Controller
              id="birthday"
              name="birthday"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  invalid={errors.birthday && true}
                  {...field}
                />
              )}
            />
            {errors.birthday && (
              <FormFeedback>{errors.birthday.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <div className="d-flex justify-content-between">
          <Button
            type="button"
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
          <Button type="submit" color="primary" className="btn-next">
            <span className="align-middle d-sm-inline-block d-none">بعدی</span>
            <ArrowRight
              size={14}
              className="align-middle ms-sm-25 ms-0"
            ></ArrowRight>
          </Button>
        </div>
      </Form>
    </Fragment>
  );
};

export default PersonalInfo;
