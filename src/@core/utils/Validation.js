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
