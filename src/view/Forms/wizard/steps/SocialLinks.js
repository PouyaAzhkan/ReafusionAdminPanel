// ** React Imports
import { Fragment } from 'react'

// ** Icons Imports
import { ArrowLeft } from 'react-feather'

// ** Reactstrap Imports
import { Col, Button } from 'reactstrap'

const SocialLinks = ({ stepper, formData, onSubmitFinal }) => {
  return (
    <Fragment>
      <Col xs={12}>
        <img
          className="img-fluid card-img-top w-100 rounded"
          style={{ height: "310px", objectFit: 'cover' }}
          src={formData?.previewImageUrl || 'https://via.placeholder.com/600x310?text=No+Image'}
          alt="خبر"
        />
      </Col>

      <Col xs={12} className="my-2 gap-2 d-flex align-items-center flex-wrap gap-5">
        <h4 className='text-primary'><div className='text-dark'>عنوان خبر:</div> {formData?.title || '---'}</h4>
        <div className='text-primary'><div className='text-dark'>دسته‌بندی:</div> {
          Array.isArray(formData?.category)
            ? (typeof formData.category[0] === 'object'
                ? formData.category.map(c => c.label).join(', ')
                : formData.category.join(', ')
              )
            : '---'
        }</div>
        <div className='text-primary'><div className='text-dark'>توضیح کوتاه:</div> {formData?.miniDescribe || '---'}</div>
        <div className='text-primary'><div className='text-dark'>توضیحات:</div> {formData?.describe || '---'}</div>
        <div className='text-primary'><div className='text-dark'>کلمات کلیدی:</div> {formData?.keyword || '---'}</div>
        <div className='text-primary'><div className='text-dark'>عنوان گوگل:</div> {formData?.googleTitle || '---'}</div>
        <div className='text-primary'><div className='text-dark'>توضیح گوگل:</div> {formData?.googleDescribe || '---'}</div>
      </Col>

      <div className='d-flex justify-content-between mt-2'>
        <Button color="secondary" className='btn-prev' onClick={() => stepper.previous()}>
          <ArrowLeft size={14} className='align-middle me-sm-25 me-0' />
          <span className='align-middle d-sm-inline-block d-none'>قبلی</span>
        </Button>
        <Button color='primary' className='btn-submit' onClick={onSubmitFinal}>
          ساخت خبر
        </Button>
      </div>
    </Fragment>
  )
}

export default SocialLinks
