import { useForm, Controller } from "react-hook-form";
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
} from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { ClassroomValidations } from "../../../../@core/utils/Validation";
import GetBuildingList from "../../../../@core/Services/Api/Courses/ManageClass/GetBuildingList";
import AddClass from "../../../../@core/Services/Api/Courses/ManageClass/AddClass";
import { useEffect } from "react";

const CreateClass = ({ refetch, isOpen, toggle }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      classRoomName: "",
      capacity: 0,
      buildingId: "",
    },
    resolver: yupResolver(ClassroomValidations), // در صورت نیاز فعالش کن
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        classRoomName: "",
        capacity: 0,
        buildingId: "",
      });
    }
  }, [isOpen, reset]);

  const { data: buildings, isSuccess: buildingSuccess } = GetBuildingList();
  const { mutate } = AddClass();

  const handleAddClass = (value) => {
    const datatoSend = {
      classRoomName: value.classRoomName,
      capacity: Number(value.capacity),
      buildingId: value.buildingId,
    };
    console.log(datatoSend);
    mutate(datatoSend, {
      onSuccess: (data) => {
        console.log(data);
        alert("کلاس با موفقیت اضافه شد");
        refetch?.();
        toggle();
      },
      onError: (error) => {
        console.log(error);
        alert("خطا در افزودن کلاس");
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
          <h1 className="mb-1">اضافه کردن کلاس</h1>
        </div>
        <form onSubmit={handleSubmit(handleAddClass)}>
          <Row className="gy-1 pt-75">
            <Col md="12" className="mb-1">
              <Label className="form-label" for="classRoomName">
                نام کلاس
              </Label>
              <Controller
                name="classRoomName"
                control={control}
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
                      buildings.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.buildingName}
                        </option>
                      ))}
                  </Input>
                )}
              />
              <FormFeedback>{errors.buildingId?.message}</FormFeedback>
            </Col>

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button type="submit" className="me-1" color="primary">
                ثبت کلاس
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

export default CreateClass;
