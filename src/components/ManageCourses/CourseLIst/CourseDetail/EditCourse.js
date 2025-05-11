import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  FormFeedback
} from "reactstrap";
import { EditCourseField } from "../../../../@core/constants/courses";
import ChangeMoment from "../../../../utility/moment";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import useGetCourseDetailInfo from "../../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import { useParams } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import EditCourses from "../../../../@core/Services/Api/Courses/CourseDetail/EditCourses";
import { getItem, setItem } from "../../../../@core/Services/common/storage.services";

const EditCourse = ({ isOpen, toggle, refetchData, CreateCourse }) => {
  const { id } = useParams();
  const [file, setFile] = useState(null);

  const { data, isLoading, error } = useGetCourseDetailInfo(id);
  const { mutate } = EditCourses();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  // تنظیم مقادیر اولیه فرم با داده‌های دریافتی
  useEffect(() => {
    if (data) {
      const oneYearLater = new DateObject().add(1, "year");
      setValue("Title", data.title || "");
      setValue("Capacity", getItem("Capacity") || "");
      setValue("SessionNumber", getItem("SessionNumber") || "");
      setValue("CourseTypeId", data.courseTypeId || "");
      setValue("ClassId", data.classId || "");
      setValue("CourseLvlId", data.courseLevelId || "");
      setValue("TeacherId", data.teacherId || "");
      setValue("StartTime", data.startTime || "");
      setValue("EndTime", oneYearLater.format("YYYY/MM/DD"));
      setValue("MiniDescribe", data.describe || "");
      setValue("UniqeUrlString", data.uniqeUrlString || "");
      setValue("Describe", data.describe || "");
    }
  }, [data, setValue]);

  if (isLoading) return <p>در حال بارگزاری اطلاعات</p>;
  if (error) return <p>خطا در بارگزاری اطلاعات</p>;

  console.log(CreateCourse?.termDtos?.[0]?.id);
  console.log(data?.cost);

  const onSubmit = (value) => {
    console.log("Form Values:", value); // دیباگ مقادیر فرم
    const formData = new FormData();
    formData.append("Id", id);
    formData.append("Title", value.Title);
    formData.append("Capacity", value.Capacity);
    formData.append("SessionNumber", value.SessionNumber);
    formData.append("CourseTypeId", value.CourseTypeId);
    formData.append("ClassId", value.ClassId);
    formData.append("CourseLvlId", value.CourseLvlId);
    formData.append("TeacherId", value.TeacherId);
    formData.append("StartTime", value.StartTime);
    formData.append('EndTime', value.EndTime)
    formData.append("MiniDescribe", value.MiniDescribe);
    formData.append("UniqeUrlString", value.UniqeUrlString);
    formData.append("TremId", CreateCourse?.termDtos?.[0]?.id); 
    formData.append("Cost", data?.cost); 
    if (file) {
      formData.append("Image", file);
    }
    formData.append("Describe", value.Describe);

    mutate(formData, {
      onSuccess: () => {
        alert("دوره با موفقیت ویرایش شد");
        toggle();
        refetchData(); // به‌روزرسانی داده‌ها
      },
      onError: (error) => {
        console.error("Error:", error);
        alert("خطا در ویرایش اطلاعات");
      },
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const handleDateChange = (date, type) => {
    const gregorianDate = new DateObject(date)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DD HH:mm:ss");
    setValue(type, gregorianDate);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered modal-lg"
    >
      <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <h1 className="text-center mb-2">ویرایش اطلاعات دوره</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="gy-1 pt-75">
            <Col md="6">
              <Label for="Title">عنوان دوره</Label>
              <Controller
                control={control}
                name="Title"
                rules={{
                  required: "این فیلد اجباری است",
                  maxLength: {
                    value: 32,
                    message: "متن بیش از حد مجاز!",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="Title"
                    defaultValue={data?.title}
                    invalid={!!errors.Title}
                  />
                )}
              />
              {errors.Title && (
                <FormFeedback className="text-danger">{errors.Title.message}</FormFeedback>
              )}
            </Col>

            <Col md="3">
  <Label for="Capacity">ظرفیت دوره</Label>
  <Controller
    control={control}
    name="Capacity"
    rules={{
      required: "این فیلد اجباری است",
      min: {
        value: 1,
        message: "ظرفیت باید حداقل 1 باشد",
      },
      max: {
        value: 450,
        message: "ظرفیت نمی‌تواند بیشتر از 450 باشد",
      },
    }}
    render={({ field }) => (
      <Input
        {...field}
        className="text-primary"
        id="Capacity"
        onChange={(e) => {
          field.onChange(e);
          setItem("Capacity", e.target.value); // ذخیره مقدار در localStorage
        }}
        type="text"
        value={getItem("Capacity") || ""} // مقدار را از localStorage بگیر
        invalid={!!errors.Capacity}
      />
    )}
  />
  {errors.Capacity && (
    <FormFeedback className="text-danger">{errors.Capacity.message}</FormFeedback>
  )}
            </Col>

            <Col md="3">
              <Label for="SessionNumber">تعداد جلسات</Label>
              <Controller
                control={control}
                name="SessionNumber"
                rules={{
                  required: "این فیلد اجباری است",
                  min: {
                    value: 1,
                    message: "تعداد جلسات باید حداقل 1 باشد",
                  },
                  max: {
                    value: 50,
                    message: "تعداد جلسات نمی‌تواند بیشتر از 50 باشد",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="SessionNumber"
                    type="text"
                    onChange={(e) => {
                      field.onChange(e);
                      setItem("SessionNumber", e.target.value); // ذخیره مقدار در localStorage
                    }}
                    value={getItem("SessionNumber") || ""} // مقدار را از localStorage بگیر
                    invalid={!!errors.SessionNumber}
                  />
                )}
              />
              {errors.SessionNumber && (
                <FormFeedback className="text-danger">{errors.SessionNumber.message}</FormFeedback>
              )}
            </Col>

            <Col md="4">
              <Label for="CourseTypeId">نحوه برگزاری</Label>
              <Controller
                control={control}
                name="CourseTypeId"
                rules={{
                  required: "این فیلد اجباری است",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="CourseTypeId"
                    type="select"
                    defaultValue={data?.courseTypeId}
                    invalid={!!errors.CourseTypeId}
                  >
                    <option value="">انتخاب کنید</option>
                    {CreateCourse?.courseTypeDtos?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.typeName}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.CourseTypeId && (
                <FormFeedback className="text-danger">{errors.CourseTypeId.message}</FormFeedback>
              )}
            </Col>

            <Col md="4">
              <Label for="ClassId">مکان برگزاری</Label>
              <Controller
                control={control}
                name="ClassId"
                rules={{
                  required: "این فیلد اجباری است",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="ClassId"
                    type="select"
                    defaultValue={data?.classId}
                    invalid={!!errors.ClassId}
                  >
                    <option value="">انتخاب کنید</option>
                    {CreateCourse?.classRoomDtos?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.classRoomName}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.ClassId && (
                <FormFeedback className="text-danger">{errors.ClassId.message}</FormFeedback>
              )}
            </Col>

            <Col md="4">
              <Label for="CourseLvlId">سطح دوره</Label>
              <Controller
                control={control}
                name="CourseLvlId"
                rules={{
                  required: "این فیلد اجباری است",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="CourseLvlId"
                    type="select"
                    defaultValue={data?.courseLevelId}
                    invalid={!!errors.CourseLvlId}
                  >
                    <option value="">انتخاب کنید</option>
                    {CreateCourse?.courseLevelDtos?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.levelName}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.CourseLvlId && (
                <FormFeedback className="text-danger">{errors.CourseLvlId.message}</FormFeedback>
              )}
            </Col>

            <Col md="4">
              <Label for="TeacherId">مدرس دوره</Label>
              <Controller
                control={control}
                name="TeacherId"
                rules={{
                  required: "این فیلد اجباری است",
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="TeacherId"
                    type="select"
                    defaultValue={data?.teacherId}
                    invalid={!!errors.TeacherId}
                  >
                    <option value={data?.teacherName}>انتخاب کنید</option>
                    {CreateCourse?.teachers?.map((item) => (
                      <option key={item.teacherId} value={item.teacherId}>
                        {item.fullName}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.TeacherId && (
                <FormFeedback className="text-danger">{errors.TeacherId.message}</FormFeedback>
              )}
            </Col>

            <Col sm="4">
              <Label for="StartTime">تاریخ شروع</Label>
              <Controller
                control={control}
                name="StartTime"
                rules={{
                  required: "این فیلد اجباری است",
                }}
                render={({ field }) => (
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    value={ChangeMoment(field.value, "YYYY/MM/DD", "persian")}
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

            <Col sm="4">
              <Label for="EndTime">تاریخ پایان</Label>
              <Controller
                control={control}
                name="EndTime"
                rules={{
                  required: "این فیلد اجباری است",
                }}
                render={({ field }) => (
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    value={ChangeMoment(field.value, "YYYY/MM/DD", "persian")}
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

            <Col md="8">
              <Label for="MiniDescribe">توضیحات کوتاه</Label>
              <Controller
                control={control}
                name="MiniDescribe"
                rules={{
                  required: "این فیلد اجباری است",
                  minLength: {
                    value: 3,
                    message: 'طول  نویسه کم تر از حد مجاز'
                  },
                  maxLength: {
                    value: 290,
                    message: "توضیحات کوتاه نمی‌تواند بیش از 290 کاراکتر باشد",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="MiniDescribe"
                    type="textarea"
                    defaultValue={data?.describe}
                    invalid={!!errors.MiniDescribe}
                  />
                )}
              />
              {errors.MiniDescribe && (
                <FormFeedback className="text-danger">{errors.MiniDescribe.message}</FormFeedback>
              )}
            </Col>

            <Col md="4">
              <Label for="Image">آپلود عکس</Label>
              <Input
                className="text-primary"
                id="Image"
                type="file"
                onChange={handleFileChange}
              />
              <Label for="UniqeUrlString" className="mt-1">
                شناسه یکتا
              </Label>
              <Controller
                control={control}
                name="UniqeUrlString"
                rules={{
                  required: "این فیلد اجباری است",
                  maxLength: {
                    value: 50,
                    message: "شناسه یکتا نمی‌تواند بیش از 50 کاراکتر باشد",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="UniqeUrlString"
                    defaultValue={data?.uniqeUrlString}
                    invalid={!!errors.UniqeUrlString}
                  />
                )}
              />
              {errors.UniqeUrlString && (
                <FormFeedback className="text-danger">{errors.UniqeUrlString.message}</FormFeedback>
              )}
            </Col>

            <Col md="12">
              <Label for="Describe">توضیحات دوره</Label>
              <Controller
                control={control}
                name="Describe"
                rules={{
                  required: "این فیلد اجباری است",
                  minLength: {
                    value: 3,
                    message: 'طول  نویسه کم تر از حد مجاز'
                  },
                  maxLength: {
                    value: 850,
                    message: "توضیحات نمی‌تواند بیش از 850 کاراکتر باشد",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="text-primary"
                    id="Describe"
                    type="textarea"
                    defaultValue={data?.describe}
                    invalid={!!errors.Describe}
                  />
                )}
              />
              {errors.Describe && (
                <FormFeedback className="text-danger">{errors.Describe.message}</FormFeedback>
              )}
            </Col>

            <Col xs={12} className="text-center mt-2">
              <Button type="submit" color="primary">
                ویرایش
              </Button>
              <Button
                type="button"
                color="danger"
                outline
                className="ms-1"
                onClick={toggle}
              >
                لغو
              </Button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default EditCourse;