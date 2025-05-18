import { Modal, ModalHeader, ModalBody } from "reactstrap";

const PaymentReceiptModal = ({
    openPaymentModal,
    setOpenPaymentModal,
    paymentImage,
}) => {
    const toggleModal = () => {
        setOpenPaymentModal(!openPaymentModal);
    };

    return (
        <Modal isOpen={openPaymentModal} toggle={toggleModal} centered>
            <ModalHeader toggle={toggleModal}>رسید پرداختی</ModalHeader>
            <ModalBody className="d-flex justify-content-center align-items-center">
                {paymentImage ? (
                    <img
                        src={paymentImage}
                        alt="رسید پرداختی"
                        className="w-100 h-100"
                        style={{ maxHeight: "300px" }}
                    />
                ) : (
                    <p>تصویر رسید موجود نیست</p>
                )}
            </ModalBody>
        </Modal>
    );
};

export default PaymentReceiptModal;