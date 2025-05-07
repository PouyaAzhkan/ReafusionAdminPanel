// ** React Imports
import { useEffect, Fragment } from 'react'

// ** Icons Imports
import { ArrowLeft, ArrowRight } from 'react-feather'

// ** Reactstrap Imports
import { Form, Input, Button, Col, FormFeedback } from 'reactstrap'

// ** React Hook Form and Yup Imports
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const Address = ({ stepper, formData, setFormData }) => {
  // ** Schema
  const validationSchema = yup.object().shape({
    describe: yup.string().required('توضیحات خبر الزامی است').min(30, 'توضیحات باید حداقل 30 کاراکتر باشد')
  })

  // ** Form Setup
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      describe: formData?.describe || ''
    }
  })

  // ** Set previous data
  useEffect(() => {
    if (formData?.describe) {
      setValue('describe', formData.describe)
    }
  }, [formData, setValue])

  // ** Submit Handler
  const onSubmit = (data) => {
    setFormData(prev => ({ ...prev, ...data }))
    stepper.next()
  }

  return (
    <Fragment>
      <div className='content-header'>
        <h1 className='mb-0 text-center text-primary'>توضیحات خبر را وارد کنید</h1>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ minHeight: '300px', marginTop: '10px' }}>
          <Col>
            <Controller
              control={control}
              name="describe"
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  className='text-primary'
                  placeholder="توضیحات..."
                  invalid={!!errors.describe}
                  style={{ minHeight: '300px' }}
                />
              )}
            />
            {errors.describe && <FormFeedback>{errors.describe.message}</FormFeedback>}
          </Col>
        </div>
        <div className='d-flex justify-content-between mt-3'>
          <Button color="secondary" className='btn-prev' onClick={() => stepper.previous()}>
            <ArrowLeft size={14} className='align-middle me-sm-25 me-0' />
            <span className='align-middle d-sm-inline-block d-none'>قبلی</span>
          </Button>
          <Button color='primary' className='btn-next' type="submit">
            <span className='align-middle d-sm-inline-block d-none'>بعدی</span>
            <ArrowRight size={14} className='align-middle ms-sm-25 ms-0' />
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default Address