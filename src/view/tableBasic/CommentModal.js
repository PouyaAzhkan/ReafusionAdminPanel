import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap'
import ReplyTable from './ReplyTable'
import { GetReplyComment } from '../../@core/Services/Api/Weblog&News/GetReplyComment'

const CommentModal = ({ isOpen, toggle, comment }) => {
  if (!comment) return null

  // استفاده از GetReplyComment برای گرفتن پاسخ‌ها
  const { data, isLoading, error } = GetReplyComment(comment.id)

  return (
    <Modal isOpen={isOpen} toggle={toggle} className='modal-dialog-centered modal-lg'>
      <ModalBody>
        {isLoading ? (
          <p>در حال بارگذاری...</p>
        ) : error ? (
          <p>خطا در بارگذاری داده‌ها!</p>
        ) : data?.length > 0 ? (
          <ReplyTable replies={data} />
        ) : (
          <p>هیچ پاسخی وجود ندارد.</p>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}>بستن</Button>
      </ModalFooter>
    </Modal>
  )
}

export default CommentModal