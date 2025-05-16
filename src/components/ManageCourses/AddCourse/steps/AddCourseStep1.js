import { Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FirstLevelFields } from "../../../../@core/constants/courses";
import ButtonsForMove from "../../../../@core/components/button-for-move/ButtonsForMove";
import * as yup from "yup";

const validCreateCourseLv1 = yup.object().shape({
  Title: yup.string().required("لطفا عنوان دوره را وارد کنید"),
  GoogleTitle: yup.string().required("لطفا عنوان گوگل را وارد کنید"),
  Cost: yup.number().min(1000, "قیمت باید بیشتر از 1000 باشد").required("لطفا قیمت را وارد کنید"),
  Capacity: yup.number().min(2, "ظرفیت باید بیشتر از 1 باشد").required("لطفا ظرفیت را وارد کنید"),
});

const AddCourseStep1 = ({ stepper, setFirstLv }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      Title: "",
      GoogleTitle: "",
      Cost: "",
      Capacity: "",
    },
    resolver: yupResolver(validCreateCourseLv1),
  });

  const onSubmit = (values) => {
    console.log("Step 1 values:", values);
    setFirstLv(values);
    stepper.next();
  };

  return (
    <Fragment>
      <div className="w-75 mx-auto mb-3 mt-1">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="d-flex flex-column gap-1 shadow px-3 py-2 mb-5 w-full rounded"
        >
          {FirstLevelFields.map((fields) => (
            <div className="form-group" key={fields.id}>
              <label htmlFor={fields.value}>{fields.label}</label>
              <Controller
                name={fields.value}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <input
                    id={fields.value}
                    name={fields.value}
                    type={fields.value === "Cost" || fields.value === "Capacity" ? "number" : "text"}
                    placeholder={fields.label}
                    value={value}
                    onChange={onChange}
                    className={`form-control text-primary ${
                      errors[fields.value] ? "is-invalid" : ""
                    }`}
                  />
                )}
              />
              {errors[fields.value] && (
                <div className="text-danger">{errors[fields.value].message}</div>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="btn btn-primary mt-1"
            disabled={isSubmitting}
          >
            ثبت
          </button>
        </form>
      </div>
      <div sm={12}>
        <ButtonsForMove stepper={stepper} />
      </div>
    </Fragment>
  );
};

export default AddCourseStep1;