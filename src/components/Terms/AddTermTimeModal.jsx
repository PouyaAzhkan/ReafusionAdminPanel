import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Calendar, Database } from 'react-feather';
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  InputGroup,
  InputGroupText,
} from 'reactstrap';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getAllTerms, useAddTermTime } from '../../@core/Services/Api/Terms/Terms';
import { selectThemeColors } from '../../utility/Utils';
import Select from 'react-select';

const AddTermTimeModal = ({ open, handleModal }) => {
  const [form, setForm] = useState({
    closeReason: '',
    startCloseDate: '',
    endCloseDate: '',
    termId: '',
  });
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);

  const { mutate, isLoading } = useAddTermTime();
  const queryClient = useQueryClient();

  const [currentDepartment, setCurrentterm] = useState(null);

  // Get all departments
  const { data, isLoading: isDataLoading, isError: isDataError } = getAllTerms();

  // Department options from API
  const departmentsOptions = useMemo(
    () =>
      isDataError
        ? [{ value: '', label: 'خطا در بارگذاری ترم ها' }]
        : data
          ? [
            { value: '', label: 'انتخاب' },
            ...data
              .filter((role) => role.expire === false) // فقط ترم‌های غیرمنقضی
              .map((role) => ({
                number: role.id,
                value: role.id,
                label: role.termName || '-',
              })),
          ]
          : [{ value: '', label: 'انتخاب' }],
    [data, isDataError]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (open && isClient) {
      setForm({
        startCloseDate: '',
        endCloseDate: '',
        termId: '',
        closeReason: '',
      });
      setCurrentterm(null);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [open, isClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOption) => {
    setCurrentterm(selectedOption);
    setForm((prev) => ({ ...prev, termId: selectedOption ? selectedOption.value : '' }));
  };

  const handleSubmit = () => {
    // Validate form fields
    if (!form.closeReason) {
      toast.error('لطفاً نام ترم را وارد کنید.');
      return;
    }
    if (!form.termId) {
      toast.error('لطفاً ترم را انتخاب کنید.');
      return;
    }
    if (!form.startCloseDate) {
      toast.error('لطفاً تاریخ شروع را وارد کنید.');
      return;
    }
    if (!form.endCloseDate) {
      toast.error('لطفاً تاریخ پایان را وارد کنید.');
      return;
    }

    // Format data for API
    const formattedData = {
      ...form,
      startCloseDate: `${form.startCloseDate}T00:00:00Z`,
      endCloseDate: `${form.endCloseDate}T00:00:00Z`,
    };

    console.log('Sending data to API:', formattedData);

    mutate(formattedData, {
      onSuccess: (response) => {
        console.log('Raw API Response:', response);
        if (response && (response.success || response.data?.success || response.status === 'success')) {
          toast.success('زمان ترم با موفقیت ایجاد شد!');
          queryClient.invalidateQueries(['Term']);
          handleModal();
          setForm({
            startCloseDate: '',
            endCloseDate: '',
            termId: '',
            closeReason: '',
          });
          setCurrentterm(null);
        } else {
          console.warn('Unexpected API response:', response);
          toast.error(response?.message || 'پاسخ سرور نامعتبر است. با این حال، زمان ترم ممکن است ایجاد شده باشد.');
        }
      },
      onError: (error) => {
        console.error('API Error:', error);
        const messages = error.response?.data?.message ||
          error.response?.data?.errors ||
          error.response?.data?.ErrorMessage ||
          error.message ||
          ['خطایی در ارتباط با سرور رخ داد'];
        toast.error(Array.isArray(messages) ? messages.join(', ') : messages);
      },
    });
  };

  // Log department loading errors
  useEffect(() => {
    if (isDataError) {
      console.error('Failed to load departments');
      toast.error('خطا در بارگذاری دپارتمان‌ها');
    }
  }, [isDataError]);

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
        <h5 className='modal-title'>افزودن زمان بسته شدن ترم</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>

        <div className='mb-1'>
          <Label className='form-label' for='startCloseDate'>
            تاریخ شروع بسته شدن <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <Calendar size={15} />
            </InputGroupText>
            <Input
              type='date'
              id='startCloseDate'
              name='startCloseDate'
              value={form.startCloseDate}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='endCloseDate'>
            تاریخ پایان بسته شدن <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <Calendar size={15} />
            </InputGroupText>
            <Input
              type='date'
              id='endCloseDate'
              name='endCloseDate'
              value={form.endCloseDate}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='termId'>
            ترم های منقضی نشده <span className='text-danger'>*</span>
          </Label>
          <Select
            isClearable={false}
            isLoading={isDataLoading}
            value={departmentsOptions.find((option) => option.value === form.termId)}
            options={departmentsOptions}
            className='react-select'
            classNamePrefix='select'
            theme={selectThemeColors}
            onChange={handleSelectChange}
          />
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='closeReason'>
            دلیل بسته شدن <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <Database size={15} />
            </InputGroupText>
            <Input
              id='closeReason'
              name='closeReason'
              value={form.closeReason}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>

        <Button className='me-1' color='primary' onClick={handleSubmit} disabled={isLoading || isDataLoading}>
          {isLoading ? 'در حال ارسال...' : 'ایجاد زمان بسته شدن'}
        </Button>
        <Button color='secondary' onClick={handleModal} outline disabled={isLoading}>
          انصراف
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default AddTermTimeModal;