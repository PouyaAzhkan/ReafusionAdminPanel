import React, { useEffect } from "react";
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import GetClassDetail from "../../../../@core/Services/Api/Courses/ManageClass/GetClassRoomDetail";
import EditClassRoom from "../../../../@core/Services/Api/Courses/ManageClass/EditClass";
import GetBuildingList from "../../../../@core/Services/Api/Courses/ManageClass/GetBuildingList";
import { EditClassFields } from "../../../../@core/constants/class-manage/EditClassFields";
import toast from "react-hot-toast";

const EditClass = ({ id, isOpen, toggle, refetch }) => {
  // واکشی اطلاعات کلاس فقط وقتی id معتبر و مودال باز است
  const {
    data: classDetail,
    isFetching,
    refetch: refetchClass,
  } = GetClassDetail(id, {
    enabled: !!id && isOpen,
  });

  // واکشی ساختمان‌ها
  const { data: buildings, isSuccess: buildingSuccess } = GetBuildingList();

  // تابع ویرایش کلاس
  const { mutate, isPending } = EditClassRoom();

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      classRoomName: "",
      capacity: "",
      buildingId: "",
    },
  });

  // وقتی داده کلاس دریافت شد، فرم را مقداردهی اولیه کن
  useEffect(() => {
    if (classDetail) {
      reset(EditClassFields(classDetail));
    }
  }, [classDetail, reset]);

  // هر بار مودال باز شد داده را دوباره بگیر
  useEffect(() => {
    if (isOpen && id) {
      refetchClass();
    }
  }, [isOpen, id, refetchClass]);

  // وقتی فرم ارسال شد
  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: () => {
        toast.success("ویرایش با موفقیت انجام شد");
        refetch?.();
        toggle();
      },
      onError: () => {
        toast.error("خطا در ویرایش کلاس");
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered modal-base"
    >
      <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <div className="text-center mb-2">
          <h1 className="mb-1">ویرایش اطلاعات کلاس</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* آی‌دی کلاس مخفی */}
          <input type="hidden" {...register("id")} />

          <Row className="gy-1 pt-75">
            <Col md="12" className="mb-1">
              <Label className="form-label" for="classRoomName">
                نام کلاس
              </Label>
              <Controller
                name="classRoomName"
                control={control}
                rules={{ required: "نام کلاس الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="classRoomName"
                    className="text-primary"
                    placeholder="نام کلاس"
                    invalid={!!errors.classRoomName}
                  />
                )}
              />
              <FormFeedback>{errors.classRoomName?.message}</FormFeedback>
            </Col>

            <Col md="12" className="mb-1">
              <Label className="form-label" for="capacity">
                ظرفیت کلاس
              </Label>
              <Controller
                name="capacity"
                control={control}
                rules={{ required: "ظرفیت کلاس الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="capacity"
                    type="number"
                    className="text-primary"
                    placeholder="ظرفیت کلاس"
                    invalid={!!errors.capacity}
                  />
                )}
              />
              <FormFeedback>{errors.capacity?.message}</FormFeedback>
            </Col>

            <Col sm="12" className="mb-1">
              <Label className="form-label" for="buildingId">
                ساختمان
              </Label>
              <Controller
                name="buildingId"
                control={control}
                rules={{ required: "ساختمان الزامی است" }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="select"
                    id="buildingId"
                    className="text-primary"
                    invalid={!!errors.buildingId}
                  >
                    <option value="">انتخاب کنید</option>
                    {buildingSuccess &&
                      buildings.map((building) => (
                        <option key={building.id} value={building.id}>
                          {building.buildingName}
                        </option>
                      ))}
                  </Input>
                )}
              />
              <FormFeedback>{errors.buildingId?.message}</FormFeedback>
            </Col>

            <Col sm="12" className="d-flex justify-content-center gap-1 mt-2">
              <Button color="primary" type="submit" disabled={isPending}>
                ذخیره تغییرات {isPending && <Spinner size="sm" color="light" />}
              </Button>
              <Button
                type="button"
                color="danger"
                outline
                onClick={() => {
                  toggle();
                  reset();
                }}
              >
                لغو
              </Button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default EditClass;
