import * as yup from 'yup';
// edit weblog validation
export const EditWeblogValidation = yup.object().shape({
  title: yup
    .string()
    .required('عنوان الزامی است')
    .min(10, 'تعداد کاراکتر های عنوان باید بین 10 الی 120 باشد'),
  googleTitle: yup
    .string()
    .required('عنوان گوگل الزامی است')
    .min(5, 'تعداد کاراکتر های عنوان گوگل باید بین 5 تا 70 باشد'),
  keyWord: yup.string().required('کلمات کلیدی الزامی هستند').min(10, 'تعداد کاراکتر های کلمات کلیدی باید بین 10 الی 130 باشد'),
  newsCatregoryName: yup.string().required('دسته‌بندی را وارد کنید'),
  litleDiscribe: yup
    .string()
    .required('توضیحات کوتاه الزامی است')
    .max(160, 'توضیحات کوتاه نباید بیشتر از 160 کاراکتر باشد'),
  Discribe: yup.string().required('توضیحات کلی الزامی است'),
  googleDescribe: yup.string().required('توضیحات گوگل الزامی است'),
});
// edit course validation
export const EditCourseValidation = yup.object({
    Title: yup.string().max(32,"متن بیش از حد مجاز!").required("فیلد الزامی!"),
    Capacity: yup.number("لطفا عدد وارد کنید").min(1, 'مقدار باید حداقل 1 باشد').max(450, 'مقدار باید حداکثر 5 باشد').required("فیلد الزامی!"),
    UniqeUrlString: yup.string().required("فیلد الزامی!"),
    SessionNumber: yup.number("لطفا عدد وارد کنید").min(1, 'مقدار باید حداقل 1 باشد').max(50, 'مقدار باید حداکثر 5 باشد').required("فیلد الزامی!"),
    MiniDescribe: yup.string().min(3,'طول  نویسه کم تر از حد مجاز').max(290,'طول نویسه بیش از حد مجاز').required("فیلد الزامی!"),
    Describe: yup.string().min(3,'طول  نویسه کم تر از حد مجاز').max(850,'طول نویسه بیش از حد مجاز').required("فیلد الزامی!"),
});

export const validCreateCourseLv1 = yup.object().shape({
  Title: yup.string()
    .min(3, "طول نویسه باید بیشتر از 3 حرف باشد")
    .required("نام دوره الزامی است"),
  GoogleTitle: yup.string(),
  Capacity: yup.number()
    .typeError("ظرفیت دوره باید عدد باشد")
    .min(1, "ظرفیت دوره باید حداقل ۱ باشد")
    .required("ظرفیت دوره الزامی است"),
  Cost: yup.number()
    .typeError("قیمت دوره باید یک عدد باشد")
    .required("قیمت دوره الزامی است"),
});
export const validCreateCourseLv2 = yup.object().shape({
  CourseTypeId: yup.number().required("نوع دوره الزامی است"),
  CourseLvlId: yup.number().required("سطح دوره الزامی است"),
  TeacherId: yup.number().required("استاد دوره الزامی است"),
  TremId: yup.number()
    .typeError("آیدی ترم باید یک عدد باشد")
    .required("آیدی ترم الزامی است"),
  ClassId: yup.number().required("کلاس دوره الزامی است"),
  SessionNumber: yup.number()
    .typeError("تعداد جلسات باید یک عدد باشد")
    .required("تعداد جلسات الزامی است"),
});

export const validCreateCourseLv3 = yup.object().shape({
  StartTime: yup.date().required("زمان شروع دوره الزامی است"),
  EndTime: yup.date()
    .required("زمان پایان دوره الزامی است")
    .min(
      yup.ref("StartTime"),
      "زمان پایان دوره باید بعد از زمان شروع دوره باشد"
    ),
  MiniDescribe: yup.string().required("توضیحات کوتاه الزامی می باشد"),
  UniqeUrlString: yup.string()
    .max(30, "شناسه دوره حداکثر باید 30 کاراکتر باشد")
    .required("شناسه دوره الزامی می باشد"),
});

export const validCreateImageCourse = yup.object().shape({
  Text: yup.string()
    .typeError("لطفا نوشته وارد کنید")
    .required("متن جستجو را وارد کنید!"),
});

export const TechnologiesValidation = yup.object({
  techName: yup.string().required("فیلد الزامی!"),
  describe: yup.string().required("فیلد الزامی!"),
});

export const CourseStatusValidation = yup.object({
  statusName: yup.string().required("فیلد الزامی!"),
  describe: yup.string().required("فیلد الزامی!"),
  statusNumber: yup.string().required('شماره یکتا الزامی هست')
});

export const CourseLevelsValidation = yup.object({
  levelName: yup.string().required("فیلد الزامی!").min(5, 'تعداد کاراکتر های سطح دوره باید بیشتر از 5 تا باشد')
  .max(50, 'تعداد کاراکتر های سطح دوره نباید بیشتر از 50 تا باشد')
});

export const ClassroomValidations = yup.object({
  classRoomName: yup.string()
    .required("فیلد الزامی!")
    .min(5, "تعداد کارکتر های نام کلاس بین 5 الی 50 میباشد.")
    .max(50, "تعداد کارکتر های نام کلاس بین 5 الی 50 میباشد."),
  capacity: yup.string().required("فیلد الزامی!")
});