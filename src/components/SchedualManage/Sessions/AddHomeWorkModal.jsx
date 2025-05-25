import { useState } from 'react';
import {
    Modal,
    Input,
    Label,
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import toast from 'react-hot-toast';
import { useAddSessionHomeWork } from '../../../@core/Services/Api/HomeWorks/HomeWorks';

const AddHomeWorkModal = ({ open, handleModal, sessionId, refetchHomeWorks }) => {
    const [form, setForm] = useState({
        Title: '',
        Describe: '',
    });

    const { mutate: addHomeWork, isLoading: isAdding } = useAddSessionHomeWork();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // تابع بستن مودال و ریست فرم
    const handleCloseModal = () => {
        setForm({ Title: '', Describe: '' });
        handleModal();
    };

    const handleSubmit = () => {
        if (!sessionId) {
            toast.error('شناسه جلسه نامعتبر است');
            return;
        }
        if (!form.Title.trim()) {
            toast.error('عنوان نمی‌تواند خالی باشد');
            return;
        }
        if (form.Title.trim().length < 40) {
            toast.error('عنوان باید حداقل 40 کاراکتر باشد');
            return;
        }
        if (form.Title.trim().length > 70) {
            toast.error('عنوان باید حداکثر 70 کاراکتر باشد');
            return;
        }
        if (!form.Describe.trim()) {
            toast.error('توضیحات نمی‌تواند خالی باشد');
            return;
        }
        if (form.Describe.trim().length < 5) {
            toast.error('توضیحات باید حداقل 10 کاراکتر باشد');
            return;
        }
        if (form.Describe.trim().length > 500) {
            toast.error('توضیحات باید حداکثر 500 کاراکتر باشد');
            return;
        }

        const payload = {
            sessionId: sessionId,
            hwTitle: form.Title,
            hwDescribe: form.Describe,
        };

        console.log('داده‌های ارسالی به API:', payload);

        addHomeWork(payload, {
            onSuccess: (response) => {
                const success = response?.success ?? false;
                const message = response?.message ?? 'پاسخ API نامشخص است';
                if (success) {
                    toast.success('تکلیف با موفقیت ایجاد شد!');
                    handleCloseModal();
                    refetchHomeWorks();
                } else {
                    toast.error(message || 'پاسخ API موفقیت‌آمیز نبود');
                }
            },
            onError: (error) => {
                console.error('خطای کامل API:', error, error.response);
                toast.error('خطایی در عملیات رخ داد');
            },
        });
    };

    return (
        <Modal isOpen={open} toggle={handleCloseModal} className="modal-dialog-centered modal-md">
            <ModalHeader toggle={handleCloseModal}></ModalHeader>
            <ModalBody className="pb-5 px-sm-4 mx-50">
                <h1 className='text-center mb-1'>ساخت تکلیف برای جلسه</h1>

                <div className='mb-1'>
                    <Label className='form-label' for='Title'>
                        عنوان
                    </Label>
                    <Input
                        id='Title'
                        name='Title'
                        value={form.Title}
                        onChange={handleChange}
                        placeholder='عنوان تکلیف'
                    />
                </div>

                <div className='mb-1'>
                    <Label className='form-label' for='Describe'>
                        توضیحات
                    </Label>
                    <Input
                        id='Describe'
                        name='Describe'
                        value={form.Describe}
                        onChange={handleChange}
                        placeholder='توضیحات'
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    type="submit"
                    className="me-1 mt-2"
                    color="primary"
                    disabled={isAdding}
                    onClick={handleSubmit}
                >
                    ایجاد تکلیف
                </Button>
                <Button type="button" className="mt-2" color="secondary" outline onClick={handleCloseModal}>
                    انصراف
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddHomeWorkModal;