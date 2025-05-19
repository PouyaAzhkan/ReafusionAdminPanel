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
              alert("شما با موفقیت ورود پیدا کردید, خوش آمدید");
            } else {
              console.log(`خطا در ورود`);
            }
          },
          onError: () => {
            alert("خطا در ورود، لطفا دوباره تلاش کنید");
          },
        }
      );
    } else {
      alert("شما گزینه 'مرا به خاطر بسپار' را فعال نکرده‌اید...");
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
          <svg viewBox="0 0 139 95" version="1.1" height="28">
            <defs>
              <linearGradient
                x1="100%"
                y1="10.5120544%"
                x2="50%"
                y2="89.4879456%"
                id="linearGradient-1"
              >
                <stop stopColor="#000000" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="64.0437835%"
                y1="46.3276743%"
                x2="37.373316%"
                y2="100%"
                id="linearGradient-2"
              >
                <stop stopColor="#EEEEEE" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g id="Artboard" transform="translate(-400.000000, -178.000000)">
                <g id="Group" transform="translate(400.000000, 178.000000)">
                  <path
                    d="M-5.68434189e-14,2.84217094e-14 L39.1816085,2.84217094e-14 L69.3453773,32.2519224 L101.428699,2.84217094e-14 L138.784583,2.84217094e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L6.71554594,44.4188507 C2.46876683,39.9813776 0.345377275,35.1089553 0.345377275,29.8015838 C0.345377275,24.4942122 0.230251516,14.560351 -5.68434189e-14,2.84217094e-14 Z"
                    id="Path"
                    className="text-primary"
                    style={{ fill: "currentColor" }}
                  ></path>
                  <path
                    d="M69.3453773,32.2519224 L101.428699,1.42108547e-14 L138.784583,1.42108547e-14 L138.784199,29.8015838 C137.958931,37.3510206 135.784352,42.5567762 132.260463,45.4188507 C128.736573,48.2809251 112.33867,64.5239941 83.0667527,94.1480575 L56.2750821,94.1480575 L32.8435758,70.5039241 L69.3453773,32.2519224 Z"
                    id="Path"
                    fill="url(#linearGradient-1)"
                    opacity="0.2"
                  ></path>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.049999997"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 54.0490008 16.1851325"
                  ></polygon>
                  <polygon
                    id="Path-2"
                    fill="#000000"
                    opacity="0.099999994"
                    points="69.3922914 32.4202615 32.8435758 70.5039241 58.3683556 20.7402338"
                  ></polygon>
                  <polygon
                    id="Path-3"
                    fill="url(#linearGradient-2)"
                    opacity="0.099999994"
                    points="101.428699 0 83.0667527 94.1480575 130.378721 47.0740288"
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>
          <h2 className="brand-text text-primary ms-1">DrunkCoders</h2>
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
