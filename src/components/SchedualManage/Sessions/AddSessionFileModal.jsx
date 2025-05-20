import { Fragment, useState } from "react";
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { Image, Link } from "react-feather";
import { Row, Col, Modal, Input, Label, Button, ModalBody, ModalHeader } from 'reactstrap';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import { selectThemeColors } from '@utils';
import '@styles/react/libs/react-select/_react-select.scss';
import toast from 'react-hot-toast';
import { useAddSessionFileWithUrl } from "../../../@core/Services/Api/Sessions/Sessions";

const countryOptions = [
  { value: 'png', label: 'png' },
  { value: 'jpg', label: 'jpg' },
  { value: 'webpg', label: 'webpg' }
];

const AddSessionFileModal = ({ open, handleModal, sessionId, refetch }) => {
  const [active, setActive] = useState('1');
  const { mutate: addSessionFileWithUrl } = useAddSessionFileWithUrl();

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
              <p>
                Candy canes donut chupa chups candy canes lemon drops oat cake wafer. Cotton candy candy canes marzipan
                carrot cake. Sesame snaps lemon drops candy marzipan donut brownie tootsie roll. Icing croissant bonbon
                biscuit gummi bears. Pudding candy canes sugar plum cookie chocolate cake powder croissant.
              </p>
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