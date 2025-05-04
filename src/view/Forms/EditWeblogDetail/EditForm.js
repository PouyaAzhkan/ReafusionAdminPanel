// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Row, Col, Input, Form, Button, Label } from 'reactstrap'

const EditForm = () => {
  return (
    <div>
      <CardHeader>
        <CardTitle className='text-center py-2 text-primary' tag='h1'>ویرایش اطلاعات این خبر</CardTitle>
      </CardHeader>
      <CardBody>
        <Form className='py-1'>
          <Row>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='nameMulti'> عنوان </Label>
              <Input className='text-primary' type='text' name='title' id='nameMulti' placeholder='عنوان' />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='lastNameMulti'> عنوان گوگل </Label>
              <Input className='text-primary' type='text' name='googleTitle' id='lastNameMulti' placeholder='عنوان گوگل'/>
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='cityMulti'> کلمات کلیدی </Label>
              <Input className='text-primary' type='text' name='keyWord' id='cityMulti' placeholder='کلمات کلیدی' />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='CountryMulti'> انتخاب دسته بندی </Label>
              <Input className='text-primary' type='text' name='category' id='CountryMulti' placeholder='انتخاب دسته بندی' />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='CompanyMulti'> توضیحات کوتاه </Label>
              <Input className='text-primary' type='text' name='litleDiscribe' id='CompanyMulti' placeholder='توضیحات کوتاه' />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='EmailMulti'>توضیحات کلی </Label>
              <Input className='text-primary' type='text' name='Discribe' id='EmailMulti' placeholder='توضیحات کلی' />
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='lastNameMulti'> توضیحات گوگل </Label>
              <Input className='text-primary' type='text' name='googleDescribe' id='lastNameMulti' placeholder='توضیحات گوگل'/>
            </Col>
            <Col md='6' sm='12' className='mb-1'>
              <Label className='form-label' for='lastNameMulti'> آپلود عکس </Label>
              <Input className='text-primary' type='file' name='currentImage' id='lastNameMulti' placeholder='آپلود عکس'/>
            </Col>
            <Col className='py-1' sm='12'>
              <div className='d-flex justify-content-center'>
                <Button className='me-1' color='primary' type='submit' onClick={e => e.preventDefault()}>
                  ویرایش
                </Button>
                <Button outline color='danger' type='reset'>
                  لغو
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </div>
  )
}
export default EditForm
