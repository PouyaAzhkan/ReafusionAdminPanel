import React, { useState } from 'react';
import Select from 'react-select';
import '../../assets/scss/PanelStayle/ManageWeblogs.scss';
import '../../assets/scss/PanelResponsive/WeblogAndNewsList.scss';
import { Activity, Book, Slash, List, Grid } from 'react-feather';
import StatsHorizontal2 from '../../@core/components/widgets/stats/StatsHorizontal2';
import { GetCount } from '../../@core/Services/Api/Weblog&News/GetWeblogCount';
import { Badge, Input } from 'reactstrap';
import WeblogCard from './WeblogCard';
import ReactPaginate from 'react-paginate';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ManegeWeblogNews = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('active');
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [selectSort, setSelectSort] = useState('nearest');
  const [searchValue, setSearchValue] = useState('');
  const [activeView, setActiveView] = useState('grid');

  const isActive = status === 'active' ? true : status === 'NotActive' ? false : undefined;

  const { data: WeblogData, isLoading: isWeblogLoading, error: weblogError } = GetCount({ isActive, pageNumber: 1, rowsOfPage: 100000 });
  const { data: TotalCount, isLoading: isTotalLoading } = GetCount({ isActive: undefined, pageNumber: 1, rowsOfPage: 100000 });
  const { data: ActiveCount, isLoading: isActiveLoading } = GetCount({ isActive: true, pageNumber: 1, rowsOfPage: 100000 });

  // دیباگ برای بررسی وضعیت لودینگ
  console.log('isWeblogLoading:', isWeblogLoading, 'isTotalLoading:', isTotalLoading, 'isActiveLoading:', isActiveLoading);

  // نمایش اسکلتون اگر هر یک از API‌ها در حال لود شدن باشه
  if (isWeblogLoading || isTotalLoading || isActiveLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="weblog gap-2">
          <div className="WeblogAndNewsInfo gap-2 justify-content-between flex-wrap">
            {/* اسکلتون برای کارت‌های آماری */}
            <Skeleton height={100} width={350} borderRadius={8} className="shadow-sm" />
            <Skeleton height={100} width={350} borderRadius={8} className="shadow-sm" />
            <Skeleton height={100} width={350} borderRadius={8} className="shadow-sm" />
          </div>

          <div className="weblogList">
            <div className="d-flex justify-content-between flex-wrap gap-1 align-items-center mb-2">
              <div className="d-flex gap-1 align-items-center">
                {/* اسکلتون برای متن "نمایش" و انتخاب تعداد ردیف‌ها */}
                <Skeleton width={60} height={38} borderRadius={6} />
                <Skeleton width={100} height={38} borderRadius={6} className="select1" />
              </div>
              <div className="d-flex gap-1 align-items-center mt-3">
                {/* اسکلتون برای مرتب‌سازی و وضعیت */}
                <Skeleton width={60} height={38} borderRadius={6} />
                <Skeleton width={120} height={38} borderRadius={6} className="select2" />
                <Skeleton width={120} height={38} borderRadius={6} className="select2" />
              </div>
              <div className="d-flex gap-1 align-items-center mt-2">
                {/* اسکلتون برای دکمه‌های تغییر نما */}
                <Skeleton width={40} height={38} borderRadius={6} />
                <Skeleton width={40} height={38} borderRadius={6} />
              </div>
            </div>

            {/* اسکلتون برای ورودی جستجو */}
            <Skeleton height={38} width={1200} borderRadius={6} className="mt-1" />

            {/* اسکلتون برای گرید یا جدول */}
            {activeView === 'grid' ? (
              <div className="mt-1 d-flex justify-content-around flex-wrap gap-2">
                {[...Array(Math.min(rowsPerPage, 6))].map((_, index) => (
                  <Skeleton
                    key={index}
                    height={350}
                    width={350}
                    borderRadius={8}
                    className="shadow-sm"
                    style={{ marginBottom: '16px' }}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-1">
                <Skeleton
                  height={50}
                  count={Math.min(rowsPerPage, 6)}
                  borderRadius={6}
                  style={{ marginBottom: '8px' }}
                  className="shadow-sm"
                />
              </div>
            )}

            {/* اسکلتون برای صفحه‌بندی */}
            <div className="pagination justify-content-center mt-2">
              <Skeleton width={300} height={38} borderRadius={6} />
            </div>
          </div>
        </div>
      </SkeletonTheme>
    );
  }

  if (weblogError) return <p>خطا در بارگذاری اطلاعات: {weblogError.message}</p>;

  let sortedWeblogData = [...(WeblogData?.news || [])];

  if (selectSort === 'favorite') {
    sortedWeblogData.sort((a, b) => b.currentRate - a.currentRate);
  } else if (selectSort === 'nearest') {
    sortedWeblogData.sort((a, b) => new Date(b.insertDate) - new Date(a.insertDate));
  }

  if (searchValue.trim() !== '') {
    sortedWeblogData = sortedWeblogData.filter((item) =>
      item.title?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }

  const pageCount = Math.ceil(sortedWeblogData.length / rowsPerPage);
  const handlePagination = (page) => setCurrentPage(page.selected + 1);
  const paginatedData = sortedWeblogData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const renderTable = () => (
    <div className="mt-1">
      <table className="table">
        <thead>
          <tr>
            <th>عنوان</th>
            <th>نویسنده</th>
            <th>تاریخ</th>
            <th>تعداد بازدید</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={item.id}>
              <td className="text-dark">{item.title}</td>
              <td className="text-dark">{item.addUserFullName || '------'}</td>
              <td className="text-dark">{item.insertDate?.slice(0, 10)}</td>
              <td className="text-dark">{item.currentView}</td>
              <td style={{ width: '100px' }}>
                <Badge
                  className="activeWeblog"
                  color={item.isActive === false ? 'light-danger' : 'light-success'}
                >
                  {item.isActive === true ? 'فعال' : 'غیرفعال'}
                </Badge>
              </td>
              <td>
                <NavLink
                  to={`/WeblogAndNewsList/${item.id}`}
                  className="btn btn-sm btn-primary"
                  onClick={(e) => {
                    if (!item.isActive) {
                      e.preventDefault();
                      toast.error('این خبر غیر فعال است و امکان مشاهده جزئیات وجود ندارد.');
                    }
                  }}
                >
                  جزئیات
                </NavLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="weblog gap-2">
      <div className="WeblogAndNewsInfo gap-2 justify-content-between flex-wrap">
        <StatsHorizontal2 icon={<Book size={21} />} color="primary" stats={TotalCount?.totalCount} statTitle="مجموع اخبار و مقالات" />
        <StatsHorizontal2 icon={<Activity size={21} />} color="success" stats={ActiveCount?.totalCount} statTitle="اخبار و مقالات فعال" />
        <StatsHorizontal2 icon={<Slash size={20} />} color="warning" stats={(TotalCount?.totalCount || 0) - (ActiveCount?.totalCount || 0)} statTitle="اخبار و مقالات غیر فعال" />
      </div>

      <div className="weblogList">
        <div className="d-flex justify-content-between flex-wrap gap-1 align-items-center">
          <div className="d-flex gap-1 align-items-center">
            نمایش
            <Select
              className="select1"
              classNamePrefix="select"
              defaultValue={{ label: rowsPerPage, value: rowsPerPage }}
              onChange={(selectCountPage) => {
                setRowsPerPage(selectCountPage.value);
                setCurrentPage(1);
              }}
              options={[{ value: 12, label: 12 }, { value: 6, label: 6 }, { value: 3, label: 3 }]}
            />
          </div>

          <div className="d-flex gap-1 align-items-center">
            مرتب سازی
            <Select
              className="select2"
              classNamePrefix="select"
              value={{ value: status, label: status === 'active' ? 'فعال' : 'غیر فعال' }}
              onChange={(e) => {
                setStatus(e.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'active', label: 'فعال' },
                { value: 'NotActive', label: 'غیر فعال' },
              ]}
            />
            <Select
              className="select2"
              classNamePrefix="select"
              defaultValue={{ value: 'nearest', label: 'جدید ترین' }}
              onChange={(e) => {
                setSelectSort(e.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'nearest', label: 'جدید ترین' },
                { value: 'favorite', label: 'محبوب ترین' },
              ]}
            />
          </div>

          <div className="d-flex gap-1 align-items-center">
            <button
              className={`btn btn-sm ${activeView === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveView('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`btn btn-sm ${activeView === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveView('table')}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <Input
          className="mt-1 text-primary"
          type="text"
          bsSize="lg"
          placeholder="جستجو..."
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setCurrentPage(1);
          }}
        />

        {activeView === 'grid' ? (
          <div className="mt-1 d-flex justify-content-around flex-wrap">
            <WeblogCard Api={{ news: paginatedData }} />
          </div>
        ) : (
          renderTable()
        )}

        {sortedWeblogData.length > rowsPerPage && (
          <ReactPaginate
            previousLabel="قبلی"
            nextLabel="بعدی"
            breakLabel="..."
            pageCount={pageCount}
            onPageChange={handlePagination}
            containerClassName="pagination justify-content-center mt-2"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            forcePage={currentPage - 1}
          />
        )}
      </div>
    </div>
  );
};

export default ManegeWeblogNews;