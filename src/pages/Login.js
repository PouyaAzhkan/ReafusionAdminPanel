// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link, useNavigate } from "react-router-dom";
// ** Icons Imports
import { Facebook, Twitter, Mail, GitHub } from "react-feather";
// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle";
// ** Third Party Components
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReafusionLogo from '../assets/images/logo/MainReafusionLogo.jpg'
// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
// ** Illustrations Imports
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
// ** Styles
import "@styles/react/pages/page-authentication.scss";
import { PanelLogin } from "../@core/Services/Api/Authentication/Login";
import { setItem } from "../../src/@core/Services/common/storage.services";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { skin } = useSkin();
  // the validation
  const LoginSchema = yup.object().shape({
    phoneOrGmail: yup
      .string()
      .email("ایمیل قابل قبول نمی باشد")
      .required("نمیتواند خالی باشد"),
    password: yup
      .string()
      .min(6, "رمز عبور باید حداقل ۶ حرف باشد")
      .required("نمیتواند خالی باشد"),
  });
  // the validation end
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(LoginSchema) });
  // the api call for post information to the login api
  const { mutate } = PanelLogin();
  // the api call for post information to the login api end
  // the function for post the information
  const handleLogin = (values) => {
    const { phoneOrGmail, password, rememberMe } = values;

    if (rememberMe === true) {
      mutate(
        { phoneOrGmail, password, rememberMe },
        {
          onSuccess: (data) => {
            if (data.token) {
              setItem("token", data.token);
              setItem("userid", data.id);
              setItem("phoneNumber", data.phoneNumber);
              navigate("/home");
              console.log("شما با موفقیت ورود پیدا کردی :", data);
              toast.success("شما با موفقیت ورود پیدا کردید, خوش آمدید");
            } else {
              console.log(`خطا در ورود`);
            }
          },
          onError: () => {
            toast.error("خطا در ورود، لطفا دوباره تلاش کنید");
          },
        }
      );
    } else {
      toast.error("شما گزینه 'مرا به خاطر بسپار' را فعال نکرده‌اید...");
    }
  };
  // the function for post the information end
  const onSubmit = (data) => {
    handleLogin(data);
  };

  const source = skin === "dark" ? illustrationsDark : illustrationsLight;

  return (
    <div className="auth-wrapper auth-cover" /* dir="rtl" */>
      <Row className="auth-inner m-0">
        <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
          <img src={ReafusionLogo} style={{ width: '50px', height: '50px' }} className="rounded-circle"/>
          <h2 className="brand-text text-primary ms-1 mt-1">Reafusion</h2>
        </Link>
        <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
          <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
            <img className="img-fluid" src={source} alt="Login Cover" />
          </div>
        </Col>
        <Col
          className="d-flex align-items-center auth-bg px-2 p-lg-5"
          lg="4"
          sm="12"
          // dir="rtl"
        >
          <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
            <CardTitle tag="h2" className="fw-bold mb-1 text-center">
              به پنل ادمین سایت <br />
              <span className="text-danger">Reafusion</span>
              <br />
              خوش آمدید 👋
            </CardTitle>
            <CardText className="mb-2 text-center text-primary">
              لطفا وارد پنل شوید تا به قدرت ریفیوژن پی ببرید
            </CardText>
            <Form
              className="auth-login-form mt-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="mb-1">
                <Label
                  className="form-label text-end  w-100"
                  for="phoneOrGmail"
                >
                  ایمیل
                </Label>
                <Controller
                  id="phoneOrGmail"
                  name="phoneOrGmail"
                  defaultValue=""
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="phoneOrGmail"
                      className="text-right"
                      placeholder="ایمیل را وارد کنید"
                      invalid={errors.phoneOrGmail && true}
                    />
                  )}
                />
                {errors.phoneOrGmail && (
                  <FormFeedback>{errors.phoneOrGmail.message}</FormFeedback>
                )}
              </div>
              <div className="mb-1 " /* dir="rtl" */>
                <Label className="form-label text-end  w-100" for="password">
                  رمز عبور
                </Label>
                <Controller
                  id="password"
                  name="password"
                  className="text-primary"
                  control={control}
                  render={({ field }) => (
                    <InputPasswordToggle
                      {...field}
                      className="input-group-merge text-primary"
                      placeholder="رمز عبور خود را وارد کنید"
                      invalid={errors.password && true}
                    />
                  )}
                />

                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </div>

              <div className="mb-1" dir="rtl">
                <Controller
                  id="rememberMe"
                  name="rememberMe"
                  defaultValue={false}
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="checkbox"
                      invalid={errors.rememberMe && true}
                    />
                  )}
                />
                {errors.rememberMe && (
                  <FormFeedback>{errors.rememberMe.message}</FormFeedback>
                )}

                <Label
                  className="form-check-label me-1"
                  style={{ fontSize: 12 }}
                  for="rememberMe"
                >
                  مرا به خاطر بسپار
                </Label>
              </div>
              <Button type="submit" color="primary" block>
                <span className="me-1 font-">ورود</span>
              </Button>
            </Form>
            <div className="divider my-2">
              <div className="divider-text">یا</div>
            </div>
            <div className="auth-footer-btn d-flex justify-content-center">
              <Button color="facebook">
                <Facebook size={14} />
              </Button>
              <Button color="twitter">
                <Twitter size={14} />
              </Button>
              <Button color="google" className="">
                <Mail size={14} />
              </Button>
              <Button className="" color="github">
                <GitHub size={14} />
              </Button>
            </div>
          </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
