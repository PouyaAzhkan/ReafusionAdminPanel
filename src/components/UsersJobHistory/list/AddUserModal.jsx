import { useState } from 'react'
import { User, Phone, Mail, Lock, X } from 'react-feather'
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupText,
  Alert
} from 'reactstrap'
import toast from 'react-hot-toast'
import { useCreateJobHistory } from '../../../@core/Services/Api/JobHistory/JobHistory'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const AddNewModal = ({ open, handleModal }) => {
  const [form, setForm] = useState({
    jobTitle: '',
    aboutJob: '',
    companyName: '',
    companyWebSite: '',
    companyLinkdin: '',
    workStartDate: '',
    workEndDate: '',
    inWork: false
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { mutate, isLoading } = useCreateJobHistory();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = () => {
    setSuccess(false)
    setError(false)
    setSuccessMessage('')
    setErrorMessage('')
    mutate({ ...form, command: 'create' }, {
      onSuccess: (response) => {
        console.log('پاسخ API:', response)
        if (response.success) {
          toast.success('سابقه شغلی با موفقیت ایجاد شد!')
        }
        setSuccess(true)
        setSuccessMessage('سابقه شغلی با موفقیت ایجاد شد!')
        handleModal()
        setForm({
          jobTitle: '',
          aboutJob: '',
          companyName: '',
          companyWebSite: '',
          companyLinkdin: '',
          workStartDate: '',
          workEndDate: '',
          inWork: false
        })
      },
      onError: (error) => {
        const messages = error.response?.data?.ErrorMessage || ['خطایی رخ داد']
        toast.error(messages.join(', '))
        setError(true)
        setErrorMessage(messages.join(', '))
        console.log('خطای API:', error)
      }
    })
  }

  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>ساخت سابقه شغلی</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        {success && (
          <Alert
            color="success"
            isOpen={success}
            toggle={() => setSuccess(false)}
            fade={false}
          >
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert
            color="danger"
            isOpen={error}
            toggle={() => setError(false)}
            fade={false}
          >
            {errorMessage}
          </Alert>
        )}
        <div className='mb-1'>
          <Label className='form-label' for='jobTitle'>عنوان شغل</Label>
          <InputGroup>
            <InputGroupText><User size={15} /></InputGroupText>
            <Input id='jobTitle' name='jobTitle' value={form.jobTitle} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='aboutJob'>توضیخات شغل</Label>
          <InputGroup>
            <InputGroupText><User size={15} /></InputGroupText>
            <Input id='aboutJob' name='aboutJob' value={form.aboutJob} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='companyName'>نام شرکت</Label>
          <InputGroup>
            <InputGroupText><Mail size={15} /></InputGroupText>
            <Input id='companyName' name='companyName' value={form.companyName} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='companyWebSite'>وب سایت شرکت</Label>
          <InputGroup>
            <InputGroupText><Mail size={15} /></InputGroupText>
            <Input id='companyWebSite' name='companyWebSite' value={form.companyWebSite} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='companyLinkdin'>لینکدین شرکت</Label>
          <InputGroup>
            <InputGroupText><Mail size={15} /></InputGroupText>
            <Input id='companyLinkdin' name='companyLinkdin' value={form.companyLinkdin} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='workStartDate'>تاریخ شروع کار</Label>
          <InputGroup>
            <InputGroupText><Mail size={15} /></InputGroupText>
            <Input type='date' id='workStartDate' name='workStartDate' value={form.workStartDate} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='workEndDate'>تاریخ پایان کار</Label>
          <InputGroup>
            <InputGroupText><Mail size={15} /></InputGroupText>
            <Input type='date' id='workEndDate' name='workEndDate' value={form.workEndDate} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='form-check mb-1'>
          <Input type='checkbox' id='inWork' name='inWork' checked={form.inWork} onChange={handleChange} />
          <Label className='form-check-label' for='inWork'>مشغول بودن</Label>
        </div>
        <Button className='me-1' color='primary' onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : 'ایجاد سابقه شغلی'}
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          انصراف
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddNewModal