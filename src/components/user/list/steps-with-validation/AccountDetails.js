// ** React Imports
import { Fragment } from "react";

// ** Utils
import { isObjEmpty } from "@utils";

// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { ArrowRight } from "react-feather";
import { yupResolver } from "@hookform/resolvers/yup";

// ** Reactstrap Imports
import { Form, Label, Input, Row, Col, Button, FormFeedback } from "reactstrap";

const AccountDetails = ({ stepper, userAllInfo }) => {
  const defaultValues = {
    username: userAllInfo?.userName || "",
    phoneNumber: userAllInfo?.phoneNumber || "",
    email: userAllInfo?.gmail || "",
    recoveryEmail: userAllInfo?.recoveryEmail || "",
  };

  const SignupSchema = yup.object().shape({
    username: yup
      .string()
      .min(2, "نام کاربری باید حداقل 2 کاراکتر باشد")
      .matches(
        /^[a-zA-Z0-9_]+$/,
        "نام کاربری فقط می‌تواند شامل حروف، اعداد و _ باشد"
      )
      .required("نام کاربری اجباری است"),
    phoneNumber: yup
      .string()
      .matches(/^[0-9]+$/, "شماره تماس فقط می‌تواند شامل اعداد باشد")
      .matches(/^09\d{9}$/, "شماره تماس باید با 09 شروع شود و 11 رقم باشد")
      .required("شماره تماس اجباری است"),
    email: yup.string().email("ایمیل نامعتبر است").required("ایمیل اجباری است"),
  });
  // ** Hooks

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(SignupSchema),
  });

  const onSubmit = (data) => {
    if (isObjEmpty(errors)) {
      stepper.next(data);
    }
  };

  return (
    <Fragment>
      <div className="content-header">
        <h5 className="mb-0">جزییات حساب کاربری</h5>
        <small className="text-muted">اطلاعات حساب کاربری را وارد کنید.</small>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="username">
              نام کاربری
            </Label>
            <Controller
              id="username"
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  placeholder="johndoe"
                  invalid={errors.username && true}
                  {...field}
                />
              )}
            />
            {errors.username && (
              <FormFeedback>{errors.username.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for="phoneNumber">
              شماره تماس
            </Label>
            <Controller
              id="phoneNumber"
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  type="tel"
                  placeholder="09999999999"
                  invalid={errors.phoneNumber && true}
                  {...field}
                />
              )}
            />
            {errors.phoneNumber && (
              <FormFeedback>{errors.phoneNumber.message}</FormFeedback>
            )}
          </Col>
        </Row>
        <Row>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`email`}>
              ایمیل
            </Label>
            <Controller
              control={control}
              id="email"
              name="email"
              render={({ field }) => (
                <Input
                  type="email"
                  placeholder="john.doe@email.com"
                  invalid={errors.email && true}
                  {...field}
                />
              )}
            />
            {errors.email && (
              <FormFeedback>{errors.email.message}</FormFeedback>
            )}
          </Col>
          <Col md="6" className="mb-1">
            <Label className="form-label" for={`recoveryEmail`}>
              ایمیل بازیابی
            </Label>
            <Controller
              control={control}
              id="recoveryEmail"
              name="recoveryEmail"
              render={({ field }) => (
                <Input
                  type="recoveryEmail"
                  placeholder="john.doe@email.com"
                  {...field}
                />
              )}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
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

export default AccountDetails;
