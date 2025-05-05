import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const DeleteUserModal = ({
    deleteModal,
    setDeleteModal,
    userToDelete,
    setUserToDelete,
    handleConfirmDelete,
    isDeleting,
}) => {
    const handleCancelDelete = () => {
        console.log('Delete cancelled');
        setDeleteModal(false);
        setUserToDelete(null);
    };

    return (
        <Modal isOpen={deleteModal} toggle={handleCancelDelete} centered>
            <ModalHeader toggle={handleCancelDelete}>تأیید حذف کاربر</ModalHeader>
            <ModalBody>آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟</ModalBody>
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