import { Modal, ModalHeader, ModalBody, Button } from "reactstrap";
import useAcceptCoursePayment from "../../../../../@core/Services/Api/Courses/CourseList/AcceptCoursePayment";
import useDeleteCoursePayment from "../../../../../@core/Services/Api/Courses/CourseList/DeleteCoursePayment";

const AcceptPaymentModal = ({
  showModal,
  setShowModal,
  paymentId,
  paymentReceipt,
  refetch,
}) => {
  const { mutate: acceptPayment, isLoading: isAcceptLoading, isPending: AcceptPending } = useAcceptCoursePayment(paymentId, refetch);
  const { mutate: deletePayment, isLoading: isDeleteLoading, isPending: DeletePending } = useDeleteCoursePayment(paymentId, refetch);

  if (paymentId) {
     console.log(paymentId);
  }

  const handleAcceptPayment = (status) => {
    if (status === "accept") {
      acceptPayment();
    } else if (status === "delete") {
      deletePayment();
    }
    setShowModal(false); // مودال بعد از شروع درخواست بسته می‌شه
  };

  return (
    <div className="vertically-centered-modal">
      <Modal
        className="modal-dialog-centered modal-md"
        isOpen={showModal}
        toggle={() => setShowModal(!showModal)}
      >
        <ModalHeader toggle={() => setShowModal(!showModal)}>
          تعیین وضعیت پرداخت
        </ModalHeader>
        <ModalBody>
          <div className="shadow mt-1 mb-4 p-1">
            {paymentReceipt ? (
              <img
                src={paymentReceipt}
                style={{ width: "100%", height: "300px", objectFit: "contain" }}
                alt="payment receipt"
              />
            ) : (
              <h2 className="text-center text-primary">
                رسید پرداخت توسط پرداخت کننده بارگذاری نشده!
              </h2>
            )}
          </div>
          <div className="d-flex gap-3 mb-1 justify-content-center">
            <Button
              color="primary"
              className={paymentReceipt ? "" : "hidden"}
              onClick={() => handleAcceptPayment("accept")}
              disabled={AcceptPending}
            >
              {AcceptPending ? "در حال تأیید..." : "تأیید پرداخت"}
            </Button>
            <Button
              color="danger"
              outline
              onClick={() => handleAcceptPayment("delete")}
              disabled={DeletePending}
            >
              {DeletePending ? "در حال حذف..." : "حذف پرداخت"}
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default AcceptPaymentModal;