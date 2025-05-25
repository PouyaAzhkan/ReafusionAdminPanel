import { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Row, Col, Card, Input, Label, CardBody, CardTitle, CardHeader, Spinner, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from "reactstrap";
import { getAdminFavoriteNewsList } from "../../@core/Services/Api/AdminInfo/AdminInfo";
import { ChevronDown, MoreVertical, Trash2 } from "react-feather";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Avatar from '@components/avatar';
import { toast } from 'react-hot-toast';
import emptyImg from "../../assets/images/emptyImage/weblogImage.jpg";
import { useDeleteAdminFavoriteNews } from './../../@core/Services/Api/AdminInfo/AdminInfo';

const CustomHeader = ({
  handlePerPage,
  rowsPerPage,
  handleSearch,
  searchQuery,
}) => {
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75">
      <Row>
        <Col xl="6" className="d-flex align-items-center p-0">
          <div className="d-flex align-items-center w-100">
            <Label htmlFor="rows-per-page">تعداد ردیف</Label>
            <Input
              className="mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "5rem" }}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </Input>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <Input
              id="search-invoice"
              className="ms-50 w-100"
              type="text"
              placeholder="جستجو..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

// ** Table Columns
const columns = (handleDeleteNews, isDeleting) => [
  {
    name: "عنوان خبر",
    width: "300px",
    cell: (row) => (
      <Link className="d-flex align-items-center w-100" to={`/WeblogAndNewsList/${row?.newsId}`}>
        <Avatar className="me-1" img={row?.currentImageAddressTumb || emptyImg} alt="" imgWidth="32" />
        <span className="fw-bolder text-truncate">{row?.title || "عنوان ندارد"}</span>
      </Link>
    ),
  },
  {
    name: "تعداد رای",
    width: "120px",
    cell: (row) => <span className="text-truncate">{row?.currentRate || "0"}</span>,
  },
  {
    name: "بازدید",
    width: "120px",
    cell: (row) => <span className="text-truncate">{row?.currentView || "0"}</span>,
  },
  {
    name: "تعداد لایک",
    width: "120px",
    cell: (row) => <span className="text-truncate">{row?.currentLikeCount || "0"}</span>,
  },
  {
    name: "آخرین بروزرسانی",
    width: "150px",
    cell: (row) => (
      <span>{row?.updateDate ? new Date(row.updateDate).toLocaleDateString("fa-IR") : "-"}</span>
    ),
  },
  {
    name: "عملیات",
    width: "100px",
    cell: (row) => (
      <UncontrolledDropdown className="dropend">
        <DropdownToggle tag="div" className="btn btn-sm">
          <MoreVertical size={14} className="cursor-pointer" />
        </DropdownToggle>
        <DropdownMenu container="body">
          <DropdownItem
            tag="button"
            className="w-100"
            onClick={() => handleDeleteNews(row?.favoriteId)}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" className="me-50" /> : <Trash2 size={14} className="me-50" />}
            <span className="align-middle">حذف</span>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
    ),
  },
];

const FavoritesNewsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [newsToDelete, setNewsToDelete] = useState(null);

  const { data, isError, isLoading, refetch } = getAdminFavoriteNewsList({ cacheTime: 0 });
  const { mutate: deleteNews, isLoading: isDeleting } = useDeleteAdminFavoriteNews();

  const handleDeleteNews = (favoriteId) => {
    // اضافه کردن تأییدیه حذف
    if (window.confirm("آیا مطمئن هستید که می‌خواهید این خبر را از لیست مورد علاقه حذف کنید؟")) {
      setNewsToDelete(favoriteId);
      deleteNews(favoriteId, {
        onSuccess: () => {
          toast.success("خبر با موفقیت از لیست مورد علاقه حذف شد!");
          setNewsToDelete(null);
          refetch();
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.ErrorMessage?.[0] ||
            "خطای ناشناخته در حذف خبر";
          toast.error(errorMessage);
          setNewsToDelete(null);
        },
      });
    }
  };

  // Debounce برای جستجو
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // فیلتر کردن داده‌ها
  const filteredData = data?.myFavoriteNews?.filter((item) =>
    item?.title?.toLowerCase().includes(debouncedSearch.toLowerCase())
  ) || [];

  // صفحه‌بندی
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePagination = (page) => setCurrentPage(page.selected + 1);

  const handlePerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const handleSearch = (val) => setSearchQuery(val);

  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={"قبلی"}
      nextLabel={"بعدی"}
      activeClassName="active"
      forcePage={currentPage - 1}
      onPageChange={handlePagination}
      pageCount={Math.max(1, Math.ceil(data?.totalCount / rowsPerPage))}
      pageClassName={"page-item"}
      nextLinkClassName={"page-link"}
      nextClassName={"page-item next"}
      previousClassName={"page-item prev"}
      previousLinkClassName={"page-link"}
      pageLinkClassName={"page-link"}
      containerClassName={"pagination react-paginate justify-content-end my-2 pe-1"}
      disabledClassName={"disabled"}
    />
  );

  return (
    <Fragment>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle tag="h4">اخبار مورد علاقه شما</CardTitle>
        </CardHeader>
        <CardBody>
          {isLoading && (
            <div className="text-center">
              <Spinner color="primary" />
              <p>در حال بارگذاری...</p>
            </div>
          )}
          {isError && (
            <div className="text-center text-danger">
              <p>خطایی در بارگذاری داده‌ها رخ داد.</p>
              <Button color="primary" onClick={() => window.location.reload()}>
                تلاش مجدد
              </Button>
            </div>
          )}
          {!isLoading && !isError && (
            <DataTable
              noHeader
              subHeader
              pagination
              responsive
              columns={columns(handleDeleteNews, isDeleting)}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              paginationComponent={CustomPagination}
              data={paginatedData}
              subHeaderComponent={
                <CustomHeader
                  searchQuery={searchQuery}
                  rowsPerPage={rowsPerPage}
                  handleSearch={handleSearch}
                  handlePerPage={handlePerPage}
                />
              }
              noDataComponent={<div className="text-center">هیچ خبری یافت نشد.</div>}
            />
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default FavoritesNewsTab;