import { Badge, Button, Table, Tooltip } from "reactstrap";
import { useEffect, useState } from "react";
import IMG from "../../../../../assets/images/element/UnKnownUser.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Eye } from "react-feather";
import HeaderTable from "../../../../../@core/components/header-table/HeaderTable";
import { PaymentCoursesTableTitles } from "../../../../../@core/constants/courses";
import AcceptPaymentModal from "./AcceptPaymentModal";
import CustomPagination from "../../../../../@core/components/pagination";
import GetAllCoursePayment from "../../../../../@core/Services/Api/Courses/CourseList/GetAllCoursePayment";

const PaymentOfCourses = ({ courseId }) => {
  const navigate = useNavigate();

  // Pagination states
  const [pageNumber, setPageNumber] = useState(1);
  const [rowsOfPage] = useState(15);
  const [itemOffset, setItemOffset] = useState(0);

  // Payment states
  const [paymentsData, setPaymentsData] = useState([]);
  const [paymentReceipt, setPaymentReceipt] = useState(undefined);
  const [paymentId, setPaymentId] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get data from API
  const { data: getAllPayment, isLoading, error, refetch } = GetAllCoursePayment(courseId);

  useEffect(() => {
    if (getAllPayment) {
      setPaymentsData(getAllPayment);
    }
  }, [getAllPayment]);

  const handlePagination = (page) => {
    const newOffset = (page.selected * rowsOfPage) % paymentsData.length;
    setItemOffset(newOffset);
    setPageNumber(page.selected + 1);
  };

  const handleShowModal = (item) => {
    if (!item.id) {
      alert("شناسه پرداخت نامعتبر است.");
      return;
    }
    setPaymentReceipt(item.paymentInvoiceImage);
    setPaymentId(item.id);
    setShowModal(true);
  };

  if (isLoading) return <p>در حال بارگذاری اطلاعات</p>;
  if (error) return <p>خطا در بارگذاری اطلاعات: {error.message}</p>;

  return (
    <div style={{ overflowX: "auto" }}>
      <Table hover className="rounded" style={{ overflow: "hidden" }}>
        <HeaderTable titles={PaymentCoursesTableTitles} />
        <tbody>
          {paymentsData.length > 0 ? (
            paymentsData.slice(itemOffset, itemOffset + rowsOfPage).map((item, index) => (
              <tr key={index} className="text-right">
                <td
                  onClick={() => navigate(`/users/view/${item.studentId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={IMG}
                    className="me-75 rounded-circle"
                    style={{ objectFit: "cover" }}
                    height="30"
                    width="30"
                    alt="user"
                  />
                  <span className="align-middle fw-bold">{item.studentName}</span>
                </td>
                <td
                  onClick={() => navigate(`/courses/${item.courseId}`)}
                  style={{ cursor: "pointer" }}
                >
                  {item.title}
                </td>
                <td className="text-center">
                  {item.accept ? (
                    <Badge pill color="light-success" className="me-1">
                      تأیید شده
                    </Badge>
                  ) : (
                    <Badge pill color="light-danger" className="me-1">
                      تأیید نشده
                    </Badge>
                  )}
                </td>
                <td className="px-0">
                  <div
                    id={`tooltip-${index}`}
                    onClick={() => handleShowModal(item)}
                    className="text-center text-primary"
                    style={{ cursor: "pointer" }}
                  >
                    <Eye size={20} />
                  </div>
                  <Tooltip
                    placement="top"
                    isOpen={tooltipOpen === index}
                    target={`tooltip-${index}`}
                    toggle={() => setTooltipOpen(tooltipOpen === index ? false : index)}
                  >
                    رسید پرداخت
                  </Tooltip>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">هیچ پرداختی یافت نشد</td>
            </tr>
          )}
        </tbody>
      </Table>

      <AcceptPaymentModal
        showModal={showModal}
        setShowModal={setShowModal}
        paymentId={paymentId}
        paymentReceipt={paymentReceipt}
        refetch={refetch}
      />

      <CustomPagination
        total={paymentsData?.length || 0}
        current={pageNumber}
        rowsPerPage={rowsOfPage}
        handleClickFunc={handlePagination}
      />
    </div>
  );
};

export default PaymentOfCourses;
