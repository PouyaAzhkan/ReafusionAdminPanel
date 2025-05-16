import { useState, useEffect, useRef } from 'react';
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
import { getAllDepartments, useAddTerm } from '../../@core/Services/Api/Terms/Terms';
import { selectThemeColors } from './../../utility/Utils';
import Select from 'react-select';

const AddTermModal = ({ open, handleModal }) => {
  const [form, setForm] = useState({
    termName: '',
    startDate: '',
    endDate: '',
    departmentId: '',
  });
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef(null);

  const { mutate, isLoading } = useAddTerm();
  const queryClient = useQueryClient();

  const [currentDepartment, setCurrentDepartment] = useState(null);

  // Get all departments
  const { data, isLoading: isDataLoading, isError: isDataError } = getAllDepartments();

  // Department options from API
  const departmentsOptions = data
    ? [
        { value: '', label: 'انتخاب' },
        ...data?.map((role) => ({
          number: role.id,
          value: role.id,
          label: role.depName,
        })),
      ]
    : [{ value: '', label: 'انتخاب' }];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (open && isClient) {
      setForm({
        termName: '',
        startDate: '',
        endDate: '',
        departmentId: '',
      });
      setCurrentDepartment(null);
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
    setCurrentDepartment(selectedOption);
    setForm((prev) => ({ ...prev, departmentId: selectedOption ? selectedOption.value : '' }));
  };

  const handleSubmit = () => {
    // Validate form fields
    if (!form.termName) {
      toast.error('لطفاً نام ترم را وارد کنید.');
      return;
    }
    if (!form.departmentId) {
      toast.error('لطفاً دپارتمان را انتخاب کنید.');
      return;
    }
    if (!form.startDate) {
      toast.error('لطفاً تاریخ شروع را وارد کنید.');
      return;
    }
    if (!form.endDate) {
      toast.error('لطفاً تاریخ پایان را وارد کنید.');
      return;
    }

    // Format data for API
    const formattedData = {
      ...form,
      startDate: `${form.startDate}T00:00:00Z`,
      endDate: `${form.endDate}T00:00:00Z`,
    };

    console.log('Sending data to API:', formattedData);

    mutate(formattedData, {
      onSuccess: (response) => {
        console.log('Raw API Response:', response);
        if (response && (response.success || response.data?.success || response.status === 'success')) {
          toast.success('ترم با موفقیت ایجاد شد!');
          queryClient.invalidateQueries(['Term']);
          handleModal();
          setForm({
            termName: '',
            startDate: '',
            endDate: '',
            departmentId: '',
          });
          setCurrentDepartment(null);
        } else {
          console.warn('Unexpected API response:', response);
          toast.error(response?.message || 'پاسخ سرور نامعتبر است. با این حال، ترم ممکن است ایجاد شده باشد.');
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
        <h5 className='modal-title'>افزودن ترم</h5>
      </ModalHeader>
      <ModalBody className='flex-grow-1'>
        <div className='mb-1'>
          <Label className='form-label' for='termName'>
            نام ترم <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <Database size={15} />
            </InputGroupText>
            <Input
              id='termName'
              name='termName'
              value={form.termName}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='startDate'>
            تاریخ شروع <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <Calendar size={15} />
            </InputGroupText>
            <Input
              type='date'
              id='startDate'
              name='startDate'
              value={form.startDate}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='endDate'>
            تاریخ پایان <span className='text-danger'>*</span>
          </Label>
          <InputGroup>
            <InputGroupText>
              <Calendar size={15} />
            </InputGroupText>
            <Input
              type='date'
              id='endDate'
              name='endDate'
              value={form.endDate}
              onChange={handleChange}
              required
            />
          </InputGroup>
        </div>

        <div className='mb-1'>
          <Label className='form-label' for='departmentId'>
            دپارتمان <span className='text-danger'>*</span>
          </Label>
          <Select
            isClearable={false}
            isLoading={isDataLoading}
            value={departmentsOptions.find((option) => option.value === form.departmentId)}
            options={departmentsOptions}
            className='react-select'
            classNamePrefix='select'
            theme={selectThemeColors}
            onChange={handleSelectChange}
          />
        </div>

        <Button className='me-1' color='primary' onClick={handleSubmit} disabled={isLoading || isDataLoading}>
          {isLoading ? 'در حال ارسال...' : 'ایجاد ترم'}
        </Button>
        <Button color='secondary' onClick={handleModal} outline disabled={isLoading}>
          انصراف
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default AddTermModal;