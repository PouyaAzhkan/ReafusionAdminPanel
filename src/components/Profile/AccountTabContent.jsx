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
import UserProfileForm from "./UserProfileForm";
import { GetDashboardUserInfo, useAddProfileImage, useDeleteProfileImage, useSelectProfileImage } from "../../@core/Services/Api/AdminInfo/AdminInfo";
import { Camera, Trash } from "react-feather";
import toast from "react-hot-toast";

const AccountTabs = () => {
  const { data, isLoading, error, refetch } = GetDashboardUserInfo();
  const { mutate: addImg } = useAddProfileImage();
  const { mutate: selectImg } = useSelectProfileImage();
  const { mutate: deleteImg } = useDeleteProfileImage();

  // ** States
  const [avatar, setAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (data && !isLoading && !error) {
      setAvatar(data?.currentPictureAddress);
    }
  }, [data, isLoading, error]);

  const onChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = function () {
        setAvatar(reader.result); // پیش‌نمایش تصویر
      };
      reader.readAsDataURL(files[0]);
      setSelectedFile(files[0]); // ذخیره فایل برای ارسال به API
    }
  };

  // handle add image
  const handleAddImage = () => {
    if (!selectedFile) {
      toast.error("لطفاً ابتدا یک تصویر انتخاب کنید!", {
        position: "top-right",
      });
      return;
    }

    addImg(selectedFile, {
      onSuccess: (data) => {

        const responseData = data?.data || data;
        const isSuccess = responseData?.success === true;
        const message = responseData?.message || (isSuccess ? "تصویر با موفقیت بارگذاری شد!" : "خطایی در پردازش پاسخ رخ داده است!");

        toast[isSuccess ? "success" : "error"](message, {
          position: "top-right",
        });

        refetch();
      },
      onError: (error) => {
        toast.error(error.message || "خطایی در ارتباط با سرور رخ داده است!", {
          position: "top-right",
        });
      },
      onSettled: () => {
        if (data?.currentPictureAddress && data.currentPictureAddress !== "Not-set") {
          setAvatar(data.currentPictureAddress);
        }
      },
    });
  };

  // handle delete image
  const handleDeleteImage = (imgId) => {
    deleteImg(imgId, {
      onSuccess: (data) => {

        // مدیریت پاسخ‌های احتمالی
        const responseData = data?.data || data || {};
        const isSuccess = responseData?.success === true || responseData?.status === 200; // چک چندگانه برای موفقیت
        const message = responseData?.message || (isSuccess ? "تصویر با موفقیت حذف شد!" : "خطایی در پردازش پاسخ رخ داده است!");

        toast[isSuccess ? "success" : "error"](message, {
          position: "top-right",
        });

        refetch();
        if (data?.currentPictureAddress === data?.userImage?.find((img) => img.id === imgId)?.puctureAddress) {
          setAvatar(emptyUserImg);
        }
      },
      onError: (error) => {
        toast.error(error.message || "خطایی در ارتباط با سرور رخ داده است!", {
          position: "top-right",
        });
      },
    });
  };

  // handle select image
  const handleSelectImg = (imgId) => {
    if (!imgId) {
      toast.error("شناسه تصویر معتبر نیست!", {
        position: "top-right",
      });
      return;
    }

    selectImg(imgId, {
      onSuccess: (data) => {
        const responseData = data?.data || data;
        // شرط موفقیت را ساده‌تر می‌کنیم و فرض می‌کنیم اگر پاسخ بدون خطاست، موفقیت‌آمیزه
        const isSuccess = !responseData?.ErrorType && !responseData?.ErrorMessage;
        const message = responseData?.message || (isSuccess ? "تصویر با موفقیت انتخاب شد!" : responseData?.ErrorMessage?.[0] || "خطایی در انتخاب تصویر رخ داده است!");

        toast[isSuccess ? "success" : "error"](message, {
          position: "top-right",
        });

        // به‌روزرسانی تصویر انتخاب‌شده در پیش‌نمایش
        if (isSuccess) {
          const selectedImage = data?.userImage?.find((img) => img.id === imgId)?.puctureAddress;
          if (selectedImage) {
            setAvatar(selectedImage);
          }
          refetch();
        }
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.ErrorMessage?.[0] || error.message || "تصویر یافت نشد یا خطایی در ارتباط با سرور رخ داده است!";
        toast.error(errorMessage, {
          position: "top-right",
        });
      },
    });
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
                <div className="d-flex gap-1">
                  {/* main image */}
                  <div className="d-flex flex-column gap-1 position-relative">
                    <img
                      className="rounded bg-body-secondary"
                      src={avatar}
                      alt=""
                      height="200"
                      width="200"
                    />
                    <Button
                      className="mb-0 p-0 position-absolute top-0 rounded-circle d-flex justify-content-center align-items-center text-secondary"
                      tag={Label}
                      color="light"
                      style={{ width: "50px", height: "50px", margin: "40%" }}
                    >
                      <Camera size={25} />
                      <Input
                        type="file"
                        onChange={onChange}
                        hidden
                        accept="image/*"
                      />
                    </Button>

                    <Button
                      className="mb-0"
                      tag={Label}
                      size="sm"
                      color="primary"
                      onClick={handleAddImage}
                    >
                      افزودن عکس
                    </Button>
                  </div>
                  {/* main image end */}
                  {/* gallery */}
                  <div className="d-flex gap-1" style={{ height: "fit-content" }}>
                    {data?.userImage?.map((img) => (
                      <div
                        key={img?.id}
                        className="position-relative"
                        style={{ height: "fit-content" }}
                      >
                        <img
                          className="rounded"
                          src={img?.puctureAddress}
                          alt="User avatar"
                          height="100"
                          width="100"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleSelectImg(img?.id)}
                        />
                        <span
                          className="position-absolute top-0 start-0 rounded-circle bg-light d-flex justify-content-center align-items-center"
                          style={{ width: "30px", height: "30px", margin: "5px", cursor: "pointer" }}
                          onClick={() => handleDeleteImage(img?.id)}
                        >
                          <Trash size={18} />
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* gallery end */}
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