import { useEffect, useRef, useState } from "react";
import Wizard from "../../../@core/components/wizard";
import AddCourseStep1 from "./steps/AddCourseStep1";
import AddCourseStep2 from "./steps/AddCourseStep2";
import AddCourseStep3 from "./steps/AddCourseStep3";
import EditorDescribe from "./steps/EditorDescribe";
import AddTechnologiesStep from "./steps/AddTechStep";
import PictureCourse from "./steps/PictureCourse";
import GetCreateCourse from "../../../@core/Services/Api/Courses/CourseDetail/GetCreateCourse";
import GetCategorys from "../../../@core/Services/Api/Courses/AddCourse/GetCategorys";
import AddCourses from "../../../@core/Services/Api/Courses/AddCourse/AddCourse";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AddCourse = () => {
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const [firstLevel, setFirstLevel] = useState({});
  const [secondLevel, setSecondLevel] = useState({});
  const [thirdLevel, setThirdLevel] = useState({});
  const [descEditor, setDescEditor] = useState(null);
  const [createBtn, setCreateBtn] = useState(false);
  const [Image, setImage] = useState(null);
  const [courseId, setCourseId] = useState("");

  const { data: courseOptions, isLoading: courseOptionsLoading, error: courseOptionsError } = GetCreateCourse();
  const { data: courseTechnologies, isLoading: courseTechnologiesLoading, error: courseTechnologiesError } = GetCategorys();
  const { mutate, isPending } = AddCourses();

  const handleAddCourse = () => {
    if (firstLevel && secondLevel && thirdLevel && descEditor && Image) {
      const combinedData = {
        ...firstLevel,
        ...secondLevel,
        ...thirdLevel,
        ...descEditor,
      };

      const formData = new FormData();

      // افزودن فیلدهای متنی
      Object.entries(combinedData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // افزودن تصویر
      if (Image && Image.file) {
        formData.append("tumbImageAddress", Image.file);
      }

      console.log("FormData content:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
      }

      // ارسال به API
      mutate(formData, {
        onSuccess: (data) => {
          console.log("API response:", data);
          setCourseId(data.id);
          toast.success("دوره با موفقیت اضافه شد");
        },
        onError: (error) => {
          console.error("Error adding course:", error.response?.data || error.message);
          toast.error(`خطا در افزودن دوره: ${error.response?.data?.message || error.message}`);
        },
      });
    } else {
      console.warn("اطلاعات ناقص:", {
        firstLevel,
        secondLevel,
        thirdLevel,
        descEditor,
        Image,
      });
      alert("لطفاً همه مراحل را کامل کنید.");
    }
  };

  useEffect(() => {
    if (createBtn && firstLevel && secondLevel && thirdLevel && descEditor && Image) {
      handleAddCourse();
    }
  }, [createBtn, firstLevel, secondLevel, thirdLevel, descEditor, Image]);

  // نمایش اسکلتون در حالت لودینگ
  if (courseOptionsLoading || courseTechnologiesLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div style={{ height: "auto" }} className="modern-vertical-wizard">
          <div className="d-flex">
            {/* اسکلتون برای نوار کناری مراحل */}
            <div className="wizard-sidebar" style={{ width: "300px" }}>
              {[...Array(6)].map((_, index) => (
                <Skeleton
                  key={index}
                  height={60}
                  width="100%"
                  borderRadius={8}
                  className="shadow-sm"
                  style={{ marginBottom: "8px" }}
                />
              ))}
            </div>
            {/* اسکلتون برای محتوای اصلی */}
            <div className="wizard-content" style={{ flex: 1, padding: "20px" }}>
              <Skeleton
                height={50}
                width="100%"
                borderRadius={8}
                className="shadow-sm"
                style={{ marginBottom: "16px" }}
              />
              <Skeleton
                height={400}
                width="100%"
                borderRadius={8}
                className="shadow-sm"
                style={{ marginBottom: "16px" }}
              />
              <Skeleton
                height={50}
                width={200}
                borderRadius={8}
                className="shadow-sm"
              />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (courseOptionsError || courseTechnologiesError) {
    return <p>خطا در بارگذاری اطلاعات: {courseOptionsError?.message || courseTechnologiesError?.message}</p>;
  }

  const steps = [
    {
      id: "account-details",
      title: "مشخصات دوره مرحله اول",
      subtitle: "لطفا فیلد های این مرحله را پر کنید",
      content: (
        <AddCourseStep1
          stepper={stepper}
          type="wizard-vertical"
          setFirstLv={setFirstLevel}
        />
      ),
    },
    {
      id: "personal-info",
      title: "مشخصات دوره مرحله دوم",
      subtitle: "لطفا فیلد های این مرحله را پر کنید",
      content: (
        <AddCourseStep2
          stepper={stepper}
          type="wizard-vertical"
          courseOptions={courseOptions}
          setSecondLv={setSecondLevel}
        />
      ),
    },
    {
      id: "personal-info2",
      title: "مشخصات دوره مرحله سوم",
      subtitle: "لطفا فیلد های این مرحله را پر کنید",
      content: (
        <AddCourseStep3
          courseTechnologies={courseTechnologies}
          stepper={stepper}
          addCourse={handleAddCourse}
          type="wizard-vertical"
          setThirdLv={setThirdLevel}
        />
      ),
    },
    {
      id: "personal-info3",
      title: "توضیحات دوره",
      subtitle: "لطفا توضیحات دوره را وارد کنید",
      content: (
        <EditorDescribe
          stepper={stepper}
          type="wizard-vertical"
          setDesc={setDescEditor}
        />
      ),
    },
    {
      id: "step-image",
      title: "افزودن تصویر",
      subtitle: "لطفا برای دوره عکس انتخاب کنید",
      content: (
        <PictureCourse
          courseId={courseId}
          stepper={stepper}
          setImage={setImage}
          setCreateBtn={setCreateBtn}
          type="wizard-vertical"
          isPending={isPending}
        />
      ),
    },
    {
      id: "step-address",
      title: "افزودن تکنولوژی",
      subtitle: "لطفا تکنولوژی های مربوط به دوره را انتخاب کنید",
      content: (
        <AddTechnologiesStep
          courseTechnologies={courseTechnologies}
          courseId={courseId}
          type="wizard-vertical"
          stepper={stepper}
        />
      ),
    },
  ];

  return (
    <div style={{ height: "auto" }} className="modern-vertical-wizard">
      <Wizard
        type="modern-vertical"
        ref={ref}
        steps={steps}
        options={{
          linear: false,
        }}
        instance={(el) => setStepper(el)}
      />
    </div>
  );
};

export default AddCourse;