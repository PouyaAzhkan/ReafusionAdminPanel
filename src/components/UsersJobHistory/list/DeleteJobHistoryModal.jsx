import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const DeleteUserModal = ({
    deleteModal,
    setDeleteModal,
    jobHistoryToDelete,
    setJobHistoryToDelete,
    handleConfirmDelete,
    isDeleting,
}) => {
    const handleCancelDelete = () => {
        console.log('Delete cancelled');
        setDeleteModal(false);
        setJobHistoryToDelete(null);
    };

    return (
        <Modal isOpen={deleteModal} toggle={handleCancelDelete} centered>
            <ModalHeader toggle={handleCancelDelete}>تأیید حذف سابقه شغلی</ModalHeader>
            <ModalBody>آیا مطمئن هستید که می‌خواهید سابقه شغلی را حذف کنید؟</ModalBody>
            <ModalFooter>
                <Button
                    color="danger"
                    onClick={handleConfirmDelete}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'در حال حذف...' : 'بله'}
                </Button>
                <Button color="secondary" onClick={handleCancelDelete} outline>
                    خیر
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteUserModal;