import { Fragment, useState, useEffect } from 'react';
import emptyImage from '../../assets/images/element/weblogImage.jpg';
import { Badge, Button, Card, CardBody, CardImg, Modal, ModalBody } from 'reactstrap';
import EditForm from '../../view/Forms/EditWeblogDetail/EditForm';

import '@styles/react/libs/react-select/_react-select.scss';
import { EditWeblogDetail } from '../../@core/Services/Api/Weblog&News/EditWeblogDetail';
import { ActiveOrDectiveNews } from '../../@core/Services/Api/Weblog&News/Active&DectiveNews';
import toast from 'react-hot-toast';

const InfoCard = ({ Api1, id }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [weblogData, setWeblogData] = useState(Api1); // state برای نگهداری داده‌های خبر

  const toggleModal = () => setModalOpen(!modalOpen);

  const { mutate } = ActiveOrDectiveNews();

  // بارگذاری داده‌ها از API
  const { refetch } = EditWeblogDetail(id, {
    onSuccess: (data) => {
      setWeblogData(data); // به‌روزرسانی داده‌های خبر
    },
  });

  const mainInfoItems = [
    { label: 'نویسنده', value: weblogData?.addUserFullName },
    { label: 'دسته بندی', value: weblogData?.newsCatregoryName || 'نامشخص' },
    { label: 'عنوان گوگل', value: weblogData?.googleTitle },
    { label: 'کلمه کلیدی', value: weblogData?.keyword },
    { label: 'تاریخ ایجاد', value: weblogData?.insertDate?.slice(0, 10) },
    { label: 'تاریخ بروزرسانی', value: weblogData?.updateDate?.slice(0, 10) },
    { label: 'توضیحات کلی', value: weblogData?.describe },
  ];

  const handleWeblogChange = (updatedData) => {
    // به‌روزرسانی تمام داده‌ها در state
    setWeblogData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleWeblogUpdate = () => {
    refetch(); // بارگذاری مجدد داده‌ها از API
  };

  const handleActiveDevtiveNews = () => {
    const formData = new FormData();
    formData.append('Active', true);
    formData.append('Id', id || '');
    mutate(formData, {
       onSuccess: (data) => {
         toast.success("عملیات انجام شد");
         console.log(data);
       },
       onError: (error) => {
          toast.error("خطا در انجام عملیات")
          console.log(error);
       }
    })
  }

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="user-avatar-section mb-2">
            <div className="d-flex align-items-center flex-column">
              <CardImg
                src={weblogData?.currentImageAddress || emptyImage}
                className="img-fluid rounded mb-1"
                style={{ height: '280px', width: '100%' }}
              />
              <div className="d-flex flex-column align-items-center text-center">
                <div className="user-info">
                  <h4 className="fs-2 mb-2">{weblogData?.title}</h4>
                  <Badge
                    className="activeWeblog"
                    color={weblogData?.active ? 'light-primary' : 'light-danger'}
                  >
                    {weblogData?.active ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className="divider-text fs-2 me-1">جزئیات</div>
            <div className="flex-grow-1" style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}></div>
          </div>
          <div className="info-container">
            <ul className="list-unstyled mt-1">
              {mainInfoItems.map((item, index) => (
                <li key={index} className="mb-75">
                  <span className="fw-bolder me-25 text-primary">{item.label}:</span>
                  <span>{item.value || 'نامشخص'}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="d-flex justify-content-between pt-2">
            <Button color="primary" className="w-50" onClick={toggleModal}>  ویرایش </Button>
            <Button className="ms-1 w-50" color="danger" outline onClick={handleActiveDevtiveNews}> غیر فعال کردن </Button>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" centered>
        <ModalBody>
          <EditForm
            Api1={weblogData}
            id={id}
            onWeblogChange={handleWeblogChange}
            onWeblogUpdate={handleWeblogUpdate}
            onCloseModal={toggleModal} // ارسال تابع toggleModal برای بستن مودال
          />
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default InfoCard;