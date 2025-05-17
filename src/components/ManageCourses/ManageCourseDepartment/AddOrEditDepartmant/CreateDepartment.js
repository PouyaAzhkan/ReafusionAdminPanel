import { useForm, Controller } from "react-hook-form";
import { Button, Col,FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, } from "reactstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import {DepartmentValidations} from "../../../../@core/utils/Validation";
import GetBuildingList from "../../../../@core/Services/Api/Courses/ManageClass/GetBuildingList";
import AddDepartment from "../../../../@core/Services/Api/Courses/ManageDepartment/AddDepartment";

const CreateDepartment = ({ refetch, isOpen, toggle }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      depName: "",
      buildingId: "",
    },
    resolver: yupResolver(DepartmentValidations),
  });

  const { data: buildings, isSuccess: buildingSuccess } = GetBuildingList();

  const { mutate } = AddDepartment();

  const onSubmit = (values) => {
    mutate(values, {
      onSuccess: () => {
         refetch();
         toggle();
      }
    });

  };

  useEffect(() => {
    if (isOpen) {
      reset({
        depName: "",
        buildingId: "",
      });
    }
  }, [isOpen, reset]);

  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      className="modal-dialog-centered modal-base"
    >
      <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <div className="text-center mb-2">
          <h1 className="mb-1">ایجاد بخش جدید</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className="gy-1 pt-75">
            <Col md="12" className="mb-1">
              <Label className="form-label" for="depName">
                نام بخش
              </Label>
              <Controller
                name="depName"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="depName"
                    className="text-primary"
                    placeholder="نام بخش"
                    invalid={!!errors.depName}
                  />
                )}
              />
              <FormFeedback>{errors.depName?.message}</FormFeedback>
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

            <Col xs={12} className="text-center mt-2 pt-50">
              <Button type="submit" className="me-1" color="primary">
                ساختن
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

export default CreateDepartment;
