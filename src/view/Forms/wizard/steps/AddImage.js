import { Fragment, useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Camera } from 'react-feather'

// ** Reactstrap
import { Row, Col, Form, Button } from 'reactstrap'

// ** Yup
import * as yup from 'yup'

const AddImage = ({ stepper, formData, setFormData }) => {
  const [file, setFile] = useState(formData?.image)
  const [previewUrl, setPreviewUrl] = useState(formData?.previewImageUrl || null)
  const [error, setError] = useState('')

  // yup schema
  const fileSchema = yup
    .mixed()
    .required('لطفا یک عکس انتخاب کنید')
    .test('fileType', 'فقط فایل تصویری مجاز است', (value) => {
      return value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type)
    })

  // generate preview
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  const handleNext = async () => {
    try {
      await fileSchema.validate(file)
      setError('')
      setFormData(prev => ({ ...prev, image: file, previewImageUrl: previewUrl }))
      stepper.next()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Fragment>
      <Form onSubmit={e => e.preventDefault()}>
        <Row>
          <Col
            sm={6}
            className="d-flex justify-content-center flex-wrap my-auto"
            style={{ height: 'fit-content' }}
          >
            <h1 className="w-100 text-center">عکس را وارد کنید</h1>
            <input
              id="image1"
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              onChange={(e) => {
                const selectedFile = e.target.files[0]
                setFile(selectedFile)
                setError('')
              }}
            />
            <Button color="primary" className="my-2" style={{ padding: '0px' }}>
              <label
                htmlFor="image1"
                className="d-flex justify-content-center gap-75 p-1 cursor-pointer"
              >
                <span className="align-middle d-sm-inline-block d-none">افزودن عکس</span>
                <Camera size={16} />
              </label>
            </Button>
            {error && <p className="text-danger w-100 text-center mt-1">{error}</p>}
          </Col>
          <Col sm={6} style={{ height: '300px' }}>
            <div
              className="w-100 h-100 d-flex justify-content-center align-items-center border rounded"
              style={{ overflow: 'hidden' }}
            >
              {previewUrl ? (
                <img className="w-100 h-100" alt="افزودن عکس" src={previewUrl} style={{ objectFit: 'cover' }} />
              ) : (
                <span>عکسی آپلود نشده</span>
              )}
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-between mt-4">
          <Button color="secondary" className="btn-prev" outline disabled>
            <ArrowLeft size={14} className="align-middle me-sm-25 me-0" />
            <span className="align-middle d-sm-inline-block d-none">قبلی</span>
          </Button>
          <Button color="primary" className="btn-next" onClick={handleNext}>
            <span className="align-middle d-sm-inline-block d-none">بعدی</span>
            <ArrowRight size={14} className="align-middle ms-sm-25 ms-0" />
          </Button>
        </div>
      </Form>
    </Fragment>
  )
}

export default AddImage