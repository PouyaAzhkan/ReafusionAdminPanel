import { Fragment, useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { ChevronDown, FileText, Archive, MoreVertical } from 'react-feather';
import { useTranslation } from 'react-i18next';
import DataTable from 'react-data-table-component';
import {
  Card,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import CategoryDetail from '../../components/ManegeWeblog&News/ManageWeblogCategory/CategoryDetail';
import EditCategory from '../../components/ManegeWeblog&News/ManageWeblogCategory/EditCategory';

const CategoryList = ({ data, rowsPerPage, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const { t } = useTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toggleModal = () => setModalOpen(!modalOpen);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);

  const toggleEditModal = () => setEditModalOpen(!editModalOpen);

  const handleEditCategory = (row) => {
    setEditCategory(row);
    setEditModalOpen(true);
  };

  const handleViewDetails = (row) => {
    setSelectedCategory(row);
    setModalOpen(true);
  };

  const columns = [
    {
      name: 'عکس دسته بندی',
      cell: (row) => (
        <img
          src={row.image || '../../src/assets/images/element/CourseImage.jpg'}
          height="40"
          width="40"
          style={{ borderRadius: '10%', objectFit: 'cover' }}
        />
      ),
    },
    {
      name: 'عنوان دسته بندی',
      sortable: true,
      minWidth: '150px',
      selector: (row) => row.categoryName,
    },
    {
      name: 'عنوان گوگل',
      sortable: true,
      minWidth: '400px',
      selector: (row) => row.googleTitle,
    },
    {
      name: 'موارد دیگر',
      allowOverflow: true,
      cell: (row) => (
        <UncontrolledDropdown>
          <DropdownToggle
            tag="span"
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              boxShadow: 'none',
              padding: 0,
              margin: 0,
              width: 'auto',
              height: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MoreVertical size={15} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem className="w-100 d-flex gap-1" onClick={() => handleViewDetails(row)}>
              <span className="align-middle ms-50">جزئیات</span>
              <FileText size={15} />
            </DropdownItem>
            <DropdownItem className="w-100 d-flex gap-1" onClick={() => handleEditCategory(row)}>
              <span className="align-middle ms-50">ویرایش</span>
              <Archive size={15} />
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      ),
    },
  ];

  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  const pageCount = Math.ceil(data.length / rowsPerPage);
  const paginatedData = data.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  useEffect(() => {
    setCurrentPage(0);
  }, [rowsPerPage, data]);

  const Previous = () => <Fragment>{t('قبلی')}</Fragment>;
  const Next = () => <Fragment>{t('بعدی')}</Fragment>;

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={<Previous />}
      nextLabel={<Next />}
      forcePage={currentPage}
      onPageChange={handlePagination}
      pageCount={pageCount}
      breakLabel={'...'}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName={'active'}
      pageClassName={'page-item'}
      nextLinkClassName={'page-link'}
      nextClassName={'page-item next'}
      previousClassName={'page-item prev'}
      previousLinkClassName={'page-link'}
      pageLinkClassName={'page-link'}
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName="pagination react-paginate pagination-sm justify-content-end pe-1 mt-1"
    />
  );

  if (isLoading) {
    return <Card className="p-2">در حال بارگذاری...</Card>;
  }

  if (!isLoading && (!data || data.length === 0)) {
    return <Card className="p-2">داده‌ای برای نمایش وجود ندارد.</Card>;
  }

  return (
    <div>
      <DataTable
        pagination
        selectableRowsNoSelectAll
        columns={columns}
        className="react-dataTable"
        paginationPerPage={rowsPerPage}
        sortIcon={<ChevronDown size={10} />}
        paginationDefaultPage={currentPage + 1}
        paginationComponent={CustomPagination}
        data={paginatedData}
      />
      <CategoryDetail
        isOpen={modalOpen}
        toggle={toggleModal}
        category={selectedCategory}
      />
      <EditCategory
        isOpen={editModalOpen}
        toggle={toggleEditModal}
        category={editCategory}
      />
    </div>
  );
};

export default CategoryList;
