import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const DeleteCommentModal = ({
    deleteModal,
    setDeleteModal,
    commentToDelete,
    setCommentToDelete,
    handleConfirmDelete,
    isDeleting,
}) => {
    const handleCancelDelete = () => {
        console.log('Delete cancelled');
        setDeleteModal(false);
        setCommentToDelete(null);
    };

    return (
        <Modal isOpen={deleteModal} toggle={handleCancelDelete} centered>
            <ModalHeader toggle={handleCancelDelete}>تأیید حذف کامنت</ModalHeader>
            <ModalBody>آیا مطمئن هستید که می‌خواهید این کامنت را حذف کنید؟</ModalBody>
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

export default DeleteCommentModal;