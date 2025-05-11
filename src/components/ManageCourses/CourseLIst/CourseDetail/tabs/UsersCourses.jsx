import {
  MoreVertical,
  Delete,
  CheckCircle,
} from "react-feather";
import {
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
} from "reactstrap";
import { Fragment, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import CustomPagination from "../../../../../@core/components/pagination";
import GetUserData from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageUser/GetUserData";

const CourseUsers = ({ setUserSel, centeredModal, setCenteredModal }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  // هوک‌ها باید بیرون از if اجرا شوند
  const { data = [], isLoading, error, refetch } = GetUserData(id); 

  // صفحه‌بندی
  const [PageNumber, setPageNumber] = useState(1);
  const [RowsOfPage, setRowsOfPage] = useState(8);
  const [itemOffset, setItemOffset] = useState(0);

  const handleWithOutDispatch = (page) => {
    const newOffset = (page.selected * RowsOfPage) % data.length;
    setItemOffset(newOffset);
  };

  if (isLoading) return <p>در حال بارگزاری کاربران...</p>;
  if (error) return <p>خطا در بارگزاری کاربران</p>;

  return (
    <Fragment>
      <Card>
        <div className="react-dataTable">
          <Table hover style={{ overflow: "visible" }}>
            <thead className="text-center">
              <tr>
                <th>نام کاربر</th>
                <th>نام دوره</th>
                <th>وضعیت</th>
                <th>اقدام</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    کاربری پیدا نشد
                  </td>
                </tr>
              ) : (
                data.slice(itemOffset, itemOffset + RowsOfPage).map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="px-0">{item.studentName}</td>
                    <td className="px-0">{item.courseName}</td>
                    <td className="px-0"
                       onClick={() => {
                          navigate(`/users/view/${item.studentId}`);
                        }}
                    >
                      <Badge
                        pill
                        color={item.accept ? "light-primary" : "light-danger"}
                        className="me-1"
                        onChange={refetch()}
                      >
                        {item.accept ? "تایید شده" : "تایید نشده"}
                      </Badge>
                    </td>
                    <td>
                      {!item.accept ? (
                        <UncontrolledDropdown direction="start">
                          <DropdownToggle
                            className="icon-btn hide-arrow"
                            color="primary"
                            size="sm"
                            caret
                          >
                            <MoreVertical size={15} />
                          </DropdownToggle>
                          <DropdownMenu className="d-flex flex-column p-0">
                            <DropdownItem
                              onClick={() => {
                                setUserSel(item);
                                setCenteredModal(!centeredModal);
                              }}
                            >
                              <CheckCircle className="me-50" size={15} />
                              تایید
                            </DropdownItem>
                            <DropdownItem divider className="p-0 m-0" />
                            <DropdownItem
                              onClick={() => {
                                // متد حذف رزرو را اینجا صدا بزن
                              }}
                            >
                              <Delete className="me-50" size={15} />
                              حذف
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      ) : <p className="text-danger">غیر قابل دسترس</p>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      <CustomPagination
        total={data.length}
        current={PageNumber}
        rowsPerPage={RowsOfPage}
        handleClickFunc={handleWithOutDispatch}
      />
    </Fragment>
  );
};

export default CourseUsers;
