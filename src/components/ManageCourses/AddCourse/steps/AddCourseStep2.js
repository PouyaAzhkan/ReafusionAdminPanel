import { Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "@styles/react/libs/react-select/_react-select.scss";
import { Col, Row } from "reactstrap";
import { secondLevelFields } from "../../../../@core/constants/courses";
import ButtonsForMove from "../../../../@core/components/button-for-move/ButtonsForMove";
import * as yup from "yup";

const validCreateCourseLv2 = yup.object().shape({
  CourseTypeId: yup.number().required("لطفا نوع دوره را انتخاب کنید"),
  CourseLvlId: yup.number().required("لطفا سطح دوره را انتخاب کنید"),
  TeacherId: yup.number().required("لطفا مدرس را انتخاب کنید"),
  TremId: yup.number().required("لطفا ترم را انتخاب کنید"),
  ClassId: yup.number().required("لطفا کلاس را انتخاب کنید"),
  SessionNumber: yup.number().min(1, "تعداد جلسات باید حداقل 1 باشد").required("لطفا تعداد جلسات را وارد کنید"),
});

const AddCourseStep2 = ({ stepper, setSecondLv, courseOptions }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      CourseTypeId: 1,
      CourseLvlId: 1,
      TeacherId: 1,
      TremId: 1,
      ClassId: 1,
      SessionNumber: "",
    },
    resolver: yupResolver(validCreateCourseLv2),
  });

  const onSubmit = (values) => {
    console.log("Step 2 values:", values);
    setSecondLv(values);
    stepper.next();
  };

  return (
    <Fragment>
      <div className="mx-auto mb-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column gap-1 shadow pt-2 px-3 my-1 rounded"
        >
          <Row className="mb-1">
            <Col xl="6">
              {secondLevelFields.slice(0, 3).map((field) => (
                <div className="form-group pb-2" key={field.id}>
                  <label htmlFor={field.value}>{field.label}</label>
                  <Controller
                    name={field.value}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <select
                        id={field.value}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className={`form-control text-primary ${
                          errors[field.value] ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" disabled>انتخاب کنید</option>
                        {courseOptions?.[field.array]?.map((item, index) => (
                          <option
                            key={index}
                            value={item.id ?? item.teacherId}
                          >
                            {item?.[field.keySelect]}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors[field.value] && (
                    <div className="text-danger">
                      {errors[field.value]?.message}
                    </div>
                  )}
                </div>
              ))}
            </Col>
            <Col xl="6">
              {secondLevelFields.slice(3, 5).map((field) => (
                <div className="form-group pb-2" key={field.id}>
                  <label htmlFor={field.value}>{field.label}</label>
                  <Controller
                    name={field.value}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <select
                        id={field.value}
                        value={value}
                        onChange={(e) => onChange(Number(e.target.value))}
                        className={`form-control text-primary ${
                          errors[field.value] ? "is-invalid" : ""
                        }`}
                      >
                        <option value="" disabled>انتخاب کنید</option>
                        {courseOptions?.[field.array]?.map((item, index) => (
                          <option key={index} value={item?.id}>
                            {item?.[field.keySelect]}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors[field.value] && (
                    <div className="text-danger">
                      {errors[field.value]?.message}
                    </div>
                  )}
                </div>
              ))}
              <div className="form-group">
                <label htmlFor="SessionNumber">تعداد جلسه</label>
                <Controller
                  name="SessionNumber"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <input
                      id="SessionNumber"
                      type="number"
                      value={value}
                      onChange={(e) => onChange(Number(e.target.value))}
                      placeholder="تعداد جلسه"
                      className={`form-control text-primary ${
                        errors.SessionNumber ? "is-invalid" : ""
                      }`}
                    />
                  )}
                />
                {errors.SessionNumber && (
                  <div className="text-danger">
                    {errors.SessionNumber?.message}
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <button
            type="submit"
            className="btn btn-primary mt-1"
            disabled={isSubmitting}
          >
            ثبت
          </button>
        </form>
      </div>
      <div>
        <ButtonsForMove stepper={stepper} />
      </div>
    </Fragment>
  );
};

export default AddCourseStep2;