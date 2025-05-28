import { useForm } from "react-hook-form";
import { Button, Modal, ModalHeader, ModalBody, Spinner } from "reactstrap";

const ModalBasic = ({
  centeredModal,
  setCenteredModal,
  groupData,
  changeReserve,
  toggleTab,
  isPending,
}) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    changeReserve(data.CourseId);
    setCenteredModal(false);
  };

  return (
    <div className="vertically-centered-modal">
      <Modal
        className="modal-dialog-centered"
        isOpen={centeredModal}
        toggle={() => setCenteredModal(!centeredModal)}
      >
        {groupData?.length > 0 ? (
          <>
            <ModalHeader className="text-ptimary" toggle={() => setCenteredModal(!centeredModal)}>
              لطفا گروه را انتخاب نمایید
            </ModalHeader>
            <ModalBody>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="d-flex flex-column gap-1 shadow p-3 mb-5 bg-body rounded"
              >
                <select
                  {...register("CourseId", { required: true })}
                  className="relative border-b w-[100%] pr-12 p-1 text-primary shadow-md focus:outline-none focus:ring focus:ring-textCol3"
                >
                  <option value="">انتخاب گروه</option>
                  {groupData.map((item, index) => (
                    <option key={index} value={item.groupId}>
                      {item.groupName}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" type="submit" disabled={isPending}>
                  ثبت گروه {isPending && <Spinner size="sm" color="light" />}
                </button>
              </form>
            </ModalBody>
          </>
        ) : (
          <>
            <ModalHeader toggle={() => setCenteredModal(!centeredModal)} />
            <ModalBody>
              <div className="text-center d-flex flex-column">
                <h4 className="text-center pb-2">
                  برای این دوره هیج گروهی ثبت نشده است
                </h4>
                <span className="text-center">
                  برای تایید کاربر باید کاربر را به گروهی اضافه کنید
                </span>
                <span className="text-center">
                  لطفا ابتدا برای این دوره گروه بسازید
                </span>
                <span className="mt-2">
                  <Button
                    className="px-2 py-1 text-right"
                    color="primary"
                    onClick={() => {
                      setCenteredModal(false);
                      toggleTab("4");
                    }}
                  >
                    افزودن گروه
                  </Button>
                </span>
              </div>
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ModalBasic;
