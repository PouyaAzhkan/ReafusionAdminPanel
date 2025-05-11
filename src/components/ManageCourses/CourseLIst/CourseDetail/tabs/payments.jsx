import { Table, Badge } from "reactstrap";
import { Fragment, useState } from "react";
import { Card } from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useParams } from "react-router-dom";
import CustomPagination from "../../../../../@core/components/pagination";
import GetPaymentList from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManagePayment/GetPaymentList";

const Payments = () => {
  const { id } = useParams();

  const { data, isLoading, error } = GetPaymentList(id);

  // Pagination
  const [PageNumber, setPageNumber] = useState(1);
  const [RowsOfPage, setRowsOfPage] = useState(8);
  const [itemOffset, setItemOffset] = useState(0);

  const donePays = data?.donePays || [];
  const endOffset = itemOffset + RowsOfPage;
  const currentItems = donePays.slice(itemOffset, endOffset);

  const handleWithOutDispatch = (page) => {
    const newOffset = (page.selected * RowsOfPage) % donePays.length;
    setItemOffset(newOffset);
    setPageNumber(page.selected + 1);
  };

  if (isLoading) return <p>در حال بارگذاری پرداخت‌ها...</p>;
  if (error) return <p>خطا در بارگذاری پرداخت‌ها</p>;

  return (
    <Fragment>
      <Card>
        <div className="react-dataTable">
          <Table hover>
            <thead>
              <tr className="text-center">
                <th className="px-0">نام کاربر</th>
                <th className="px-0">گروه دوره</th>
                <th className="px-0">وضعیت پرداخت</th>
              </tr>
            </thead>
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tbody key={index}>
                  <tr className="text-center">
                    <td className="px-0">{item?.studentName}</td>
                    <td className="px-0">{item?.groupName}</td>
                    <td className="px-0">
                      <Badge
                        pill
                        color={
                          item?.peymentDone ? "light-primary" : "light-danger"
                        }
                        className="me-1"
                      >
                        {item?.peymentDone ? "تایید شده" : "تایید نشده"}
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              ))
            ) : (
              <tbody>
                <tr>
                  <td colSpan={3} className="text-center">
                    هنوز پرداختی برای این گروه انجام نشده است.
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </Card>

      {donePays.length > 0 && (
        <CustomPagination
          total={donePays.length}
          current={PageNumber}
          rowsPerPage={RowsOfPage}
          handleClickFunc={handleWithOutDispatch}
        />
      )}
    </Fragment>
  );
};


export default Payments;
