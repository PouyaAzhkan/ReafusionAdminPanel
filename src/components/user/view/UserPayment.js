import { Badge, Card, CardHeader } from "reactstrap";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import ReactPaginate from "react-paginate";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { Fragment, useState } from "react";
import { getUserPayList } from "../../../@core/Services/Api/Payments/Payments";
import PaymentReceiptModal from "./PaymentReceiptModal";

export const columns = ({ handlePaymentModal }) => [
  {
    name: "مبلغ پرداختی",
    selector: (row) => row.paid,
    sortable: false,
    width: "150px",
    cell: (row) => {
      const formattedPaid = Number(row.paid).toLocaleString("fa-IR");
      return <span className="text-truncate">{formattedPaid + " تومان"}</span>;
    },
  },
  {
    name: "نام گروه",
    selector: (row) => row.groupName,
    sortable: true,
    width: "170px",
    cell: (row) => (
      <span className="text-truncate">{row.groupName || "بدون عنوان"}</span>
    ),
  },
  {
    name: "زمان ثبت پرداخت",
    selector: (row) => row.insertDate,
    sortable: true,
    width: "200px",
    cell: (row) => {
      const date = new Date(row.insertDate);
      const formattedDate = date.toLocaleDateString("fa-IR");
      const formattedTime = date.toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      return <span>{`${formattedDate} ساعت ${formattedTime}`}</span>;
    },
  },
  {
    name: "وضعیت",
    selector: (row) => row.accept,
    sortable: true,
    width: "120px",
    cell: (row) => (
      <Badge color={row.accept ? "light-success" : "light-danger"} pill>
        {row.accept ? "تایید شده" : "تایید نشده"}
      </Badge>
    ),
  },
  {
    name: "رسید پرداختی",
    selector: (row) => row.accept,
    sortable: true,
    width: "150px",
    cell: (row) => (
      <span
        style={{ cursor: "pointer" }}
        className="text-primary"
        onClick={(e) => {
          e.preventDefault();
          handlePaymentModal(row);
        }}
      >
        مشاهده رسید
      </span>
    ),
  },
];

const UserPayment = ({ userData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null); // state برای ذخیره اطلاعات پرداخت

  const { data, isLoading, isError } = getUserPayList(userData?.id);

  const handlePaymentModal = (payment) => {
    setSelectedPayment(payment); // ذخیره اطلاعات پرداخت
    setOpenPaymentModal(!openPaymentModal);
  };

  const handlePagination = (page) => {
    setCurrentPage(page.selected + 1);
  };

  if (!userData?.id) {
    return <div>شناسه کاربر نامعتبر است</div>;
  }

  if (isLoading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (isError) {
    return <div>خطایی در دریافت اطلاعات رخ داده است.</div>;
  }

  const payments = Array.isArray(data) ? data : [];
  const pageCount = Math.ceil(payments.length / rowsPerPage) || 1;
  const paginatedPayments = payments.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Fragment>
      <Card>
        <CardHeader tag="h4">دوره‌های تایید شده</CardHeader>
        <div className="react-dataTable user-view-account-projects">
          <DataTable
            noHeader
            responsive
            columns={columns({ handlePaymentModal })}
            data={paginatedPayments}
            className="react-dataTable mb-1"
            sortIcon={<ChevronDown size={10} />}
            noDataComponent={<div>هیچ پرداختی یافت نشد</div>}
          />
          <ReactPaginate
            previousLabel={""}
            nextLabel={""}
            breakLabel={"..."}
            pageCount={pageCount}
            onPageChange={handlePagination}
            forcePage={currentPage - 1}
            containerClassName="pagination"
            activeClassName="active"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item prev"
            previousLinkClassName="page-link"
            nextClassName="page-item next"
            nextLinkClassName="page-link"
          />
        </div>
      </Card>
      <PaymentReceiptModal
        openPaymentModal={openPaymentModal}
        setOpenPaymentModal={setOpenPaymentModal}
        paymentImage={selectedPayment?.paymentInvoiceImage}
      />
    </Fragment>
  );
};

export default UserPayment;
