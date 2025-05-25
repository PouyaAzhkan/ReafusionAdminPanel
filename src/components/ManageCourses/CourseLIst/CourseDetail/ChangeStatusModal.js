// ** React Imports
import { Fragment, useState } from "react";

// ** Reactstrap Imports
import { Modal, ModalHeader, ModalBody, Button, Spinner } from "reactstrap";

// ** Third Party Components
import Select from "react-select";

// ** Utils
import { selectThemeColors } from "@utils";

import ChangeStatus from "../../../../@core/Services/Api/Courses/CourseDetail/ChangeStatus";
import toast from "react-hot-toast";

const ChangeStatusModal = ({ changeStatusModal, id, toggle, refetch, CreateCourse }) => {
  // مقدار اولیه statusId را به اولین گزینه تنظیم می‌کنیم
  const newStatus = CreateCourse?.map((t) => ({
    value: t.id,
    label: t.statusName,
  }));
  const [statusId, setStatusId] = useState(newStatus?.[0]?.value || null);

  const { mutate, isPending } = ChangeStatus();

  const handleChangeStatus = () => {
    if (!statusId) {
      toast.error("لطفاً یک وضعیت انتخاب کنید.");
      return;
    }

    const formData = new FormData();
    formData.append("CourseId", id);
    formData.append("StatusId", statusId);

    console.log("FormData being sent:", {
      CourseId: id,
      StatusId: statusId,
    });

    mutate(formData, {
      onSuccess: (response) => {
        console.log("Success Response:", response);
        toast.success("وضعیت با موفقیت تغییر کرد");
        toggle();
        refetch();
      },
      onError: (error) => {
        console.error("Error Details:", error.response?.data || error.message);
        toast.error("خطا در تغییر وضعیت");
      },
    });
  };

  const handleSelectChange = (selectedOption) => {
    setStatusId(selectedOption ? selectedOption.value : null);
    console.log("Selected Status ID:", selectedOption ? selectedOption.value : null);
  };

  return (
    <Fragment>
      <div className="vertically-centered-modal">
        <Modal
          className="modal-dialog-centered modal-lg"
          isOpen={changeStatusModal}
          toggle={() => toggle()}
        >
          <ModalHeader toggle={() => toggle()}>
            لطفا وضعیت دوره را انتخاب نمایید
          </ModalHeader>
          <ModalBody>
            <div className="d-flex flex-column gap-1 shadow p-3 mb-5 rounded">
              <Select
                className="react-select rounded-3"
                classNamePrefix="select"
                theme={selectThemeColors} // اضافه کردن تم
                value={newStatus?.find((option) => option.value === statusId)} // مقدار انتخاب‌شده
                options={newStatus || []} // گزینه‌ها
                onChange={handleSelectChange} // مدیریت تغییر
                placeholder="وضعیت را انتخاب کنید..."
              />
              <Button
                onClick={handleChangeStatus}
                style={{ width: "100%" }}
                className="mt-3 mx-auto"
                color="primary"
                disabled={isPending}
              >
                ثبت نهایی {isPending && <Spinner size="sm" color="light" />}
              </Button>
            </div>
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  );
};

export default ChangeStatusModal;