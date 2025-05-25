import { Fragment, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  FormFeedback,
  Form,
} from "reactstrap";
import { getAdminSecurityInfo, useChangeAdminPassword, useChangeAdminRecovery } from "../../@core/Services/Api/AdminInfo/AdminInfo";
import { useForm, Controller } from "react-hook-form";
import { toast } from "react-hot-toast";

const SecurityManageTab = () => {
  const { data: adminData, isLoading, isError, refetch } = getAdminSecurityInfo();
  const { mutate: changePassword } = useChangeAdminPassword();
  const { mutate: changeRecovery } = useChangeAdminRecovery();

  // فرم تغییر رمز عبور
  const {
    control: passwordControl,
    setError: setPasswordError,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onChange",
    resolver: async (data) => {
      const errors = {};
      if (!data.oldPassword || data.oldPassword.trim() === "") {
        errors.oldPassword = { message: "لطفاً رمز عبور فعلی را وارد کنید" };
      }
      if (!data.newPassword || data.newPassword.trim() === "") {
        errors.newPassword = { message: "لطفاً رمز عبور جدید را وارد کنید" };
      } else if (data.newPassword.length < 8) {
        errors.newPassword = { message: "رمز عبور جدید باید حداقل ۸ کاراکتر باشد" };
      }
      if (!data.confirmNewPassword || data.confirmNewPassword.trim() === "") {
        errors.confirmNewPassword = { message: "لطفاً تأیید رمز عبور جدید را وارد کنید" };
      } else if (data.newPassword !== data.confirmNewPassword) {
        errors.confirmNewPassword = { message: "تأیید رمز عبور با رمز عبور جدید مطابقت ندارد" };
      }
      return { values: data, errors };
    },
  });

  // فرم تنظیمات بازیابی
  const {
    control: recoveryControl,
    setError: setRecoveryError,
    handleSubmit: handleRecoverySubmit,
    reset: resetRecovery,
    formState: { errors: recoveryErrors },
  } = useForm({
    defaultValues: {
      recoveryEmail: "",
      twoStepAuth: false,
    },
    mode: "onChange",
    resolver: async (data) => {
      const errors = {};
      if (!data.recoveryEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recoveryEmail)) {
        errors.recoveryEmail = { message: "لطفاً یک ایمیل معتبر وارد کنید" };
      }
      return { values: data, errors };
    },
  });

  // به‌روزرسانی فرم تنظیمات بازیابی با داده‌های دریافتی از API
  useEffect(() => {
    if (adminData) {
      resetRecovery({
        recoveryEmail: adminData?.recoveryEmail || "",
        twoStepAuth: adminData?.twoStepAuth || false,
      });
    }
  }, [adminData, resetRecovery]);

  // تابع ارسال برای تغییر رمز عبور
  const onSubmitPassword = async (data) => {
    try {
      await changePassword(
        {
          oldPassword: data.oldPassword.trim(),
          newPassword: data.newPassword.trim(),
        },
        {
          onSuccess: () => {
            toast.success("رمز عبور با موفقیت تغییر کرد!");
            resetPassword({
              oldPassword: "",
              newPassword: "",
              confirmNewPassword: "",
            });
            refetch();
          },
          onError: (error) => {
            console.error("خطای تغییر رمز عبور:", error);
            const errorMessage = error.response?.data?.ErrorMessage || "خطا در تغییر رمز عبور";
            setPasswordError("newPassword", { message: errorMessage });
            toast.error(errorMessage);
          },
        }
      );
    } catch (error) {
      console.error("خطا در ارسال:", error);
      toast.error("خطا در ذخیره تغییرات رمز عبور.");
    }
  };

  // تابع ارسال برای تغییر تنظیمات بازیابی
  const onSubmitRecovery = async (data) => {
    try {
      await changeRecovery(
        {
          twoStepAuth: data.twoStepAuth,
          recoveryEmail: data.recoveryEmail.trim(),
          baseUrl: window.location.origin, // یا مقدار مناسب برای baseUrl
        },
        {
          onSuccess: () => {
            toast.success("تنظیمات بازیابی با موفقیت ذخیره شد!");
            refetch();
          },
          onError: (error) => {
            console.error("خطای تغییر تنظیمات بازیابی:", error);
            const errorMessage = error.response?.data?.ErrorMessage || "خطا در تغییر تنظیمات بازیابی";
            setRecoveryError("recoveryEmail", { message: errorMessage });
            toast.error(errorMessage);
          },
        }
      );
    } catch (error) {
      console.error("خطا در ارسال:", error);
      toast.error("خطا در ذخیره تغییرات تنظیمات بازیابی.");
    }
  };

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle tag="h4">تنظیمات امنیتی</CardTitle>
        </CardHeader>
        <CardBody>
          {/* فرم تغییر رمز عبور */}
          <Form className="mt-2 pt-50" onSubmit={handlePasswordSubmit(onSubmitPassword)}>
            <CardTitle tag="h5" className="mb-2">تغییر رمز عبور</CardTitle>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="oldPassword">
                  رمز عبور فعلی
                </Label>
                <Controller
                  name="oldPassword"
                  control={passwordControl}
                  render={({ field }) => (
                    <Input
                      id="oldPassword"
                      type="password"
                      placeholder="رمز عبور فعلی"
                      invalid={!!passwordErrors.oldPassword}
                      {...field}
                    />
                  )}
                />
                {passwordErrors.oldPassword && (
                  <FormFeedback>{passwordErrors.oldPassword.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="newPassword">
                  رمز عبور جدید
                </Label>
                <Controller
                  name="newPassword"
                  control={passwordControl}
                  render={({ field }) => (
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="رمز عبور جدید"
                      invalid={!!passwordErrors.newPassword}
                      {...field}
                    />
                  )}
                />
                {passwordErrors.newPassword && (
                  <FormFeedback>{passwordErrors.newPassword.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="confirmNewPassword">
                  تأیید رمز عبور جدید
                </Label>
                <Controller
                  name="confirmNewPassword"
                  control={passwordControl}
                  render={({ field }) => (
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="تأیید رمز عبور جدید"
                      invalid={!!passwordErrors.confirmNewPassword}
                      {...field}
                    />
                  )}
                />
                {passwordErrors.confirmNewPassword && (
                  <FormFeedback>{passwordErrors.confirmNewPassword.message}</FormFeedback>
                )}
              </Col>
              <Col className="mt-2" sm="12">
                <Button
                  type="submit"
                  className="me-1"
                  color="primary"
                  disabled={isLoading || Object.keys(passwordErrors).length > 0}
                >
                  ذخیره تغییرات رمز عبور
                </Button>
              </Col>
            </Row>
          </Form>

          {/* فرم تنظیمات بازیابی */}
          <Form className="mt-4 pt-50" onSubmit={handleRecoverySubmit(onSubmitRecovery)}>
            <CardTitle tag="h5" className="mb-2">تنظیمات بازیابی</CardTitle>
            <Row>
              <Col sm="6" className="mb-1">
                <Label className="form-label" for="recoveryEmail">
                  ایمیل بازیابی
                </Label>
                <Controller
                  name="recoveryEmail"
                  control={recoveryControl}
                  render={({ field }) => (
                    <Input
                      id="recoveryEmail"
                      type="email"
                      placeholder="example@gmail.com"
                      invalid={!!recoveryErrors.recoveryEmail}
                      {...field}
                    />
                  )}
                />
                {recoveryErrors.recoveryEmail && (
                  <FormFeedback>{recoveryErrors.recoveryEmail.message}</FormFeedback>
                )}
              </Col>
              <Col sm="6" className="mb-1 pt-2 d-flex align-items-center">
                <Label className="form-label mx-1" for="twoStepAuth">
                  ورود دو مرحله‌ای
                </Label>
                <Controller
                  name="twoStepAuth"
                  control={recoveryControl}
                  render={({ field }) => (
                    <Input
                      id="twoStepAuth"
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      invalid={!!recoveryErrors.twoStepAuth}
                    />
                  )}
                />
                {recoveryErrors.twoStepAuth && (
                  <FormFeedback>{recoveryErrors.twoStepAuth.message}</FormFeedback>
                )}
              </Col>
              <Col className="mt-2" sm="12">
                <Button
                  type="submit"
                  className="me-1"
                  color="primary"
                  disabled={isLoading || Object.keys(recoveryErrors).length > 0}
                >
                  ذخیره تغییرات تنظیمات بازیابی
                </Button>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default SecurityManageTab;