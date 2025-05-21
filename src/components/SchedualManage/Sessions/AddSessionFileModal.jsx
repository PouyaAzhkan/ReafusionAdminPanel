import { Fragment, useState } from "react";
import { Image, Link, FileText, X, DownloadCloud } from "react-feather";
import { useForm, Controller } from 'react-hook-form';
import { selectThemeColors } from '@utils';
import toast from 'react-hot-toast';
import {
  Card, CardHeader, CardTitle, CardBody, Button,
  ListGroup, ListGroupItem, TabContent, TabPane, Nav,
  NavItem, NavLink, Row, Col, Modal, Input, Label,
  ModalBody, ModalHeader
} from 'reactstrap';
import { useAddSessionFile, useAddSessionFileWithUrl } from "../../../@core/Services/Api/Sessions/Sessions";
import { useDropzone } from 'react-dropzone';
import Select from "react-select";

const countryOptions = [
  { value: 'png', label: 'png' },
  { value: 'jpg', label: 'jpg' },
  { value: 'webpg', label: 'webpg' }
];

const AddSessionFileModal = ({ open, handleModal, sessionId, refetch }) => {
  const [active, setActive] = useState('1');
  const { mutate: addSessionFileWithUrl } = useAddSessionFileWithUrl();
  const { mutate: addSessionFile } = useAddSessionFile();

  const toggle = tab => {
    if (active !== tab) setActive(tab);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      fileName: '',
      country: countryOptions[0],
    },
  });

  const onSubmit = (data) => {
    console.log("Submitted Data:", data);

    if (!sessionId) {
      toast.error('شناسه جلسه معتبر نیست!');
      return;
    }

    const params = {
      SessionId: sessionId,
      Url: data.username.trim(),
      FileName: data.fileName.trim(),
      FileFormat: data.country.value,
    };

    console.log("Sending Params:", params);

    addSessionFileWithUrl(params, {
      onSuccess: (response) => {
        toast.success('فایل با موفقیت اضافه شد!');
        handleModal(); // بستن مودال
        if (refetch) refetch(); // به‌روزرسانی داده‌ها
      },
      onError: (error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          errorMessages.forEach(msg => toast.error(msg));
        } else {
          toast.error('خطایی در ارسال رخ داد: ' + (error.message || 'خطای ناشناخته'));
        }
      },
    });
  };

  // file uploader
  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: { 'application/zip': ['.zip'] }, // فقط فایل zip
    onDrop: (acceptedFiles, fileRejections) => {
      if (fileRejections.length > 0) {
        toast.error('فقط فایل‌های zip پشتیبانی می‌شوند!');
        return;
      }

      const newFiles = acceptedFiles.filter(
        (file) => !files.some((existingFile) => existingFile.name === file.name)
      );

      if (newFiles.length === 0) {
        toast.error('این فایل قبلاً انتخاب شده است!');
        return;
      }

      setFiles([...files, ...newFiles.map(file => Object.assign(file))]);
    },
  });

  const renderFilePreview = file => {
    return <FileText size='28' />; // آیکون ثابت برای فایل zip
  };

  const handleRemoveFile = file => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter(i => i.name !== file.name);
    setFiles([...filtered]);
  };

  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center w-75'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div className="w-100">
          <p className='file-name mb-0 text-truncate'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleFileSubmit = () => {
    if (!sessionId) {
      toast.error('شناسه جلسه معتبر نیست!');
      return;
    }

    if (files.length === 0) {
      toast.error('هیچ فایلی انتخاب نشده است!');
      return;
    }

    addSessionFile({ sessionId, files }, {
      onSuccess: (response) => {
        toast.success('فایل با موفقیت آپلود شد!');
        setFiles([]); // پاک کردن فایل‌ها بعد از آپلود موفق
        handleModal(); // بستن مودال
        if (refetch) refetch(); // به‌روزرسانی داده‌ها
      },
      onError: (error) => {
        if (error.response && error.response.data && error.response.data.errors) {
          const errorMessages = Object.values(error.response.data.errors).flat();
          errorMessages.forEach(msg => toast.error(msg));
        } else {
          toast.error('خطایی در آپلود فایل رخ داد: ' + (error.message || 'خطای ناشناخته'));
        }
      },
    });
  };

  return (
    <Fragment>
      <Modal isOpen={open} toggle={handleModal} className="modal-dialog-centered modal-md">
        <ModalHeader tag="h2" toggle={handleModal}>افزودن فایل جلسه</ModalHeader>
        <ModalBody className="pb-2 px-sm-4 mx-50">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={active === '1'}
                onClick={() => {
                  toggle('1');
                }}
              >
                <Image size={14} className="me-50" />
                آپلود مستقیم فایل
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={active === '2'}
                onClick={() => {
                  toggle('2');
                }}
              >
                <Link size={14} className="me-50" />
                آدرس فایل (بدون نیاز آپلود)
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="py-50" activeTab={active}>
            <TabPane tabId="1">
              <Card>
                <CardBody>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div className='d-flex align-items-center justify-content-center flex-column'>
                      <DownloadCloud size={64} />
                      <h5>فایل
                        <span className="fw-bold text-danger">{" "}zip.{" "}</span>
                        را اینجا قرار دهید یا کلیک کنید</h5>
                      <p className='text-secondary'>
                        فایل را اینجا قرار دهید یا کلیک کنید برای
                        <a href='/' onClick={e => e.preventDefault()}>
                          {" "}
                          انتخاب
                          {" "}
                        </a>
                        فایل از دستگاه شما
                      </p>
                    </div>
                  </div>
                  {files.length ? (
                    <Fragment>
                      <ListGroup className='my-2'>{fileList}</ListGroup>
                      <div className='d-flex justify-content-between'>
                        <Button color='primary' onClick={handleFileSubmit}>ارسال فایل</Button>
                        <Button className='me-1' color='danger' outline onClick={handleRemoveAllFiles}>
                          پاک کردن همه
                        </Button>
                      </div>
                    </Fragment>
                  ) : null}
                </CardBody>
              </Card>
            </TabPane>
            <TabPane tabId="2">
              <Row tag="form" className="gy-1 pt-75" onSubmit={handleSubmit(onSubmit)}>
                <Col xs={12}>
                  <Label className="form-label" for="username">آدرس فایل</Label>
                  <Controller
                    name="username"
                    control={control}
                    rules={{ required: 'آدرس فایل الزامی است!' }}
                    render={({ field }) => (
                      <Input
                        id="username"
                        placeholder="لینک، url یا هر آدرسی"
                        invalid={!!errors.username}
                        {...field}
                      />
                    )}
                  />
                  {errors.username && <p className="text-danger">{errors.username.message}</p>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className="form-label" for="fileName">نام فایل</Label>
                  <Controller
                    name="fileName"
                    control={control}
                    rules={{ required: 'نام فایل الزامی است!' }}
                    render={({ field }) => (
                      <Input
                        id="fileName"
                        placeholder="نام فایل را وارد کنید"
                        invalid={!!errors.fileName}
                        {...field}
                      />
                    )}
                  />
                  {errors.fileName && <p className="text-danger">{errors.fileName.message}</p>}
                </Col>
                <Col md={12} xs={12}>
                  <Label className="form-label" for="country">فرمت فایل</Label>
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: 'فرمت فایل الزامی است!' }}
                    render={({ field }) => (
                      <Select
                        id="country"
                        isClearable={false}
                        className="react-select"
                        classNamePrefix="select"
                        options={countryOptions}
                        theme={selectThemeColors}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.country && <p className="text-danger">{errors.country.message}</p>}
                </Col>
                <Col xs={12} className="text-center mt-2 pt-50">
                  <Button type="submit" className="me-1 w-100" color="primary">ارسال</Button>
                </Col>
              </Row>
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default AddSessionFileModal;