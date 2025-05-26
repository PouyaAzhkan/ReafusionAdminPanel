import { useState, useEffect, Fragment } from 'react';
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
import CourseStudentListModal from './CourseStudentListModal';
import { useForm, Controller } from 'react-hook-form';

const AddStudentHomeWorkModal = ({ open, handleModal, hwid }) => {
  const { control, handleSubmit, setValue, setError, formState: { errors } } = useForm({
    defaultValues: {
      courseId: '',
      courseName: '',
      cstudentId: '',
      userName: '',
      hwid: '',
    },
  });

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const { mutate, isLoading: isAdding } = useAddStudentHomeWork();

  // تنظیم hwid هنگام باز شدن مودال
  useEffect(() => {
    if (hwid) {
      setValue('hwid', hwid, { shouldValidate: true });
    }
  }, [hwid, setValue]);

  // مدیریت انتخاب دوره
  const handleCourseSelect = (courseId, courseName) => {
    if (!courseId) {
      setError('courseId', { type: 'manual', message: 'دوره معتبر انتخاب نشده است' });
      return;
    }
    setSelectedCourseId(courseId);
    setValue('courseId', courseId, { shouldValidate: true });
    setValue('courseName', courseName, { shouldValidate: true });
    setValue('cstudentId', '', { shouldValidate: true });
    setValue('userName', '', { shouldValidate: true });
    setCourseModalOpen(false);
  };

  // مدیریت انتخاب دانشجو
  const handleStudentSelect = (cstudentId, userName) => {
    if (!cstudentId) {
      setError('cstudentId', { type: 'manual', message: 'دانشجو معتبر انتخاب نشده است' });
      return;
    }
    setValue('cstudentId', cstudentId, { shouldValidate: true });
    setValue('userName', userName, { shouldValidate: true });
    setStudentModalOpen(false);
  };

  // مدیریت ارسال فرم
  const onSubmit = (data) => {
    if (!data.courseId) {
      toast.error('لطفاً یک دوره انتخاب کنید');
      return;
    }
    if (!data.cstudentId) {
      toast.error('لطفاً یک دانشجو انتخاب کنید');
      return;
    }
    if (!data.hwid) {
      toast.error('شناسه تکلیف نامعتبر است');
      return;
    }
    const payload = {
      hwid: data.hwid,
      cstudentId: data.cstudentId,
    };
    console.log('Payload:', payload); // لاگ برای دیباگ
    mutate(payload, {
      onSuccess: () => {
        toast.success('تکلیف با موفقیت ثبت شد');
        handleModal();
      },
      onError: (error) => {
        console.error('Error:', error.response?.data || error.message);
        const errorMessages = error.response?.data?.ErrorMessage || ['خطایی رخ داد'];
        toast.error(errorMessages.join(' - '));
      },
    });
  };

  return (
    <Fragment>
      <Modal isOpen={open} toggle={handleModal} className="modal-dialog-centered modal-md">
        <ModalHeader toggle={handleModal}>تکلیف دادن به دانشجو</ModalHeader>
        <ModalBody className="pb-5 px-sm-4 mx-50">
          <h1 className="text-center mb-1">تکلیف دادن به دانشجو</h1>
          <Row>
            <Col xs={12}>
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
            <Col xs={12}>
              <Label className="form-label" for="cstudentId">
                انتخاب دانشجو
              </Label>
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="cstudentId"
                    placeholder="دانشجو"
                    readOnly
                    onClick={() => selectedCourseId && setStudentModalOpen(true)}
                    invalid={!!errors.cstudentId}
                    disabled={!selectedCourseId}
                  />
                )}
              />
              {errors.cstudentId && (
                <div className="text-danger mt-1">{errors.cstudentId.message}</div>
              )}
              <Controller
                name="cstudentId"
                control={control}
                render={({ field }) => <input type="hidden" {...field} />}
              />
            </Col>
            <Col xs={12}>
              <Label className="form-label" for="hwid">
                شناسه تکلیف
              </Label>
              <Controller
                name="hwid"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="hwid"
                    placeholder="شناسه تکلیف"
                    disabled
                    invalid={!!errors.hwid}
                  />
                )}
              />
              {errors.hwid && (
                <div className="text-danger mt-1">{errors.hwid.message}</div>
              )}
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
          <Button
            type="button"
            className="mt-2"
            color="secondary"
            outline
            onClick={handleModal}
          >
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
        selectedUserId={control._formValues.cstudentId}
        courseId={selectedCourseId}
      />
    </Fragment>
  );
};

export default AddStudentHomeWorkModal;