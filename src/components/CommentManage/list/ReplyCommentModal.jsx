import { useState } from 'react';
import { User, X } from 'react-feather';
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupText,
  Alert,
} from 'reactstrap';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import { useAddReplyComment } from '../../../@core/Services/Api/CommentManage/CommentManage';
import toast from 'react-hot-toast'; // وارد کردن react-hot-toast

const ReplyCommentModal = ({ open, handleModal, CommentId, CourseId }) => {
  const [form, setForm] = useState({
    Title: '',
    Describe: '',
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate, isLoading } = useAddReplyComment();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!CommentId) {
      setError(true);
      setErrorMessage('شناسه کامنت نامعتبر است');
      return;
    }
    if (!CourseId) {
      setError(true);
      setErrorMessage('شناسه دوره نامعتبر است');
      return;
    }
    if (!form.Title.trim()) {
      setError(true);
      setErrorMessage('عنوان نمی‌تواند خالی باشد');
      return;
    }
    if (form.Title.trim().length < 5) {
      setError(true);
      setErrorMessage('عنوان باید حداقل 5 کاراکتر باشد');
      return;
    }
    if (!form.Describe.trim()) {
      setError(true);
      setErrorMessage('توضیحات نمی‌تواند خالی باشد');
      return;
    }
    if (form.Describe.trim().length < 5) {
      setError(true);
      setErrorMessage('توضیحات باید حداقل 5 کاراکتر باشد');
      return;
    }
    setSuccess(false);
    setError(false);
    setSuccessMessage('');
    setErrorMessage('');
    console.log('داده‌های ارسالی به mutate:', {
      commentId: CommentId,
      courseId: CourseId,
      title: form.Title,
      describe: form.Describe,
    });
    mutate(
      {
        commentId: CommentId,
        courseId: CourseId,
        title: form.Title,
        describe: form.Describe,
      },
      {
        onSuccess: (response) => {
          console.log('پاسخ API:', response);
          if (response.success) {
            toast.success('پاسخ ثبت شد'); // استفاده از toast.success به جای alert
            setSuccess(true);
            setSuccessMessage('پاسخ با موفقیت ثبت شد!');
            handleModal();
            setForm({ Title: '', Describe: '' });
          } else {
            setError(true);
            setErrorMessage('پاسخ API موفقیت‌آمیز نبود');
          }
        },
        onError: (error) => {
          const errorData = error.response?.data;
          let messages = ['خطایی رخ داد'];
          if (errorData?.ErrorMessage) {
            messages = errorData.ErrorMessage.map((msg) => {
              if (msg.includes('{PropertName}')) {
                if (form.Title.length < 5) {
                  return 'عنوان باید حداقل 5 کاراکتر باشد';
                }
                if (form.Describe.length < 5) {
                  return 'توضیحات باید حداقل 5 کاراکتر باشد';
                }
                return 'یکی از فیلدها باید حداقل 5 کاراکتر باشد';
              }
              return msg;
            });
          } else if (error.message) {
            messages = [error.message];
          }
          setError(true);
          setErrorMessage(messages.join(', '));
          console.log('خطای API:', error);
        },
      }
    );
  };

  const CloseBtn = <X className='cursor-pointer' size={15} onClick={handleModal} />;

  return (
    <Modal
      isOpen={open}
      toggle={handleModal}
      className='sidebar-sm'
      modalClassName='modal-slide-in'
      contentClassName='pt-0'
    >
      <ModalHeader className='mb-1' toggle={handleModal} close={CloseBtn} tag='div'>
        <h5 className='modal-title'>پاسخ به کامنت</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        {success && (
          <Alert color='success' isOpen={success} toggle={() => setSuccess(false)} fade={false}>
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert color='danger' isOpen={error} toggle={() => setError(false)} fade={false}>
            {errorMessage}
          </Alert>
        )}
        <div className='mb-1'>
          <Label className='form-label' for='Title'>
            عنوان
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input
              id='Title'
              name='Title'
              value={form.Title}
              onChange={handleChange}
              placeholder='عنوان پاسخ'
            />
          </InputGroup>
        </div>
        <div className='mb-1'>
          <Label className='form-label' for='Describe'>
            توضیحات
          </Label>
          <InputGroup>
            <InputGroupText>
              <User size={15} />
            </InputGroupText>
            <Input
              id='Describe'
              name='Describe'
              value={form.Describe}
              onChange={handleChange}
              placeholder='متن پاسخ'
            />
          </InputGroup>
        </div>
        <Button className='me-1' color='primary' onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'در حال ارسال...' : 'ثبت پاسخ'}
        </Button>
        <Button color='secondary' onClick={handleModal} outline>
          انصراف
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default ReplyCommentModal;