import React, { useEffect } from "react";
import {
  Button, Col, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { EditDepartmentFields } from "../../../../@core/constants/department-manage/EditDepartmentFields";
import GetBuildingList from "../../../../@core/Services/Api/Courses/ManageClass/GetBuildingList";
import EditDepartments from "../../../../@core/Services/Api/Courses/ManageDepartment/EditDepartment";
import GetDepartmantDetail from "../../../../@core/Services/Api/Courses/ManageDepartment/GetDepartmentDetail";

const EditDepartment = ({ id, refetch, isOpen, toggle }) => {
  const { data: buildings, isSuccess: buildingSuccess } = GetBuildingList();
  const { data, isSuccess } = GetDepartmantDetail(id);
  const { mutate } = EditDepartments(refetch, toggle);

  const {
    control,
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      id: "",
      depName: "",
      buildingId: "",
    },
  });

  useEffect(() => {
    if (id && isOpen && isSuccess) {
      reset(EditDepartmentFields(data));
    }
  }, [id, isOpen, isSuccess, reset, data]);

  const onSubmit = (values) => {
    mutate(values);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered modal-base">
      <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
      <ModalBody className="px-sm-5 mx-50 pb-5">
        <div className="text-center mb-2">
          <h1 className="mb-1">ویرایش اطلاعات بخش</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("id")} />
          <Row className="gy-1 pt-75">
            <Col md="12" className="mb-1">
              <Label className="form-label" for="depName">نام بخش</Label>
              <Controller
                name="depName"
                control={control}
                rules={{ required: "نام بخش الزامی است" }}
                render={({ field }) => (
                  <Input {...field} id="depName" placeholder="نام بخش" className="text-primary" invalid={!!errors.depName} />
                )}
              />
              <FormFeedback>{errors.depName?.message}</FormFeedback>
            </Col>

            <Col sm="12" className="mb-1">
              <Label className="form-label" for="buildingId">ساختمان</Label>
              <Controller
                name="buildingId"
                control={control}
                rules={{ required: "ساختمان الزامی است" }}
                render={({ field }) => (
                  <Input {...field} type="select" id="buildingId" className="text-primary" invalid={!!errors.buildingId}>
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

            <Col xs={12} className="d-flex justify-content-center gap-1 mt-2">
              <Button type="submit" color="primary">ذخیره تغییرات</Button>
              <Button type="button" color="danger" outline onClick={() => { toggle(); reset(); }}>
                لغو
              </Button>
            </Col>
          </Row>
        </form>
      </ModalBody>
    </Modal>
  );
};

export default EditDepartment;
