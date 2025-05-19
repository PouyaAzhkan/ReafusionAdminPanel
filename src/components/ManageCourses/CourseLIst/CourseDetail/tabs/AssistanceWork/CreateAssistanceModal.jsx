import {Controller, useForm} from 'react-hook-form'
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    Row,
    Spinner,
} from 'reactstrap'
import {useEffect, useState} from 'react'
import toast from 'react-hot-toast'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useSelector} from 'react-redux'
import {SelectAssistaneTabs} from './SelectAssistaneTabs'
import {createAssistance, updateAssistance} from '@core/services/api/assistance'

export function CreateAssistanceModal({showEdit, setShowEdit, singleUser, singleCourse}) {
    //
    const queryClient = useQueryClient()
    const {skin} = useSelector(state => state.layout)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null)

    const defaultValues = showEdit.isEdit
        ? {
              userId: showEdit.currentAssistance.assistanceName || '',
              courseId: showEdit.currentAssistance.courseName || '',
          }
        : null

    const {mutate: createMutate, isPending: createPending} = useMutation({
        mutationFn: createAssistance,
        onSuccess: data => {
            if (data.success) {
                queryClient.invalidateQueries(['all-assistance-list'])
                toast.success('دستیار با موفقیت تعیین شد')
                closeModal()
            } else {
                toast.error(data.message)
            }
        },
        onError: err => {
            const data = JSON.parse(err.message).data
            toast.error(data.ErrorMessage.join(' - '))
        },
    })

    const {mutate: updateMutate, isPending: updatePending} = useMutation({
        mutationFn: updateAssistance,
        onSuccess: data => {
            if (data.success) {
                queryClient.invalidateQueries(['all-assistance-list'])
                toast.success('دستیار با موفقیت ویرایش شد')
                closeModal()
            } else {
                toast.error(data.message)
            }
        },
        onError: err => {
            const data = JSON.parse(err.message).data
            toast.error(data.ErrorMessage.join(' - '))
        },
    })

    const {
        control,
        handleSubmit,
        formState: {errors},
        setValue,
        reset,
    } = useForm({
        defaultValues,
    })

    function closeModal() {
        setShowEdit({currentAssistance: null, show: false, isEdit: false})
        reset()
    }

    useEffect(() => {
        if (singleUser && showEdit.show) {
            console.log(singleUser)
            handleSelecteUser(singleUser)
        }
        if (singleCourse && showEdit) {
            handleSelecteCourse(singleCourse)
        }
    }, [singleUser, showEdit.show])

    function handleSelecteUser(user) {
        console.log('object')
        setSelectedUser(user)
        let selectedUserValue =
            user?.fname || user?.fName
                ? `${user.fname || user.fName} ${user.lname || user.lName}`
                : 'نام نا مشخص'
        selectedUserValue = user?.assistanceName ? user?.assistanceName : selectedUserValue

        setValue('userId', selectedUserValue)
    }
    function handleSelecteCourse(course) {
        setSelectedCourse(course)
        setValue('courseId', course?.title || 'عنوان نا مشخص')
    }

    function onSubmit() {
        if (showEdit.isEdit) {
            const data = {
                courseId: selectedCourse?.courseId || showEdit.currentAssistance.courseId,
                userId: selectedUser?.id || showEdit.currentAssistance.userId,
                id: showEdit.currentAssistance.id,
            }
            // console.log(data)
            updateMutate(data)
        } else {
            const data = {courseId: selectedCourse.courseId, userId: selectedUser.id}
            // console.log(data)
            createMutate(data)
        }
    }

    return (
        <>
            <Modal
                isOpen={showEdit.show}
                toggle={closeModal}
                backdrop="static"
                className="modal-dialog-centered modal-xl"
            >
                <ModalHeader className="bg-transparent " toggle={closeModal}></ModalHeader>
                <ModalBody className="px-sm-5 mx-50">
                    <h1 className="text-center mb-3">
                        {showEdit.isEdit ? 'ویرایش دستیار' : 'تعیین دستیار جدید'}
                    </h1>

                    <Card
                        tag={Form}
                        onSubmit={handleSubmit(onSubmit)}
                        className="p-2"
                        style={{backgroundColor: skin === 'dark' ? 'auto' : '#ddd'}}
                    >
                        <Row className="align-items-center flex-column gap-4 gap-lg-0 justify-content-center flex-lg-row">
                            <Col className="d-flex gap-3 align-items-baseline ">
                                <div className="" style={{width: 175}}>
                                    <Label className="form-label" for="courseId">
                                        نام دوره
                                    </Label>
                                    <Controller
                                        id="courseId"
                                        name="courseId"
                                        defaultValue=""
                                        rules={{required: 'نمی‌تواند خالی باشد'}}
                                        control={control}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                type="text"
                                                readOnly
                                                className="text-right"
                                                placeholder="دوره انتخاب نشده"
                                                id="courseId"
                                                invalid={errors.courseId && true}
                                            />
                                        )}
                                    />
                                    {errors.courseId && (
                                        <p
                                            className="text-danger"
                                            style={{fontSize: '11px', marginTop: '4px'}}
                                        >
                                            {errors.courseId.message}
                                        </p>
                                    )}
                                </div>
                                <div className="" style={{width: 175}}>
                                    <Label className="form-label" for="userId">
                                        نام کاربر
                                    </Label>
                                    <Controller
                                        id="userId"
                                        name="userId"
                                        defaultValue=""
                                        rules={{required: 'نمی‌تواند خالی باشد'}}
                                        control={control}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                type="text"
                                                className="text-right"
                                                id="userId"
                                                placeholder="کاربر انتخاب نشده"
                                                readOnly
                                                invalid={errors.userId && true}
                                            />
                                        )}
                                    />
                                    {errors.userId && (
                                        <p
                                            className="text-danger"
                                            style={{fontSize: '11px', marginTop: '4px'}}
                                        >
                                            {errors.userId.message}
                                        </p>
                                    )}
                                </div>
                            </Col>
                            <Col className="d-flex align-items-center justify-content-lg-end gap-2 ">
                                <Button
                                    type="submit"
                                    className="me-1"
                                    color="primary"
                                    disabled={createPending || updatePending}
                                >
                                    تایید عملیات
                                    {(createPending || updatePending) && (
                                        <Spinner className="ms-1" size="sm" />
                                    )}
                                </Button>
                                <Button color="danger" outline onClick={closeModal}>
                                    صرف نظر
                                </Button>
                            </Col>
                        </Row>
                    </Card>

                    <SelectAssistaneTabs
                        setSelectedCourse={handleSelecteCourse}
                        setSelectedUser={handleSelecteUser}
                        singleUser={singleUser}
                        singleCourse={singleCourse}
                    />
                </ModalBody>
            </Modal>
        </>
    )
}
