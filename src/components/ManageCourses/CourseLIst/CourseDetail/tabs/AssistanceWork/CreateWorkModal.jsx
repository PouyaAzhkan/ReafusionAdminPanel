import {Controller, useForm} from 'react-hook-form'
import { Button, Col, Form, Input, Label,  Modal, ModalBody,  ModalHeader, Row,  Spinner,} from 'reactstrap'
import {useState} from 'react'
import toast from 'react-hot-toast'
import Cleave from 'cleave.js/react'
import { convertGrigorianDateToJalaali3, convertPersianDateToGerigorian, 
         convertPersianDateToGerigorian2 } from '../../../../../../@core/utils/formatter.utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AssistanceTable } from './AssistanceTable'
import { createAssistanceWorks } from '../../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/AddAsisstanceWork'
import { updateAssistanceWorks } from '../../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/EditAssistanceWork'

export function CreateWorkModal({showEdit, setShowEdit, singleUserId}) {
    //
    const queryClient = useQueryClient()
    const [selectedAssistance, setSelectedAssistance] = useState(null)
    // console.log(showEdit.currentAssistanceWork)

    const defaultValues = showEdit.isEdit
        ? {
              worktitle: showEdit.currentAssistanceWork.worktitle || '',
              workDescribe: showEdit.currentAssistanceWork.workDescribe || '',
              workDate:
                  convertGrigorianDateToJalaali3(showEdit.currentAssistanceWork.workDate) || '',
          }
        : null

    const {mutate: createMutate, isPending: createPending} = useMutation({
        mutationFn: createAssistanceWorks,
        onSuccess: data => {
            if (data.success) {
                queryClient.invalidateQueries(['all-assistanceWork-list'])
                toast.success('وظیفه با موفقیت اختصاص یافت')
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
        mutationFn: updateAssistanceWorks,
        onSuccess: data => {
            if (data.success) {
                queryClient.invalidateQueries(['all-assistanceWork-list'])
                toast.success('وظیفه با موفقیت ویرایش شد')
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
        reset,
    } = useForm({
        defaultValues,
    })

    function closeModal() {
        setShowEdit({currentAssistanceWork: null, show: false, isEdit: false})
        reset()
    }

    // console.log(showEdit?.currentAssistanceWork)

    function onSubmit(data) {
        if (
            !selectedAssistance &&
            showEdit.isEdit &&
            !showEdit?.currentAssistanceWork?.assistanceName
        ) {
            toast.error('لطفا دستیار را انتخاب کنید')
        } else {
            data = {
                ...data,
                workDate: convertPersianDateToGerigorian2(data.workDate),
                assistanceId:
                    selectedAssistance?.id || showEdit?.currentAssistanceWork.assistanceId,
            }

            if (showEdit.isEdit) {
                data = {
                    ...data,
                    id: showEdit.currentAssistanceWork.workId,
                }
                // console.log(data)
                updateMutate(data)
            } else {
                // console.log(data)
                createMutate(data)
            }
        }
    }

    const options = {date: true, delimiter: '-', datePattern: ['Y', 'm', 'd']}
    function dateValidation(value) {
        const selectedDate = new Date(convertPersianDateToGerigorian(value))
        return selectedDate >= new Date() || `تاریخ باید بعد از امروز باشد`
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
                <ModalBody className="px-sm-5 mx-50" style={{paddingBottom: 30}}>
                    <h1 className="text-center mb-3 text-primary">
                        {showEdit.isEdit ? 'ویرایش وظیفه' : 'تعیین وظیفه جدید'}
                    </h1>

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md="6" className="mb-1">
                                <Label className="form-label fs-5" for="worktitle">
                                    عنوان کار
                                </Label>
                                <Controller
                                    id="worktitle"
                                    name="worktitle"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'نمی‌تواند خالی باشد',

                                        minLength: {
                                            value: 5,
                                            message: 'حداقل کاراکتر های مجاز ۵ و حداکثر ۹۰ می‌باشد',
                                        },
                                        maxLength: {
                                            value: 90,
                                            message: 'حداقل کاراکتر های مجاز ۵ و حداکثر ۹۰ می‌باشد',
                                        },
                                    }}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            className="text-right text-primary"
                                            invalid={errors.worktitle && true}
                                        />
                                    )}
                                />
                                {errors.worktitle && (
                                    <p
                                        className="text-danger"
                                        style={{fontSize: '12px', marginTop: '4px'}}
                                    >
                                        {errors.worktitle.message}
                                    </p>
                                )}
                            </Col>

                            <Col md="6" className="mb-1">
                                <Label className="form-label fs-5" for="workDate">
                                    تاریخ کار
                                </Label>
                                <Controller
                                    id="workDate"
                                    name="workDate"
                                    control={control}
                                    rules={{
                                        required: 'نمی‌تواند خالی باشد',
                                        validate: dateValidation,
                                    }}
                                    render={({field}) => (
                                        <Cleave
                                            {...field}
                                            className="form-control text-primary"
                                            placeholder="1403-9-15"
                                            options={options}
                                            onChange={e => field.onChange(e.target.value)}
                                            htmlRef={field.ref}
                                        />
                                    )}
                                />
                                {errors.workDate && (
                                    <p
                                        className="text-danger"
                                        style={{fontSize: '12px', marginTop: '4px'}}
                                    >
                                        {errors.workDate.message}
                                    </p>
                                )}
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mb-1">
                                <Label className="form-label fs-5" for="workDescribe">
                                    شرح کار
                                </Label>
                                <Controller
                                    control={control}
                                    id="workDescribe"
                                    name="workDescribe"
                                    rules={{
                                        required: 'نمی‌تواند خالی باشد',
                                        maxLength: {
                                            value: 450,
                                            message: 'حداقل کارکتر های مجاز ۵ و حداکثر ۴۵۰ می‌باشد',
                                        },
                                        minLength: {
                                            value: 5,
                                            message: 'حداقل کارکتر های مجاز ۵ و حداکثر ۴۵۰ می‌باشد',
                                        },
                                    }}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            className='text-primary'
                                            type="textarea"
                                            invalid={errors.workDescribe && true}
                                            name="text"
                                            id="exampleText"
                                            rows="4"
                                        />
                                    )}
                                />
                                {errors.workDescribe && (
                                    <p
                                        className="text-danger"
                                        style={{fontSize: '12px', marginTop: '4px'}}
                                    >
                                        {errors.workDescribe.message}
                                    </p>
                                )}
                            </Col>
                        </Row>

                        {!(singleUserId && showEdit.isEdit) && (
                            <Row className="mt-1 p-0">
                                <Col>
                                    <Label className="mb-1 fs-5">
                                        یک دستیار را انتخاب کنید :{' '}
                                        <span className="text-success">
                                            {selectedAssistance?.assistanceName ||
                                                showEdit?.currentAssistanceWork?.assistanceName ||
                                                ''}
                                        </span>
                                    </Label>
                                    <AssistanceTable
                                        selectable
                                        onSelect={assistance => setSelectedAssistance(assistance)}
                                        singleUserId={singleUserId}
                                    />
                                </Col>
                            </Row>
                        )}

                        <Row>
                            <Col className="text-center mt-4" xs={12}>
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
                                <Button
                                    color="danger"
                                    outline
                                    onClick={() =>
                                        setShowEdit({
                                            currentBuilding: null,
                                            show: false,
                                            isEdit: false,
                                        })
                                    }
                                >
                                    صرف نظر
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </Modal>
        </>
    )
}
