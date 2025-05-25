import { useState, useEffect } from 'react';
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
import { useAddSession, useEditSession } from '../../../@core/Services/Api/Sessions/Sessions';

const AddOrEditSessionModal = ({ open, handleModal, scheduleId, session, isEdit = false, refetchSession }) => {
    const [form, setForm] = useState({
        Title: '',
        Describe: '',
    });

    const { mutate: addSession, isLoading: isAdding } = useAddSession();
    const { mutate: updateSession, isLoading: isUpdating } = useEditSession();

    // تنظیم مقادیر اولیه فرم در حالت ویرایش
    useEffect(() => {
        if (isEdit && session) {
            setForm({
                Title: session.sessionTitle || '',
                Describe: session.sessionDescribe || '',
            });
        } else {
            setForm({ Title: '', Describe: '' });
        }
    }, [isEdit, session]);

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
        if (!scheduleId) {
            toast.error('شناسه بازه زمانی نامعتبر است');
            return;
        }
        if (!form.Title.trim()) {
            toast.error('عنوان نمی‌تواند خالی باشد');
            return;
        }
        if (form.Title.trim().length < 5) {
            toast.error('عنوان باید حداقل 5 کاراکتر باشد');
            return;
        }
        if (!form.Describe.trim()) {
            toast.error('توضیحات نمی‌تواند خالی باشد');
            return;
        }
        if (form.Describe.trim().length < 5) {
            toast.error('توضیحات باید حداقل 5 کاراکتر باشد');
            return;
        }

        const payload = {
            scheduleSessionId: scheduleId,
            sessionTitle: form.Title,
            sessionDescribe: form.Describe,
        };

        console.log('داده‌های ارسالی به API:', payload);

        const mutate = isEdit ? updateSession : addSession;

        mutate(isEdit ? { ...payload, sessionId: session?.scheduleSessionId } : payload, {
            onSuccess: (response) => {
                const success = response?.success ?? false;
                const message = response?.message ?? 'پاسخ API نامشخص است';
                if (success) {
                    toast.success(isEdit ? 'جلسه با موفقیت ویرایش شد!' : 'جلسه با موفقیت ایجاد شد!');
                    handleCloseModal();
                    refetchSession();
                } else {
                    toast.error(message || 'پاسخ API موفقیت‌آمیز نبود');
                }
            },
            onError: (error) => {
                console.error('خطای کامل API:', error, error.response);
                let messages = ['خطایی در عملیات رخ داد'];
                const errorData = error.response?.data;

                if (errorData?.ErrorMessage) {
                    if (errorData.ErrorMessage.some((msg) => msg.includes('Violation of PRIMARY KEY constraint'))) {
                        messages = ['جلسه برای این بازه زمانی موجود است، لطفاً بازه زمانی دیگری را انتخاب کنید'];
                    } else {
                        messages = errorData.ErrorMessage;
                    }
                } else if (error.message) {
                    messages = [error.message];
                }
                toast.error(messages.join(', '));
            },
        });
    };

    return (
        <Modal isOpen={open} toggle={handleCloseModal} className="modal-dialog-centered modal-md">
            <ModalHeader toggle={handleCloseModal}></ModalHeader>
            <ModalBody className="pb-5 px-sm-4 mx-50">
                <h1 className='text-center mb-1'>{isEdit ? 'ویرایش جلسه' : 'ساخت جلسه'}</h1>

                <div className='mb-1'>
                    <Label className='form-label' for='Title'>
                        عنوان
                    </Label>
                    <Input
                        id='Title'
                        name='Title'
                        value={form.Title}
                        onChange={handleChange}
                        placeholder='عنوان جلسه'
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
                    disabled={isAdding || isUpdating}
                    onClick={handleSubmit}
                >
                    {isAdding || isUpdating ? 'در حال ارسال...' : isEdit ? 'ویرایش جلسه' : 'ساخت جلسه'}
                </Button>
                <Button type="button" className="mt-2" color="secondary" outline onClick={handleCloseModal}>
                    انصراف
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default AddOrEditSessionModal;