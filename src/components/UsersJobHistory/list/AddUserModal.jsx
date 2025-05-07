// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import { User, Phone, Mail, Lock, X } from 'react-feather'

// ** Reactstrap Imports
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

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { useCreateUser } from '../../../@core/Services/Api/UserManage/user'

const AddNewModal = ({ open, handleModal }) => {
  // ** States
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gmail: '',
    password: '',
    phoneNumber: '',
    isStudent: false,
    isTeacher: false
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { mutate, isLoading } = useCreateUser()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = () => {
    if (!form.gmail.includes('@') || !form.gmail.includes('.')) {
      alert('لطفاً یک ایمیل معتبر وارد کنید (مثال: test@example.com)')
      return
    }
    if (!/^\d{11}$/.test(form.phoneNumber)) {
      alert('شماره تلفن باید 11 رقم باشد (مثال: 09123456789)')
      return
    }
    setSuccess(false)
    setError(false)
    setSuccessMessage('')
    setErrorMessage('')
    mutate({ ...form, command: 'create' }, {
      onSuccess: (response) => {
        // نمایش کل پاسخ API در کنسول
        console.log('پاسخ API:', response)
        // بررسی موفقیت و نمایش آلرت
        if (response.success) {
          alert('ایجاد شد')
        }
        setSuccess(true)
        setSuccessMessage('کاربر با موفقیت ایجاد شد!')
        handleModal()
        setForm({
          firstName: '',
          lastName: '',
          gmail: '',
          password: '',
          phoneNumber: '',
          isStudent: false,
          isTeacher: false
        })
      },
      onError: (error) => {
        const messages = error.response?.data?.ErrorMessage || ['خطایی رخ داد']
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
        <h5 className='modal-title'>ساخت کاربر</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        {success && (
          <Alert
            color="success"
            isOpen={success}
            toggle={() => setSuccess(false)}
            fade={false} // غیرفعال کردن انیمیشن برای رفع خطا
          >
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert
            color="danger"
            isOpen={error}
            toggle={() => setError(false)}
            fade={false} // غیرفعال کردن انیمیشن برای رفع خطا
          >
            {errorMessage}
          </Alert>
        )}
        {/*fisrt name */}
        <div className='mb-1'>
          <Label className='form-label' for='firstName'>نام</Label>
          <InputGroup>
            <InputGroupText><User size={15} /></InputGroupText>
            <Input id='firstName' name='firstName' value={form.firstName} onChange={handleChange} />
          </InputGroup>
        </div>

        {/* last name */}
        <div className='mb-1'>
          <Label className='form-label' for='lastName'>نام خانوادگی</Label>
          <InputGroup>
            <InputGroupText><User size={15} /></InputGroupText>
            <Input id='lastName' name='lastName' value={form.lastName} onChange={handleChange} />
          </InputGroup>
        </div>

        {/* gmail */}
        <div className='mb-1'>
          <Label className='form-label' for='gmail'>ایمیل</Label>
          <InputGroup>
            <InputGroupText><Mail size={15} /></InputGroupText>
            <Input type='email' id='gmail' name='gmail' value={form.gmail} onChange={handleChange} />
          </InputGroup>
        </div>

        {/* password */}
        <div className='mb-1'>
          <Label className='form-label' for='password'>رمزعبور</Label>
          <InputGroup>
            <InputGroupText><Lock size={15} /></InputGroupText>
            <Input type='password' id='password' name='password' value={form.password} onChange={handleChange} />
          </InputGroup>
        </div>

        {/* phone */}
        <div className='mb-1'>
          <Label className='form-label' for='phoneNumber'>شماره تماس</Label>
          <InputGroup>
            <InputGroupText><Phone size={15} /></InputGroupText>
            <Input type='text' id='phoneNumber' name='phoneNumber' value={form.phoneNumber} onChange={handleChange} />
          </InputGroup>
        </div>

        {/* is student */}
        <div className='form-check mb-1'>
          <Input type='checkbox' id='isStudent' name='isStudent' checked={form.isStudent} onChange={handleChange} />
          <Label className='form-check-label' for='isStudent'>دانشجو هست</Label>
        </div>

        {/* is teacher */}
        <div className='form-check mb-1'>
          <Input type='checkbox' id='isTeacher' name='isTeacher' checked={form.isTeacher} onChange={handleChange} />
          <Label className='form-check-label' for='isTeacher'>مربی هست</Label>
        </div>

        <Button className='me-1' color='primary' onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : 'ایجاد کاربر'}
        </Button>

        <Button color='secondary' onClick={handleModal} outline>
          انصراف
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default AddNewModal