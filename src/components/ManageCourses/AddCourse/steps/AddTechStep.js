import { Fragment, useState } from "react";
import SelectOptions from "../../../../@core/components/select/SelectOptions";
import ButtonsForMove from "../../../../@core/components/button-for-move/ButtonsForMove";
import toast from "react-hot-toast";
import AddCategory from "../../../../@core/Services/Api/Courses/AddCourse/AddCategory";

const AddTechnologiesStep = ({ courseTechnologies, courseId, stepper }) => {
  const [selectedTech, setSelectedTech] = useState([]);
  const { mutate, isPending } = AddCategory(courseId, selectedTech);

  const AddTech = () => {
    if (selectedTech.length === 0) {
      console.warn("No technologies selected");
      toast.error("لطفا حداقل یک تکنولوژی انتخاب کنید");
      return;
    }
    console.log("Selected technologies:", selectedTech);
    mutate(selectedTech, {
      onSuccess: () => {
        console.log("تکنولوژی‌ها با موفقیت اضافه شدند");
        alert("تکنولوژی‌ها با موفقیت اضافه شدند");
        stepper.next();
      },
      onError: (err) => {
        console.error("خطا در ارسال تکنولوژی:", err);
        toast.error("خطا در ثبت تکنولوژی‌ها");
        toast.error("ای دی دوره موجود نیست");
      },
    });
  };

  return (
    <Fragment>
      <div className="w-75 mx-auto mb-3 mt-2" style={{ height: "300px" }}>
        <div className="d-flex flex-column gap-1 shadow p-3 mb-5 rounded">
          <SelectOptions
            tech={courseTechnologies && courseTechnologies}
            setSelectedTech={setSelectedTech}
            useTech={AddTech}
            isPending={isPending}
          />
        </div>
      </div>
      <div>
        <ButtonsForMove stepper={stepper} />
      </div>
    </Fragment>
  );
};

export default AddTechnologiesStep;