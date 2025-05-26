import { useState, Fragment } from 'react';
import {
  Modal,
  Input,
  Label,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
} from 'reactstrap';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import toast from 'react-hot-toast';
import { useAddStudentHomeWork } from '../../../@core/Services/Api/StudentHomeWorks/StudentHomeWorks';
import TeacherCourseListModal from './TeacherCourseListModal';
import CourseStudentListModal from './CourseStudentListModal'; // اضافه کردن مودال دانشجو
import { useForm, Controller } from 'react-hook-form';

const AddStudentHomeWorkModal = ({ open, handleModal }) => {
  // مدیریت فرم با react-hook-form
  const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    defaultValues: {
      courseId: '',
      courseName: '',
      groupId: '',
      userId: '', // اضافه کردن userId
      userName: '', // اضافه کردن userName
    },
  });

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false); // حالت برای مودال دانشجو
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const { mutate, isLoading: isAdding } = useAddStudentHomeWork();

  // مدیریت انتخاب دوره
  const handleCourseSelect = (courseId, courseName) => {
    if (!courseId) {
      setError('courseId', { type: 'manual', message: 'دوره معتبر انتخاب نشده است' });
      return;
    }
    setSelectedCourseId(courseId);
    setValue('courseId', courseId, { shouldValidate: true });
    setValue('courseName', courseName, { shouldValidate: true });
    setValue('groupId', '', { shouldValidate: true });
    setValue('userId', '', { shouldValidate: true }); // ریست کردن دانشجو
    setValue('userName', '', { shouldValidate: true }); // ریست کردن نام دانشجو
    setCourseModalOpen(false);
  };

  // مدیریت انتخاب دانشجو
  const handleStudentSelect = (userId, userName) => {
    if (!userId) {
      setError('userId', { type: 'manual', message: 'دانشجو معتبر انتخاب نشده است' });
      return;
    }
    setValue('userId', userId, { shouldValidate: true });
    setValue('userName', userName, { shouldValidate: true });
    setStudentModalOpen(false);
  };

  // مدیریت ارسال فرم
  const onSubmit = (data) => {
    if (!data.courseId) {
      toast.error('لطفاً یک دوره انتخاب کنید');
      return;
    }
    if (!data.userId) {
      toast.error('لطفاً یک دانشجو انتخاب کنید');
      return;
    }
    mutate(data, {
      onSuccess: () => {
        toast.success('تکلیف با موفقیت ثبت شد');
        handleModal();
      },
      onError: () => {
        toast.error('خطایی در ثبت تکلیف رخ داد');
      },
    });
  };

  // مدیریت بستن مودال
  const handleCloseModal = () => {
    handleModal();
  };

  return (
    <Fragment>
      <Modal isOpen={open} toggle={handleCloseModal} className="modal-dialog-centered modal-md">
        <ModalHeader toggle={handleCloseModal}>تکلیف دادن به دانشجو</ModalHeader>
        <ModalBody className="pb-5 px-sm-4 mx-50">
          <h1 className="text-center mb-1">تکلیف دادن به دانشجو</h1>
          <Row>
            <Col xs={12} md={6}>
              <Label className="form-label" for="courseId">
                انتخاب دوره
              </Label>
              <Controller
                name="courseName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="courseId"
                    placeholder="دوره"
                    readOnly
                    onClick={() => setCourseModalOpen(true)}
                    invalid={!!errors.courseId}
                  />
                )}
              />
              {errors.courseId && (
                <div className="text-danger mt-1">{errors.courseId.message}</div>
              )}
              <Controller
                name="courseId"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
            </Col>
            <Col xs={12} md={6}>
              <Label className="form-label" for="userId">
                انتخاب دانشجو
              </Label>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="userId"
                    placeholder="دانشجو"
                    readOnly
                    onClick={() => selectedCourseId && setStudentModalOpen(true)} // فقط اگر دوره انتخاب شده باشد
                    invalid={!!errors.userId}
                    disabled={!selectedCourseId} // غیرفعال تا وقتی دوره انتخاب نشده
                  />
                )}
              />
              {errors.userId && (
                <div className="text-danger mt-1">{errors.userId.message}</div>
              )}
              <Controller
                name="userId"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            className="me-1 mt-2"
            color="primary"
            disabled={isAdding}
            onClick={handleSubmit(onSubmit)}
          >
            {isAdding ? 'در حال ثبت...' : 'ایجاد جلسه'}
          </Button>
          <Button type="button" className="mt-2" color="secondary" outline onClick={handleCloseModal}>
            انصراف
          </Button>
        </ModalFooter>
      </Modal>

      <TeacherCourseListModal
        isOpen={courseModalOpen}
        toggle={() => setCourseModalOpen(false)}
        onSelectCourse={handleCourseSelect}
      />

      <CourseStudentListModal
        isOpen={studentModalOpen}
        toggle={() => setStudentModalOpen(false)}
        onSelectUser={handleStudentSelect}
        selectedUserId={control._formValues.userId}
        courseId={selectedCourseId} // ارسال courseId به مودال دانشجو
      />
    </Fragment>
  );
};

export default AddStudentHomeWorkModal;