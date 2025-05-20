import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Col,
  Input,
  Label,
  FormFeedback,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Spinner,
} from "reactstrap";
import useGetCourseDetailInfo from "../../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import { useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import EditCourses from "../../../../@core/Services/Api/Courses/CourseDetail/EditCourses";
import { getItem, setItem } from "../../../../@core/Services/common/storage.services";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Wizard from "../../../../@core/components/wizard";
import toast from "react-hot-toast";

// Step 1: Basic Course Details
const EditCourseStep1 = ({ stepper, setStep1Data, defaultData }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      Title: defaultData?.title || "",
      Capacity: getItem("Capacity") || "",
      SessionNumber: getItem("SessionNumber") || "",
    },
  });

  const onSubmit = (data) => {
    setStep1Data(data);
    stepper.next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row className="gy-1">
        <Col md="12">
          <Label for="Title">عنوان دوره</Label>
          <Controller
            control={control}
            name="Title"
            rules={{
              required: "این فیلد اجباری است",
              maxLength: { value: 32, message: "متن بیش از حد مجاز!" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="Title"
                invalid={!!errors.Title}
              />
            )}
          />
          {errors.Title && <FormFeedback className="text-danger">{errors.Title.message}</FormFeedback>}
        </Col>
        <Col md="6">
          <Label for="Capacity">ظرفیت دوره</Label>
          <Controller
            control={control}
            name="Capacity"
            rules={{
              required: "این فیلد اجباری است",
              min: { value: 1, message: "ظرفیت باید حداقل 1 باشد" },
              max: { value: 450, message: "ظرفیت نمی‌تواند بیشتر از 450 باشد" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="Capacity"
                type="text"
                onChange={(e) => {
                  field.onChange(e);
                  setItem("Capacity", e.target.value);
                }}
                invalid={!!errors.Capacity}
              />
            )}
          />
          {errors.Capacity && <FormFeedback className="text-danger">{errors.Capacity.message}</FormFeedback>}
        </Col>
        <Col md="6">
          <Label for="SessionNumber">تعداد جلسات</Label>
          <Controller
            control={control}
            name="SessionNumber"
            rules={{
              required: "این فیلد اجباری است",
              min: { value: 1, message: "تعداد جلسات باید حداقل 1 باشد" },
              max: { value: 50, message: "تعداد جلسات نمی‌تواند بیشتر از 50 باشد" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="SessionNumber"
                type="text"
                onChange={(e) => {
                  field.onChange(e);
                  setItem("SessionNumber", e.target.value);
                }}
                invalid={!!errors.SessionNumber}
              />
            )}
          />
          {errors.SessionNumber && <FormFeedback className="text-danger">{errors.SessionNumber.message}</FormFeedback>}
        </Col>
        <Col xs={12} className="text-center mt-5">
          <Button type="submit" color="primary">بعدی</Button>
          <Button type="button" color="danger" outline className="ms-1" onClick={() => stepper.previous()}>
            قبلی
          </Button>
        </Col>
      </Row>
    </form>
  );
};

// Step 2: Course Specifics
const EditCourseStep2 = ({ stepper, setStep2Data, courseOptions, defaultData }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      CourseTypeId: defaultData?.courseTypeId || "",
      ClassId: defaultData?.classId || "",
      CourseLvlId: defaultData?.courseLevelId || "",
      TeacherId: defaultData?.teacherId || "",
    },
  });

  const onSubmit = (data) => {
    setStep2Data(data);
    stepper.next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row className="gy-1">
        <Col md="6">
          <Label for="CourseTypeId">نحوه برگزاری</Label>
          <Controller
            control={control}
            name="CourseTypeId"
            rules={{ required: "این فیلد اجباری است" }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="CourseTypeId"
                type="select"
                invalid={!!errors.CourseTypeId}
              >
                <option value="">انتخاب کنید</option>
                {courseOptions?.courseTypeDtos?.map((item) => (
                  <option key={item.id} value={item.id}>{item.typeName}</option>
                ))}
              </Input>
            )}
          />
          {errors.CourseTypeId && <FormFeedback className="text-danger">{errors.CourseTypeId.message}</FormFeedback>}
        </Col>
        <Col md="6">
          <Label for="ClassId">مکان برگزاری</Label>
          <Controller
            control={control}
            name="ClassId"
            rules={{ required: "این فیلد اجباری است" }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="ClassId"
                type="select"
                invalid={!!errors.ClassId}
              >
                <option value="">انتخاب کنید</option>
                {courseOptions?.classRoomDtos?.map((item) => (
                  <option key={item.id} value={item.id}>{item.classRoomName}</option>
                ))}
              </Input>
            )}
          />
          {errors.ClassId && <FormFeedback className="text-danger">{errors.ClassId.message}</FormFeedback>}
        </Col>
        <Col md="6">
          <Label for="CourseLvlId">سطح دوره</Label>
          <Controller
            control={control}
            name="CourseLvlId"
            rules={{ required: "این فیلد اجباری است" }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="CourseLvlId"
                type="select"
                invalid={!!errors.CourseLvlId}
              >
                <option value="">انتخاب کنید</option>
                {courseOptions?.courseLevelDtos?.map((item) => (
                  <option key={item.id} value={item.id}>{item.levelName}</option>
                ))}
              </Input>
            )}
          />
          {errors.CourseLvlId && <FormFeedback className="text-danger">{errors.CourseLvlId.message}</FormFeedback>}
        </Col>
        <Col md="6">
          <Label for="TeacherId">مدرس دوره</Label>
          <Controller
            control={control}
            name="TeacherId"
            rules={{ required: "این فیلد اجباری است" }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="TeacherId"
                type="select"
                invalid={!!errors.TeacherId}
              >
                <option value="">انتخاب کنید</option>
                {courseOptions?.teachers?.map((item) => (
                  <option key={item.teacherId} value={item.teacherId}>{item.fullName}</option>
                ))}
              </Input>
            )}
          />
          {errors.TeacherId && <FormFeedback className="text-danger">{errors.TeacherId.message}</FormFeedback>}
        </Col>
        <Col xs={12} className="text-center mt-5">
          <Button type="submit" color="primary">بعدی</Button>
          <Button type="button" color="danger" outline className="ms-1" onClick={() => stepper.previous()}>
            قبلی
          </Button>
        </Col>
      </Row>
    </form>
  );
};

