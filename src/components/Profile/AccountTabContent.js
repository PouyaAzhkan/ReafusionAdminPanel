import { Fragment, useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
} from "reactstrap";
import { GetDashboardUserInfo } from "../../@core/Services/Api/UserManage/user";
import emptyUserImg from "../../assets/images/emptyImage/userImage.jpg";
import UserProfileForm from "./UserProfileForm"; // وارد کردن فرم

const AccountTabs = () => {
  const { data, isLoading, error } = GetDashboardUserInfo();

  // ** States
  const [avatar, setAvatar] = useState(emptyUserImg);

  // به‌روزرسانی avatar هنگام تغییر data
  useEffect(() => {
    if (data && !isLoading && !error) {
      setAvatar(data?.currentPictureAddress || emptyUserImg);
    }
  }, [data, isLoading, error]);

  const onChange = (e) => {
    const reader = new FileReader(),
      files = e.target.files;
    reader.onload = function () {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const handleImgReset = () => {
    setAvatar(emptyUserImg);
  };

  return (
    <Fragment>
      {isLoading ? (
        <div>در حال بارگذاری...</div>
      ) : error ? (
        <div>خطا در بارگذاری اطلاعات!</div>
      ) : (
        <Card>
          <CardHeader className="border-bottom">
            <CardTitle tag="h4">جزئیات پروفایل</CardTitle>
          </CardHeader>
          <CardBody className="py-2 my-25">
            <Row>
              <Col sm="12" className="mb-2">
                <div className="d-flex">
                  <div className="me-25">
                    <img
                      className="rounded me-50"
                      src={avatar}
                      alt="User avatar"
                      height="100"
                      width="100"
                      onError={(e) => (e.target.src = emptyUserImg)}
                    />
                  </div>
                  <div className="d-flex align-items-end mt-75 ms-1">
                    <div>
                      <Button
                        tag={Label}
                        className="mb-75 me-75"
                        size="sm"
                        color="primary"
                      >
                        انتخاب عکس
                        <Input
                          type="file"
                          onChange={onChange}
                          hidden
                          accept="image/*"
                        />
                      </Button>
                      <Button
                        className="mb-75"
                        color="secondary"
                        size="sm"
                        outline
                        onClick={handleImgReset}
                      >
                        ریست
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm="12">
                <UserProfileForm userData={data} />
              </Col>
            </Row>
          </CardBody>
        </Card>
      )}
    </Fragment>
  );
};

export default AccountTabs;