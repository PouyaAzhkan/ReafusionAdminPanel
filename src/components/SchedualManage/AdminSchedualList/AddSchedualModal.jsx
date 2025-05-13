import { useState } from 'react'
import { Briefcase, Calendar, Home, PenTool, Linkedin, Link, X, Clock } from 'react-feather'
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

const AddSchedualModal = ({ open, handleModal }) => {
  const [form, setForm] = useState({
    course: '',
    courseGroup: '',
    startDate: '',
    startTime: '',
    endTime: '',
    weekNumber: '',
    rowEffect: '',
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
          course: '',
          courseGroup: '',
          startDate: '',
          startTime: '',
          endTime: '',
          weekNumber: '',
          rowEffect: '',
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
        <h5 className='modal-title'>ساخت بازه زمانی</h5>
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
          <Label className='form-label' for='course'>دوره</Label>
          <InputGroup>
            <InputGroupText><Briefcase size={15} /></InputGroupText>
            <Input id='course' name='course' value={form.course} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='courseGroup'>گروه دوره</Label>
          <InputGroup>
            <InputGroupText><PenTool size={15} /></InputGroupText>
            <Input id='courseGroup' name='courseGroup' value={form.courseGroup} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='startDate'>تاریخ شروع</Label>
          <InputGroup>
            <InputGroupText><Calendar size={15} /></InputGroupText>
            <Input type='date' id='startDate' name='startDate' value={form.startDate} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='startTime'>ساعت شروع</Label>
          <InputGroup>
            <InputGroupText><Clock size={15} /></InputGroupText>
            <Input type='time' id='startTime' name='startTime' value={form.startTime} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='endTime'>ساعت پایان</Label>
          <InputGroup>
            <InputGroupText><Clock size={15} /></InputGroupText>
            <Input type='time' id='endTime' name='endTime' value={form.endTime} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='weekNumber'>تعداد کلاس در هفته</Label>
          <InputGroup>
            <InputGroupText><Home size={15} /></InputGroupText>
            <Input type='number' id='weekNumber' name='weekNumber' value={form.weekNumber} onChange={handleChange} />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='rowEffect'>تعداد کل کلاس ها</Label>
          <InputGroup>
            <InputGroupText><Home size={15} /></InputGroupText>
            <Input type='number' id='rowEffect' name='rowEffect' value={form.rowEffect} onChange={handleChange} />
          </InputGroup>
        </div>
        <Button className='me-1' color='primary' onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : 'ایجاد بازه زمانی'}
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          انصراف
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddSchedualModal