import { Fragment, useState } from "react";
import emptyImage from '../../assets/images/element/weblogImage.jpg';
import {
  Badge, Button, Card, CardBody, CardImg, Modal, ModalHeader, ModalBody
} from "reactstrap";
import EditForm from '../../view/Forms/EditWeblogDetail/EditForm'; 

import "@styles/react/libs/react-select/_react-select.scss";

const InfoCard = ({ Api1 }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const toggleModal = () => setModalOpen(!modalOpen);

  const mainInfoItems = [
    { label: "نویسنده", value: Api1?.addUserFullName },
    { label: "دسته بندی", value: Api1?.newsCatregoryName },
    { label: "عنوان گوگل", value: Api1?.googleDescribe },
    { label: "تاریخ ایجاد", value: Api1?.insertDate?.slice(0, 10) },
    { label: "تاریخ بروزرسانی", value: Api1?.updateDate?.slice(0, 10) },
    { label: "توضیحات کلی", value: Api1?.describe },
  ];

  return (
    <Fragment>
      <Card>
        <CardBody>
          <div className="user-avatar-section mb-2">
            <div className="d-flex align-items-center flex-column">
              <CardImg
                src={Api1?.currentImageAddress || emptyImage}
                className="img-fluid rounded mb-1"
                style={{ height: "280px", width: "100%" }}
              />
              <div className="d-flex flex-column align-items-center text-center">
                <div className="user-info">
                  <h4 className="fs-2 mb-2">{Api1?.title}</h4>
                  <Badge
                    className="activeWeblog"
                    color={Api1?.active ? "light-primary" : "light-danger"}
                  >
                    {Api1?.active ? "فعال" : "غیرفعال"}
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
                  <span>{item.value || "نامشخص"}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="d-flex justify-content-between pt-2">
            <Button color="primary" className="w-50" onClick={toggleModal}>
              ویرایش
            </Button>
            <Button className="ms-1 w-50" color="danger" outline>
              غیر فعال کردن
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Modal Section */}
      <Modal isOpen={modalOpen} toggle={toggleModal} size="lg" centered>
        <ModalBody>
          <EditForm />
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default InfoCard;
