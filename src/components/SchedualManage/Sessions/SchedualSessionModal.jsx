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
  ListGroupItem,
  ListGroup,
} from "reactstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getSessionDetail, useDeleteSessionFile } from "../../../@core/Services/Api/Sessions/Sessions";
import { toast } from 'react-hot-toast';
import AddOrEditSessionModal from "./AddOrEditSessionModal";
import AddSessionFileModal from "./AddSessionFileModal";
import { FileText, X } from "react-feather";
import moment from 'moment-jalaali';
import HomeWorksModal from "./HomeWorksModal";

const SchedualSessionModal = ({ open, handleModal, schedualData }) => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddFileModal, setOpenAddFileModal] = useState(false);
  const [openHomeWorksModal, setOpenHomeWorksModal] = useState(false);

  const schedualId = schedualData?.id;

  const { data, isError, isLoading, refetch } = getSessionDetail(schedualId);

  // هوک حذف فایل
  const { mutate: deleteSessionFile, isLoading: isUpdatingSessionFile } = useDeleteSessionFile();

  const handleHomeWorksModal = () => {
    setOpenHomeWorksModal(!openHomeWorksModal);
  };

  const handleAddFileModal = () => {
    setOpenAddFileModal(!openAddFileModal);
  };

  const handleAddModal = () => {
    setOpenAddModal(!openAddModal);
    console.log("the id is :", schedualId);
  };

  // تابع حذف فایل
  const handleDeleteFile = (file) => {
    console.log("file.id:", file); // بررسی مقدار file.id
    deleteSessionFile(file, {
      onSuccess: () => {
        toast.success("درخواست حذف انجام شد ولی مشکل از سمت سرور!");
        refetch();
      },
      onError: (error) => {
        toast.error("خطا در حذف فایل: " + error.message);
      },
    });
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

  // file list
  const renderFilePreview = (file) => {
    return <FileText size='28' />;
  };

  // تنظیم moment-jalaali برای استفاده از تقویم شمسی
  moment.loadPersian({ dialect: 'persian-modern' });

  // تابع برای فرمت تاریخ و ساعت به شمسی
  const formatJalaaliDateTime = (dateString) => {
    const date = moment(dateString);
    const datePart = date.format('jYYYY/jMM/jDD');
    const timePart = date.format('HH:mm:ss');
    return `${datePart} ساعت ${timePart}`;
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
                        {formatJalaaliDateTime(data?.insertDate)}
                      </CardText>

                      <p>فایل های جلسه :</p>
                      {data?.sessionFileDtos && data.sessionFileDtos.length > 0 ? (
                        <ListGroup numbered className="overflow-scroll" style={{ maxHeight: "240px" }}>
                          {data?.sessionFileDtos?.map((file, index) => (
                            <ListGroupItem key={`${file.name}-${index}`} className="d-flex align-items-center justify-content-between">
                              <div className="file-details d-flex align-items-center w-75">
                                <div className="file-preview me-1 text-primary">{renderFilePreview(file)}</div>
                                <div className="w-75">
                                  <p className="file-name mb-0 text-truncate text-primary fw-bold">{file?.fileName}</p>
                                  <p className="file-size mb-0" style={{ fontSize: "12px" }}>
                                    {formatJalaaliDateTime(file?.insertDate)}
                                  </p>
                                </div>
                              </div>
                              <Button
                                color="danger"
                                outline
                                size="sm"
                                className="btn-icon"
                                onClick={() => handleDeleteFile(file?.id)}
                                disabled={isUpdatingSessionFile}
                              >
                                <X size={14} />
                              </Button>
                            </ListGroupItem>
                          ))}
                        </ListGroup>
                      ) : (
                        <div
                          style={{ border: "1px dashed #000", height: "240px" }}
                          className="d-flex justify-content-center align-items-center rounded-2"
                        >
                          <p className="text-center my-1 text-secondary">هیچ فایلی موجود نیست!</p>
                        </div>
                      )}
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
          {data ? (
            <Button onClick={handleAddFileModal} type="button" className="mt-2" color="warning">
              افزودن فایل
            </Button>
          ) : null}
          {data ? (
            <Button onClick={handleHomeWorksModal} type="button" className="mt-2" color="success">
              تکلیف‌ها
            </Button>
          ) : null}
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

      <HomeWorksModal
        open={openHomeWorksModal}
        handleModal={handleHomeWorksModal}
        sessionId={schedualId}
      />
    </Fragment>
  );
};

export default SchedualSessionModal;