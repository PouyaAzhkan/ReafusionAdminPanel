import { Fragment, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/react-select/_react-select.scss";
import DateObject from "react-date-object";
import gregorian_en from "react-date-object/locales/gregorian_en";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Input, Label } from "reactstrap";
import DatePicker from "react-multi-date-picker";
import ButtonsForMove from "../../../../@core/components/button-for-move/ButtonsForMove";
import * as yup from "yup";

const validCreateCourseLv3 = yup.object().shape({
  StartTime: yup.string().required("لطفا تاریخ شروع را وارد کنید"),
  EndTime: yup.string().required("لطفا تاریخ پایان را وارد کنید").test(
    "is-after-start",
    "تاریخ پایان باید بعد از تاریخ شروع باشد",
    (value, context) => new Date(value) > new Date(context.parent.StartTime)
  ),
  MiniDescribe: yup.string().required("لطفا توضیحات کوتاه را وارد کنید"),
  UniqeUrlString: yup.string().required("لطفا شناسه یکتا را وارد کنید"),
});

const AddCourseStep3 = ({ stepper, setThirdLv, addCourse }) => {
  const [startValue, setStartValue] = useState(new Date());
  const [endValue, setEndValue] = useState(new Date());

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      StartTime: "",
      EndTime: "",
      MiniDescribe: "",
      UniqeUrlString: "",
    },
    resolver: yupResolver(validCreateCourseLv3),
  });

  const handleDatePicker = (date, type) => {
    const gregorianDate = new DateObject(date)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD"); // فرمت مورد انتظار API
    if (type === "start") {
      setValue("StartTime", gregorianDate);
      setStartValue(date);
    } else if (type === "end") {
      setValue("EndTime", gregorianDate);
      setEndValue(date);
    }
  };

  const onSubmit = (values) => {
    console.log("Step 3 values:", values);
    setThirdLv(values);
    stepper.next();
  };

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="d-flex flex-column gap-1 shadow p-2 w-75 mx-auto mt-2 mb-5 rounded"
      >
        <div className="form-group">
          <Label className="form-label" for="StartTime">
            تاریخ شروع دوره
          </Label>
          <Controller
            name="StartTime"
            control={control}
            render={({ field: { value } }) => (
              <DatePicker
                id="StartTime"
                calendar={persian}
                locale={persian_fa}
                containerStyle={{
                  width: "100%",
                }}
                value={startValue}
                format="YYYY/MM/DD"
                onChange={(date) => handleDatePicker(date, "start")}
                style={{
                  width: "100%",
                  height: "39px",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                }}
                className="datePicker"
                invalid={!!errors.StartTime}
              />
            )}
          />
          {errors.StartTime && (
            <div className="text-danger">{errors.StartTime.message}</div>
          )}
        </div>
        <div className="form-group">
          <Label className="form-label" for="EndTime">
            تاریخ پایان دوره
          </Label>
          <Controller
            name="EndTime"
            control={control}
            render={({ field: { value } }) => (
              <DatePicker
                id="EndTime"
                calendar={persian}
                locale={persian_fa}
                containerStyle={{
                  width: "100%",
                }}
                value={endValue}
                format="YYYY/MM/DD"
                onChange={(date) => handleDatePicker(date, "end")}
                style={{
                  width: "100%",
                  height: "39px",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                }}
                className="datePicker"
                invalid={!!errors.EndTime}
              />
            )}
          />
          {errors.EndTime && (
            <div className="text-danger">{errors.EndTime.message}</div>
          )}
        </div>
        <div className="form-group">
          <Label className="form-label" for="UniqeUrlString">
            شناسه دوره
          </Label>
          <Controller
            name="UniqeUrlString"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                id="UniqeUrlString"
                name="UniqeUrlString"
                placeholder="شناسه دوره"
                className="text-primary"
                onChange={onChange}
                value={value}
                invalid={!!errors.UniqeUrlString}
              />
            )}
          />
          {errors.UniqeUrlString && (
            <div className="text-danger">{errors.UniqeUrlString.message}</div>
          )}
        </div>
        <div className="form-group">
          <Label className="form-label" for="MiniDescribe">
            توضیحات کوتاه
          </Label>
          <Controller
            name="MiniDescribe"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input
                type="textarea"
                id="MiniDescribe"
                name="MiniDescribe"
                className="text-primary"
                placeholder="توضیحات کوتاه"
                onChange={onChange}
                value={value}
                style={{ maxHeight: "100px", minHeight: "50px" }}
                invalid={!!errors.MiniDescribe}
              />
            )}
          />
          {errors.MiniDescribe && (
            <div className="text-danger">{errors.MiniDescribe.message}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary mt-1" disabled={isSubmitting}>
          ثبت
        </button>
      </form>
      <div>
        <ButtonsForMove stepper={stepper} />
      </div>
    </Fragment>
  );
};

export default AddCourseStep3;