import * as yup from 'yup';

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