// Step 3: Date and Time
const EditCourseStep3 = ({ stepper, setStep3Data, defaultData }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      StartTime: defaultData?.startTime || "",
      EndTime: defaultData?.endTime || new DateObject().add(1, "year").format("YYYY-MM-DD HH:mm:ss"),
    },
  });

  const handleDateChange = (date, type) => {
    if (date) {
      const gregorianDate = new DateObject(date)
        .convert(gregorian, gregorian_en)
        .format("YYYY-MM-DD HH:mm:ss");
      setValue(type, gregorianDate, { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
    setStep3Data(data);
    stepper.next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row className="gy-1">
        <Col sm="6">
          <Label for="StartTime">تاریخ شروع</Label>
          <Controller
            control={control}
            name="StartTime"
            rules={{
              required: "این فیلد اجباری است",
              validate: (value) => {
                if (!value) return "تاریخ شروع معتبر نیست";
                const date = new Date(value);
                return !isNaN(date.getTime()) || "تاریخ شروع معتبر نیست";
              },
            }}
            render={({ field }) => (
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                value={field.value ? new DateObject(field.value).convert(persian, persian_fa) : null}
                onChange={(date) => handleDateChange(date, "StartTime")}
                containerStyle={{ width: "100%" }}
                style={{
                  width: "100%",
                  height: "39px",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                }}
                className="datePicker"
              />
            )}
          />
          {errors.StartTime && (
            <FormFeedback className="text-danger">{errors.StartTime.message}</FormFeedback>
          )}
        </Col>
        <Col sm="6">
          <Label for="EndTime">تاریخ پایان</Label>
          <Controller
            control={control}
            name="EndTime"
            rules={{
              required: "این فیلد اجباری است",
              validate: (value) => {
                if (!value) return "تاریخ پایان معتبر نیست";
                const date = new Date(value);
                return !isNaN(date.getTime()) || "تاریخ پایان معتبر نیست";
              },
            }}
            render={({ field }) => (
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                format="YYYY/MM/DD"
                value={field.value ? new DateObject(field.value).convert(persian, persian_fa) : null}
                onChange={(date) => handleDateChange(date, "EndTime")}
                containerStyle={{ width: "100%" }}
                style={{
                  width: "100%",
                  height: "39px",
                  paddingLeft: "14px",
                  paddingRight: "14px",
                }}
                className="datePicker"
              />
            )}
          />
          {errors.EndTime && (
            <FormFeedback className="text-danger">{errors.EndTime.message}</FormFeedback>
          )}
        </Col>
        <Col xs={12} className="text-center mt-5">
          <Button type="submit" color="primary">بعدی</Button>
          <Button type="button" color="danger" outline className="ms-1" onClick={() => stepper.previous()}>
            قبلی
          </Button>
        </Col>
      </Row>
    </form>
  );
};

// Step 4: Descriptions
const EditCourseStep4 = ({ stepper, setStep4Data, defaultData }) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      MiniDescribe: defaultData?.describe || "",
      Describe: defaultData?.describe || "",
    },
  });

  const onSubmit = (data) => {
    setStep4Data(data);
    stepper.next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row className="gy-1">
        <Col md="12">
          <Label for="MiniDescribe">توضیحات کوتاه</Label>
          <Controller
            control={control}
            name="MiniDescribe"
            rules={{
              required: "این فیلد اجباری است",
              minLength: { value: 3, message: "طول نویسه کمتر از حد مجاز" },
              maxLength: { value: 290, message: "توضیحات کوتاه نمی‌تواند بیش از 290 کاراکتر باشد" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="MiniDescribe"
                type="textarea"
                invalid={!!errors.MiniDescribe}
              />
            )}
          />
          {errors.MiniDescribe && <FormFeedback className="text-danger">{errors.MiniDescribe.message}</FormFeedback>}
        </Col>
        <Col md="12">
          <Label for="Describe">توضیحات دوره</Label>
          <Controller
            control={control}
            name="Describe"
            rules={{
              required: "این فیلد اجباری است",
              minLength: { value: 3, message: "طول نویسه کمتر از حد مجاز" },
              maxLength: { value: 850, message: "توضیحات نمی‌تواند بیش از 850 کاراکتر باشد" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="Describe"
                type="textarea"
                invalid={!!errors.Describe}
              />
            )}
          />
          {errors.Describe && <FormFeedback className="text-danger">{errors.Describe.message}</FormFeedback>}
        </Col>
        <Col xs={12} className="text-center mt-5">
          <Button type="submit" color="primary">بعدی</Button>
          <Button type="button" color="danger" outline className="ms-1" onClick={() => stepper.previous()}>
            قبلی
          </Button>
        </Col>
      </Row>
    </form>
  );
};

// Step 5: Image and Unique URL
const EditCourseStep5 = ({ stepper, setStep5Data, setFile, toggle, handleSubmit, defaultData, isPending }) => {
  const { control, handleSubmit: formSubmit, formState: { errors } } = useForm({
    mode: "onChange",
    defaultValues: {
      UniqeUrlString: defaultData?.uniqeUrlString || "",
    },
  });

  const onSubmit = (data) => {
    setStep5Data(data);
    handleSubmit();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  return (
    <form onSubmit={formSubmit(onSubmit)}>
      <Row className="gy-1">
        <Col md="12">
          <Label for="Image">آپلود عکس</Label>
          <Input
            className="text-primary"
            id="Image"
            type="file"
            onChange={handleFileChange}
          />
        </Col>
        <Col md="12">
          <Label for="UniqeUrlString">شناسه یکتا</Label>
          <Controller
            control={control}
            name="UniqeUrlString"
            rules={{
              required: "این فیلد اجباری است",
              maxLength: { value: 50, message: "شناسه یکتا نمی‌تواند بیش از 50 کاراکتر باشد" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                className="text-primary"
                id="UniqeUrlString"
                invalid={!!errors.UniqeUrlString}
              />
            )}
          />
          {errors.UniqeUrlString && <FormFeedback className="text-danger">{errors.UniqeUrlString.message}</FormFeedback>}
        </Col>
        <Col xs={12} className="text-center mt-5">
          <Button type="submit" color="primary" disabled={isPending}>ویرایش
            {isPending && <Spinner size="sm" color="light" />} 
          </Button>
          <Button type="button" color="danger" outline className="ms-1" onClick={toggle}>
            لغو
          </Button>
        </Col>
      </Row>
    </form>
  );
};

// Main EditCourse Component
const EditCourse = ({ isOpen, toggle, refetchData, CreateCourse }) => {
  const { id } = useParams();
  const ref = useRef(null);
  const [stepper, setStepper] = useState(null);
  const [step1Data, setStep1Data] = useState({});
  const [step2Data, setStep2Data] = useState({});
  const [step3Data, setStep3Data] = useState({});
  const [step4Data, setStep4Data] = useState({});
  const [step5Data, setStep5Data] = useState({});
  const [file, setFile] = useState(null);

  const { data, isLoading, error } = useGetCourseDetailInfo(id);
  const { mutate, isPending } = EditCourses();

  // Set initial form values
  useEffect(() => {
    if (data) {
      const oneYearLater = new DateObject().add(1, "year").format("YYYY-MM-DD HH:mm:ss");
      setStep1Data({
        Title: data.title || "",
        Capacity: getItem("Capacity") || data.capacity || "",
        SessionNumber: getItem("SessionNumber") || data.sessionNumber || "",
      });
      setStep2Data({
        CourseTypeId: data.courseTypeId || "",
        ClassId: data.classId || "",
        CourseLvlId: data.courseLevelId || "",
        TeacherId: data.teacherId || "",
      });
      setStep3Data({
        StartTime: data.startTime || "",
        EndTime: data.endTime || oneYearLater,
      });
      setStep4Data({
        MiniDescribe: data.describe || "",
        Describe: data.describe || "",
      });
      setStep5Data({
        UniqeUrlString: data.uniqeUrlString || "",
      });
    }
  }, [data]);

  if (isLoading) return <p>در حال بارگذاری اطلاعات</p>;
  if (error) return <p>خطا در بارگذاری اطلاعات</p>;

  const handleSubmit = () => {
    const combinedData = {
      Id: id,
      ...step1Data,
      ...step2Data,
      ...step3Data,
      ...step4Data,
      ...step5Data,
      TremId: CreateCourse?.termDtos?.[0]?.id,
      Cost: data?.cost,
    };

    const formData = new FormData();
    Object.entries(combinedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    if (file) {
      formData.append("Image", file);
    }

    mutate(formData, {
      onSuccess: () => {
        toast.success("دوره با موفقیت ویرایش شد");
        toggle();
        refetchData();
      },
      onError: (error) => {
        console.error("Error:", error);
        toast.error("خطا در ویرایش اطلاعات");
      },
    });
  };

  const steps = [
    {
      id: "step1",
      title: "مشخصات اولیه دوره",
      subtitle: "لطفا مشخصات اولیه دوره را وارد کنید",
      content: (
        <EditCourseStep1
          stepper={stepper}
          setStep1Data={setStep1Data}
          defaultData={data}
        />
      ),
    },
    {
      id: "step2",
      title: "جزئیات دوره",
      subtitle: "لطفا جزئیات دوره را وارد کنید",
      content: (
        <EditCourseStep2
          stepper={stepper}
          setStep2Data={setStep2Data}
          courseOptions={CreateCourse}
          defaultData={data}
        />
      ),
    },
    {
      id: "step3",
      title: "تاریخ و زمان",
      subtitle: "لطفا تاریخ شروع و پایان را وارد کنید",
      content: (
        <EditCourseStep3
          stepper={stepper}
          setStep3Data={setStep3Data}
          defaultData={data}
        />
      ),
    },
    {
      id: "step4",
      title: "توضیحات دوره",
      subtitle: "لطفا توضیحات کوتاه و کامل دوره را وارد کنید",
      content: (
        <EditCourseStep4
          stepper={stepper}
          setStep4Data={setStep4Data}
          defaultData={data}
        />
      ),
    },
    {
      id: "step5",
      title: "تصویر و شناسه یکتا",
      subtitle: "لطفا تصویر و شناسه یکتا را وارد کنید",
      content: (
        <EditCourseStep5
          stepper={stepper}
          setStep5Data={setStep5Data}
          setFile={setFile}
          toggle={toggle}
          handleSubmit={handleSubmit}
          defaultData={data}
          isPending={isPending}
        />
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered modal-lg"
    >
      <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <h1 className="text-center mb-2 text-primary">ویرایش اطلاعات دوره</h1>
        <div style={{ height: "auto" }} className="modern-vertical-wizard">
          <Wizard
            type="modern-vertical"
            ref={ref}
            steps={steps}
            options={{ linear: false }}
            instance={(el) => setStepper(el)}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};

export default EditCourse;