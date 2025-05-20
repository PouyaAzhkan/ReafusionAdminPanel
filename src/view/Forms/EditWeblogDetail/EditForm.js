import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label, FormFeedback, Spinner } from 'reactstrap';
import { EditWeblogDetail } from '../../../@core/Services/Api/Weblog&News/EditWeblogDetail';
import { EditWeblogValidation } from '../../../@core/utils/Validation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GetCategoryList } from '../../../@core/Services/Api/Weblog&News/GetCategoryList';
import  EditCategoryWeblog from '../../../@core/Services/Api/Weblog&News/EditWeblogCategory';
import toast from 'react-hot-toast';

const EditForm = ({ Api1, id, onWeblogChange, onWeblogUpdate, onCloseModal }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'onSubmit',
    resolver: yupResolver(EditWeblogValidation),
    defaultValues: {
      Id: id || '',
      title: Api1?.title || '',
      googleTitle: Api1?.googleTitle || '',
      keyWord: Api1?.keyword || '',
      newsCatregoryName: Api1?.newsCatregoryName || '',
      litleDiscribe: Api1?.miniDescribe || '',
      Discribe: Api1?.describe || '',
      googleDescribe: Api1?.googleDescribe || '',
      CurrentImageAddress: null,
    },
  });

  const [file, setFile] = useState(null);

  const handleInputChange = (e, onChange) => {
    const { type, files, value } = e.target;
    if (type === 'file') {
      setFile(files[0]);
      onChange(files[0]);
    } else {
      onChange(value);
    }
  };

  const { mutate: EditWeblog, isLoading: EditWeblogLoading, isPending: EditWeblogPendeng } = EditWeblogDetail();
  const { mutate: EditCategory, isLoading: EditCategoryLoading, isPending: EditCategoryPending } = EditCategoryWeblog();
  const { data: getCategory, isLoading: getCategoryLoading } = GetCategoryList();

  useEffect(() => {
    if (Api1) {
      setValue('title', Api1.title);
      setValue('googleTitle', Api1.googleTitle);
      setValue('keyWord', Api1.keyword);
      setValue('newsCatregoryName', Api1.newsCatregoryName);
      setValue('litleDiscribe', Api1.miniDescribe);
      setValue('Discribe', Api1.describe);
      setValue('googleDescribe', Api1.googleDescribe);
    }
  }, [Api1, setValue]);

  if (EditWeblogLoading || EditCategoryLoading || getCategoryLoading) return <p>در حال بارگذاری...</p>;

  const EditWeblogInfo = (data) => {
    const selectedCategory = getCategory?.find((cat) => cat.categoryName === data.newsCatregoryName);
    const formData = new FormData();
    formData.append('Id', id || '');
    formData.append('title', data.title);
    formData.append('NewsCatregoryId', selectedCategory?.id || Api1?.newsCatregoryId || '');
    formData.append('Active', true);
    formData.append('googleTitle', data.googleTitle);
    formData.append('keyword', data.keyWord);
    formData.append('newsCatregoryName', data.newsCatregoryName);
    formData.append('miniDescribe', data.litleDiscribe);
    formData.append('describe', data.Discribe);
    formData.append('googleDescribe', data.googleDescribe);
    if (data.CurrentImageAddress) {
      formData.append('CurrentImageAddress', data.CurrentImageAddress);
    }

    EditWeblog(formData, {
      onSuccess: () => {
        toast.success('خبر با موفقیت ویرایش شد');
        // ارسال تمام داده‌های ویرایش‌شده به InfoCard
        onWeblogChange({
          title: data.title,
          googleTitle: data.googleTitle,
          keyword: data.keyWord,
          newsCatregoryName: data.newsCatregoryName,
          miniDescribe: data.litleDiscribe,
          describe: data.Discribe,
          googleDescribe: data.googleDescribe,
          currentImageAddress: data.CurrentImageAddress
            ? URL.createObjectURL(data.CurrentImageAddress)
            : Api1?.currentImageAddress,
        });
        onWeblogUpdate(); // فراخوانی برای بارگذاری مجدد داده‌ها از API
        onCloseModal(); // بستن مودال پس از موفقیت
      },
      onError: (error) => {
        toast.error('خطا در ویرایش خبر');
        console.log(error);
        onCloseModal(); // بستن مودال پس از موفقیت
      },
    });
  };

  const EditCategoryInfo = (data) => {
    const selectedCategory = getCategory?.find((cat) => cat.categoryName === data.newsCatregoryName);
    if (!selectedCategory) {
      alert('دسته‌بندی انتخاب‌شده معتبر نیست');
      return;
    }

    const formData = new FormData();
    formData.append('Id', selectedCategory?.id || Api1?.newsCatregoryId || '');
    formData.append('CategoryName', data.newsCatregoryName);
    formData.append('GoogleTitle', data?.googleTitle);
    formData.append('GoogleDescribe', data?.googleDescribe);

    EditCategory(formData, {
      onSuccess: () => {
        EditWeblogInfo(data); // پس از ویرایش دسته‌بندی، خبر را ویرایش می‌کنیم
      },
      onError: (err) => {
        console.log('خطا در ویرایش دسته‌بندی:', err);
      },
    });
  };

  const onSubmit = (data) => {
    EditCategoryInfo(data); // ابتدا دسته‌بندی را ویرایش می‌کنیم
  };

  return (
    <div>
      <CardHeader>
        <CardTitle className="text-center py-2 text-primary" tag="h1">
          ویرایش اطلاعات این خبر
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Form className="py-1" onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md="6" sm="12" className="mb-1">
              <Label for="title">عنوان</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input className='text-primary' type="text" invalid={!!errors.title} placeholder="عنوان" {...field} />
                )}
              />
              {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="googleTitle">عنوان گوگل</Label>
              <Controller
                name="googleTitle"
                control={control}
                render={({ field }) => (
                  <Input className='text-primary' type="text" invalid={!!errors.googleTitle} placeholder="عنوان گوگل" {...field} />
                )}
              />
              {errors.googleTitle && <FormFeedback>{errors.googleTitle.message}</FormFeedback>}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="keyWord">کلمات کلیدی</Label>
              <Controller
                name="keyWord"
                control={control}
                render={({ field }) => (
                  <Input className='text-primary' type="text" invalid={!!errors.keyWord} placeholder="کلمات کلیدی" {...field} />
                )}
              />
              {errors.keyWord && <FormFeedback>{errors.keyWord.message}</FormFeedback>}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="newsCatregoryName">انتخاب دسته‌بندی</Label>
              <Controller
                name="newsCatregoryName"
                control={control}
                render={({ field }) => (
                  <Input className='text-primary' type="select" invalid={!!errors.newsCatregoryName} {...field}>
                    <option value="">انتخاب کنید</option>
                    {getCategory?.map((cat) => (
                      <option key={cat.id} value={cat.categoryName}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </Input>
                )}
              />
              {errors.newsCatregoryName && <FormFeedback>{errors.newsCatregoryName.message}</FormFeedback>}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="litleDiscribe">توضیحات کوتاه</Label>
              <Controller
                name="litleDiscribe"
                control={control}
                render={({ field }) => (
                  <Input className='text-primary' type="text" invalid={!!errors.litleDiscribe} placeholder="توضیحات کوتاه" {...field} />
                )}
              />
              {errors.litleDiscribe && <FormFeedback>{errors.litleDiscribe.message}</FormFeedback>}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="Discribe">توضیحات کلی</Label>
              <Controller
                name="Discribe"
                control={control}
                render={({ field }) => (
                  <Input className='text-primary' type="text" invalid={!!errors.Discribe} placeholder="توضیحات کلی" {...field} />
                )}
              />
              {errors.Discribe && <FormFeedback>{errors.Discribe.message}</FormFeedback>}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="googleDescribe">توضیحات گوگل</Label>
              <Controller
                name="googleDescribe"
                control={control}
                render={({ field }) => (
                  <Input className='text-primary' type="text" invalid={!!errors.googleDescribe} placeholder="توضیحات گوگل" {...field} />
                )}
              />
              {errors.googleDescribe && <FormFeedback>{errors.googleDescribe.message}</FormFeedback>}
            </Col>

            <Col md="6" sm="12" className="mb-1">
              <Label for="CurrentImageAddress">آپلود تصویر</Label>
              <Controller
                name="CurrentImageAddress"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => (
                  <Input
                    type="file"
                    className='text-primary'
                    invalid={!!errors.CurrentImageAddress}
                    onChange={(e) => handleInputChange(e, onChange)}
                    {...rest}
                  />
                )}
              />
              {errors.CurrentImageAddress && <FormFeedback>{errors.CurrentImageAddress.message}</FormFeedback>}
            </Col>

            <Col sm="12" className="text-center py-1">
              <Button type="submit" color="primary" className="me-1" disabled={EditWeblogPendeng || EditCategoryPending}>
                ویرایش
                {EditWeblogPendeng || EditCategoryPending && <Spinner size="sm" color="light" />}
              </Button>
              <Button type="reset" outline color="danger">
                لغو
              </Button>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </div>
  );
};

export default EditForm;