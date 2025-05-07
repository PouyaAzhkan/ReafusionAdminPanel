import React from 'react';
import '../../../assets/scss/PanelResponsive/WeblogAndNewsList.scss'
import { Modal, ModalHeader, ModalBody, Card } from 'reactstrap';

const CategoryDetail = ({ isOpen, toggle, category }) => {

  const toPersianDate = (dateStr) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className='modal-dialog-centered modal-lg'>
      <ModalHeader toggle={toggle}>جزئیات دسته بندی</ModalHeader>
      <ModalBody>
        {category ? (
          <div className='categoryDetail d-flex gap-1'>
            <div className='DetailImage' style={{ height: "220px", borderRadius: "10px",  overflow: 'hidden'  }}>
                 <img src={category.image || '../../src/assets/images/element/CourseImage.jpg'} className='w-100 h-100' style={{ objectFit: 'cover' }}/>
            </div>
            <Card className='DetailInfo p-2 text-primary'>
                <p style={{ fontSize: "25px" }}><strong className='text-dark'>عنوان:</strong> {category.categoryName}</p>
                <p style={{ fontSize: "20px" }}><strong className='text-dark'>تاریخ ایجاد:</strong> {toPersianDate(category.insertDate.slice(0, 10))}</p>
                <p style={{ fontSize: "15px" }}><strong className='text-dark'>عنوان گوگل:</strong> {category.googleTitle}</p>
                <p style={{ fontSize: "15px" }}><strong className='text-dark'>توضیحات گوگل:</strong> {category.googleDescribe}</p>
            </Card>
            {/* اطلاعات بیشتر را نیز می‌توانید اضافه کنید */}
          </div>
        ) : (
          <p>اطلاعاتی برای نمایش وجود ندارد.</p>
        )}
      </ModalBody>
    </Modal>
  );
};

export default CategoryDetail;
