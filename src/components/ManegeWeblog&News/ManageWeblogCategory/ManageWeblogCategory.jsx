import React, { useState, useEffect } from 'react';
import StatsHorizontal from '../../../@core/components/statistics-card/StatsHorizontal';
import { Book, Camera } from 'react-feather';
import { Button, Input, Modal, ModalHeader, ModalBody, ModalFooter, Label, Col, Spinner } from 'reactstrap';
import Select from 'react-select';
import '../../../assets/scss/PanelStayle/ManageWeblogs.scss';
import '../../../assets/scss/PanelResponsive/WeblogAndNewsList.scss';
import CategoryList from '../../../view/tableBasic/CategoryList';
import GetCategoryList from '../../../@core/Services/Api/Weblog&News/GetCategoryList';
import CreateCategory from './CreateCategory';
import { AddCategory } from '../../../@core/Services/Api/Weblog&News/AddCategory';
import toast from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ManageWeblogCategory = () => {
  const { data, isLoading, error, refetch } = GetCategoryList();

  const [searchValue, setSearchValue] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(24);
  const [filteredData, setFilteredData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [categoryData, setCategoryData] = useState({});
  const { mutate, isPending } = AddCategory();

  useEffect(() => {
    if (data) {
      const filtered = searchValue
        ? data.filter((item) =>
            item.categoryName.toLowerCase().includes(searchValue.toLowerCase())
          )
        : data;
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [searchValue, data]);

  const toggleModal = () => setModalOpen(!modalOpen);

  const handleSearchChange = (e) => setSearchValue(e.target.value);

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("CategoryName", categoryData.title);
    formData.append("GoogleTitle", categoryData.googleTitle);
    formData.append("GoogleDescribe", categoryData.googleDescribe);
    if (imageFile) formData.append("Image", imageFile);

    mutate(formData, {
      onSuccess: (data) => {
        toast.success("دسته بندی با موفقیت اضافه شد");
        refetch();
        console.log(data);
        console.log('اطلاعات دسته بندی:', formData);
        toggleModal();
      },
      onError: (error) => {
        toast.error("خطا در افزودن دسته بندی");
        console.log(error);
      },
    });
  };

  // نمایش اسکلتون در حالت لودینگ
  if (isLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="categorycontaner d-flex justify-content-between gap-2">
          <div className="WeblogAndNewsInfo2">
            {/* اسکلتون برای کارت آماری */}
            <div className="stats-horizontal mb-2">
              <Skeleton 
                height={120} 
                width={250} 
                borderRadius={8} 
                className="shadow-sm"
              />
            </div>
            {/* اسکلتون برای دکمه افزودن دسته‌بندی */}
            <Skeleton 
              height={40} 
              width={250} 
              borderRadius={6} 
              className="btn-next"
            />
          </div>
          <div className="CategoryList w-75 w-100-xl">
            <div className="d-flex justify-content-between flex-wrap gap-1 align-items-center mb-2">
              <div className="d-flex gap-1 align-items-center">
                {/* اسکلتون برای متن "نمایش" و انتخاب تعداد ردیف‌ها */}
                <Skeleton width={60} height={38} borderRadius={6} />
                <Skeleton width={100} height={38} borderRadius={6} className="select1" />
              </div>
              {/* اسکلتون برای ورودی جستجو */}
              <Skeleton width={200} height={38} borderRadius={6} />
            </div>
            <div className="mt-1">
              {/* اسکلتون برای ردیف‌های جدول */}
              <Skeleton 
                width={1200}
                height={50} 
                count={Math.min(rowsPerPage, 20)} 
                borderRadius={6} 
                style={{ marginBottom: '8px' }} 
                className="shadow-sm"
              />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (error) return <p>خطا در بارگذاری: {error.message}</p>;

  return (
    <div className="categorycontaner d-flex justify-content-between gap-2">
      <div className="WeblogAndNewsInfo2">
        <StatsHorizontal
          icon={<Book size={21} />}
          color="primary"
          stats={filteredData.length}
          statTitle="مجموع دسته‌بندی‌ها"
        />
        <Button color="primary" className="btn-next w-100" onClick={toggleModal}>
          <span className="align-middle">افزودن دسته‌بندی</span>
        </Button>
      </div>
      <div className="CategoryList w-75 w-100-xl">
        <div className="d-flex justify-content-between flex-wrap gap-1 align-items-center">
          <div className="d-flex gap-1 align-items-center">
            نمایش
            <Select
              className="select1"
              classNamePrefix="select"
              value={{ value: rowsPerPage, label: rowsPerPage }}
              onChange={(selectCountPage) => setRowsPerPage(selectCountPage.value)}
              options={[
                { value: 24, label: 24 },
                { value: 12, label: 12 },
                { value: 6, label: 6 },
              ]}
            />
          </div>
          <Input
            className="text-primary w-25"
            type="text"
            placeholder="جستجو..."
            value={searchValue}
            onChange={handleSearchChange}
          />
        </div>
        <div className="mt-1">
          <CategoryList refetch={refetch} data={filteredData} rowsPerPage={rowsPerPage} isLoading={isLoading} />
        </div>
      </div>
      <Modal isOpen={modalOpen} toggle={toggleModal} className="modal-dialog-centered modal-lg">
        <ModalHeader toggle={toggleModal}>افزودن دسته‌بندی جدید</ModalHeader>
        <ModalBody className="d-flex gap-2">
          <div className="w-50">
            <CreateCategory onDataChange={(data) => setCategoryData(data)} />
          </div>
          <div className="w-50">
            <Col md="6" className="mb-1" style={{ width: "100%", height: "250px", position: "relative" }}>
              <img className="w-100 h-100 rounded-4" src={imageSrc || ''} alt="category" />
              <Label
                for="Image"
                style={{
                  border: "1px solid #ccc",
                  width: "80px",
                  height: "80px",
                  borderRadius: "100%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  zIndex: "10",
                  transform: "translate(-50%, -50%)",
                  cursor: "pointer",
                }}
                className="d-flex align-items-center justify-content-center"
              >
                <Camera />
                <input
                  type="file"
                  accept="image/*"
                  id="Image"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setImageSrc(URL.createObjectURL(file));
                      setImageFile(file);
                    }
                  }}
                />
              </Label>
            </Col>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit} disabled={isPending}>
            ثبت دسته‌بندی
            {isPending && <Spinner size="sm" color="light" />}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ManageWeblogCategory;