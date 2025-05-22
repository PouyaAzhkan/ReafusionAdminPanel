// ** React Imports
import { Fragment, useEffect } from 'react'
import { selectThemeColors } from '@utils'
// ** Third Party Components
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'

// ** Reactstrap
import { Form, Label, Input, Row, Col, Button, FormFeedback } from 'reactstrap'
import  GetCategoryList  from '../../../../@core/Services/Api/Weblog&News/GetCategoryList'

// ** Validation Schema
const SignupSchema = yup.object().shape({
  title: yup
    .string()
    .required('عنوان خبر الزامی است')
    .min(10, 'عنوان باید حداقل 10 کاراکتر باشد')
    .max(120, 'عنوان باید حداکثر 120 کاراکتر باشد'),
  googleTitle: yup
    .string()
    .required('عنوان گوگل الزامی است')
    .min(5, 'عنوان گوگل باید حداقل 5 کاراکتر باشد')
    .max(70, 'عنوان گوگل باید حداکثر 70 کاراکتر باشد'),
  googleDescribe: yup
    .string()
    .required('توضیحات گوگل الزامی است')
    .min(70, 'توضیحات گوگل باید حداقل ۷۰ کاراکتر باشد')
    .max(150, 'توضیحات گوگل باید حداکثر ۱۵۰ کاراکتر باشد'),
  miniDescribe: yup
    .string()
    .required('توضیح کوتاه الزامی است')
    .min(10, 'توضیحات گوگل باید حداقل 10 کاراکتر باشد')
    .max(300, 'توضیحات گوگل باید حداکثر 300 کاراکتر باشد'),
  keyword: yup
    .string()
    .required('کلمه کلیدی الزامی است')
    .min(10, 'کلمه کلیدی باید حداقل 10 کاراکتر باشد')
    .max(300, 'کلمه کلیدی باید حداکثر 300 کاراکتر باشد'),
  category: yup
    .array()
    .min(1, 'حداقل یک دسته‌بندی انتخاب کنید')
})

const PersonalInfo = ({ stepper, formData, setFormData }) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      title: formData?.title || '',
      googleTitle: formData?.googleTitle || '',
      googleDescribe: formData?.googleDescribe || '',
      miniDescribe: formData?.miniDescribe || '',
      keyword: formData?.keyword || '',
      category: formData?.category || []
    }
  })

  useEffect(() => {
    if (formData) {
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined) {
          setValue(key, value)
        }
      })
    }
  }, [formData, setValue])

  const { data, isLoading, error } = GetCategoryList()

  if (isLoading) return <p>درحال بارگذاری...</p>
  if (error) return <p>خطا در دریافت دسته‌بندی‌ها</p>

  const categoryOptions = data?.map(cat => ({
    value: cat.id,
    label: cat.categoryName
  })) || []

  const onSubmit = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
    stepper.next()
  }

  return (
    <Fragment>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md='6' className='mb-1'>
            <Label for='title'>عنوان خبر</Label>
            <Controller
              control={control}
              name='title'
              render={({ field }) => (
                <Input className='text-primary' {...field} placeholder='عنوان خبر' invalid={!!errors.title} />
              )}
            />
            <FormFeedback>{errors.title?.message}</FormFeedback>
          </Col>

          <Col md='6' className='mb-1'>
            <Label for='googleTitle'>عنوان گوگل</Label>
            <Controller
              control={control}
              name='googleTitle'
              render={({ field }) => (
                <Input className='text-primary' {...field} placeholder='عنوان گوگل' invalid={!!errors.googleTitle} />
              )}
            />
            <FormFeedback>{errors.googleTitle?.message}</FormFeedback>
          </Col>
        </Row>

        <Row>
          <Col md='6' className='mb-1'>
            <Label for='googleDescribe'>توضیحات گوگل</Label>
            <Controller
              control={control}
              name='googleDescribe'
              render={({ field }) => (
                <Input className='text-primary' {...field} placeholder='توضیحات گوگل' invalid={!!errors.googleDescribe} />
              )}
            />
            <FormFeedback>{errors.googleDescribe?.message}</FormFeedback>
          </Col>

          <Col md='6' className='mb-1'>
            <Label for='miniDescribe'>توضیح کوتاه</Label>
            <Controller
              control={control}
              name='miniDescribe'
              render={({ field }) => (
                <Input className='text-primary' {...field} placeholder='توضیح کوتاه' invalid={!!errors.miniDescribe} />
              )}
            />
            <FormFeedback>{errors.miniDescribe?.message}</FormFeedback>
          </Col>

          <Col md='6' className='mb-1'>
            <Label for='keyword'>کلمه کلیدی</Label>
            <Controller
              control={control}
              name='keyword'
              render={({ field }) => (
                <Input className='text-primary' {...field} placeholder='کلمه کلیدی' invalid={!!errors.keyword} />
              )}
            />
            <FormFeedback>{errors.keyword?.message}</FormFeedback>
          </Col>

          <Col md='6' className='mb-1'>
            <Label for='category'>دسته‌بندی</Label>
            <Controller
              control={control}
              name='category'
              render={({ field }) => (
                <Select
                  theme={selectThemeColors}
                  {...field}
                  isMulti
                  options={categoryOptions}
                  className='react-select'
                  classNamePrefix='select'
                  placeholder='انتخاب کنید'
                  onChange={field.onChange}
                  value={field.value}
                />
              )}
            />
            {errors.category && <div className='text-danger mt-1'>{errors.category.message}</div>}
          </Col>
        </Row>

        <div className='d-flex justify-content-between mt-3'>
          <Button color='secondary' className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} />
            <span className='align-middle d-sm-inline-block d-none'>قبلی</span>
          </Button>
          <Button type='submit' color='primary' className='btn-next'>
            <span className='align-middle d-sm-inline-block d-none'>بعدی</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default PersonalInfo
