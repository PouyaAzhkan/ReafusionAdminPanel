import { useState, useEffect, useMemo, Fragment } from "react";
import {
  Modal,
  Button,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Badge,
  CardImg,
} from "reactstrap";
import Slider from "react-slick"; // اضافه کردن اسلایدر
import "slick-carousel/slick/slick.css"; // استایل اسلایدر
import "slick-carousel/slick/slick-theme.css"; // تم اسلایدر
import { getSessionDetail } from "../../../@core/Services/Api/Sessions/Sessions";
import { toast } from 'react-hot-toast';
import AddOrEditSessionModal from "./AddOrEditSessionModal";
import emptyUserImg from "../../../assets/images/emptyImage/userImage.jpg";
import AddSessionFileModal from "./AddSessionFileModal";

const SchedualSessionModal = ({ open, handleModal, schedualData }) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddFileModal, setOpenAddFileModal] = useState(false);

  const schedualId = schedualData?.id;

  const { data, isError, isLoading, refetch } = getSessionDetail(schedualId);

  const handleAddFileModal = () => {
    setOpenAddFileModal(!openAddFileModal);
  };

  const handleAddModal = () => {
    setOpenAddModal(!openAddModal);
  };

  // تعیین وضعیت ویرایش و داده‌های جلسه
  const isEdit = !!data;
  const session = data
    ? {
      id: schedualId,
      sessionTitle: data.sessionTitle,
      sessionDescribe: data.sessionDescribe,
    }
    : null;

  const date = new Date(data?.insertDate);
  const formattedDate = date.toLocaleDateString("fa-IR");
  const formattedTime = date.toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // تنظیمات اسلایدر
  const sliderSettings = {
    dots: true, // نمایش دکمه‌های نقطه‌ای
    infinite: true,
    speed: 500,
    slidesToShow: 1, // تعداد اسلایدها در هر نمایش
    slidesToScroll: 1,
    autoplay: true, // اسلاید خودکار
    autoplaySpeed: 3000, // سرعت خودکار (میلی‌ثانیه)
    arrows: false, // نمایش فلش‌ها
  };

  return (
    <Fragment>
      <Modal isOpen={open} toggle={handleModal} className="modal-dialog-centered modal-md">
        <ModalHeader tag={"h2"} toggle={handleModal}>
          جزئیات جلسه بازه زمانی
        </ModalHeader>
        <ModalBody className="pb-0 px-sm-4 mx-50">
          {isLoading ? (
            <p>در حال بارگذاری...</p>
          ) : isError ? (
            <>
              {toast.error("خطایی رخ داده است")}
              <p>خطا در دریافت اطلاعات</p>
            </>
          ) : data ? (
            <>
              <Row>
                <Col md="12">
                  <Card>
                    {data?.sessionFileDtos && data.sessionFileDtos.length > 0 ? (
                      <Slider {...sliderSettings}>
                        {data.sessionFileDtos.map((file, index) => (
                          <div key={index} style={{ padding: "10px" }}>
                            <CardImg
                              top
                              src={file.fileAddress || emptyUserImg}
                              alt={`فایل ${index + 1}`}
                              style={{ maxHeight: "280px", objectFit: "contain", width: "100%" }}
                            />
                          </div>
                        ))}
                      </Slider>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center border-1 border-secondary rounded-2" style={{ height: "280px" }}>
                        <p className="text-center my-1 text-secondary">هیچ فایلی موجود نیست!</p>
                      </div>
                    )}
                    <CardBody>
                      <CardText>
                        <span className="fw-bolder me-1">وضعیت :</span>
                        <Badge color={data?.forming ? "light-success" : "light-danger"} pill>
                          {data?.forming ? "برگزار شده" : "برگزار نشده"}
                        </Badge>
                      </CardText>
                      <CardTitle className="text-truncate" tag="h3">
                        <span className="fw-bolder me-1">عنوان :</span>
                        <span className="text-primary">{data?.sessionTitle}</span>
                      </CardTitle>
                      <CardText className="text-truncate">
                        <span className="fw-bolder me-1">توضیحات :</span>
                        {data?.sessionDescribe}
                      </CardText>
                      <CardText>
                        <span className="fw-bolder me-1">ساعت برگزاری :</span>
                        {"از ساعت" + " " + data?.schedualStartTime + " تا " + data?.schedualEndTime}
                      </CardText>
                      <CardText>
                        <span className="fw-bolder me-1">تاریخ شروع :</span>
                        {`${formattedDate} ساعت ${formattedTime}`}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <p className="text-center text-primary">جلسه‌ای برای نمایش وجود ندارد</p>
          )}
        </ModalBody>
        <ModalFooter className="justify-content-between">
          <Button
            type="submit"
            className="me-1 mt-2"
            color="primary"
            onClick={handleAddModal}
          >
            {isEdit ? "ویرایش جلسه" : "ایجاد جلسه"}
          </Button>
          {
            data ? (<Button onClick={handleAddFileModal} type="button" className="mt-2" color="warning">
              افزودن فایل
            </Button>) : ""
          }
          {
            data ? (<Button type="button" className="mt-2" color="success">
              تکلیف ها
            </Button>) : ""
          }
          <Button type="button" className="mt-2" color="secondary" outline onClick={handleModal}>
            انصراف
          </Button>
        </ModalFooter>
      </Modal>

      <AddOrEditSessionModal
        open={openAddModal}
        handleModal={handleAddModal}
        scheduleId={schedualId}
        session={session}
        isEdit={isEdit}
        refetchSession={refetch}
      />

      <AddSessionFileModal
        open={openAddFileModal}
        handleModal={handleAddFileModal}
        sessionId={schedualId}
        refetch={refetch}
      />
    </Fragment>
  );
};

export default SchedualSessionModal;