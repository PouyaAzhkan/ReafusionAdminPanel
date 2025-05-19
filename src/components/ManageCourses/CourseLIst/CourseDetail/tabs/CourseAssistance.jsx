import { Fragment, useEffect, useState } from "react";
import { Button, Card, Table, Collapse, Row, Col } from "reactstrap";
import { CourseAssistanceTable } from "../../../../../@core/constants/courses/CourseAssistanceTable";
import TableItems from "../../../../../view/CourseAssistance/TableItems";
import ModalAssistance from "../../../../../view/CourseAssistance/ModalAssistance";
import { useParams } from "react-router-dom";
import { Edit } from "react-feather";
import GetAssistanceDetail from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/GetAssistanceDetail";
import { AssistanceWorkTable } from "./AssistanceWork/AssistanceWorkTable";
import GetCourseAssistance from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/GetCourseAssistance";

const CourseAssistance = ({ id }) => {
  const { id: courseId } = useParams(); // برای دریافت آیدی دوره
  const [filteredData, setFilteredData] = useState([]);
  const [accId, setAccId] = useState("");
  const [openRow, setOpenRow] = useState(null); // برای کنترل آکاردئون
  const [editModal, setEditModal] = useState({ show: false, currentAssistance: null });
  const [createModal, setCreateModal] = useState(false);

  // دریافت داده‌های منتورها
  const {
    data: assistance,
    isLoading: assistanceLoading,
    error: assistanceError,
  } = GetCourseAssistance();

  // دریافت جزئیات منتور
  const {
    data: details,
    isLoading: detailsLoading,
    error: detailsError,
    refetch,
  } = GetAssistanceDetail(accId);

  // فیلتر کردن داده‌ها بر اساس courseId
  useEffect(() => {
    if (assistance && Array.isArray(assistance)) {
      setFilteredData(assistance.filter((ev) => ev.courseId === courseId));
    } else {
      setFilteredData([]);
    }
  }, [assistance, courseId]);

  // کنترل باز و بسته شدن آکاردئون
  const toggleRow = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  // باز کردن مودال ویرایش
  const handleEditModal = (event, item) => {
    event.stopPropagation();
    setAccId(item.id);
    setEditModal({ show: true, currentAssistance: item });
  };

  // باز کردن مودال افزودن
  const toggleCreateModal = () => {
    setCreateModal(!createModal);
  };

  // مدیریت لودینگ و خطا
  if (assistanceLoading || detailsLoading) {
    return <p>در حال بارگذاری اطلاعات...</p>;
  }

  if (assistanceError || detailsError) {
    return <p>خطا در بارگذاری اطلاعات: {assistanceError?.message || detailsError?.message}</p>;
  }

  if (!assistance || filteredData.length === 0) {
    return <p>داده‌ای برای نمایش وجود ندارد</p>;
  }

  return (
    <Fragment>
      <div className="divider divider-start d-flex justify-content-between">
        <div className="divider-text fs-2">منتورها</div>
        <Button color="primary" onClick={toggleCreateModal} style={{ zIndex: "10" }}>
          افزودن منتور
        </Button>
      </div>
      <Card>
        <div className="react-dataTable">
          <Table hover>
            <thead>
              <tr className="text-center">
                {CourseAssistanceTable.map((item, index) => (
                  <th key={index}>{item}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <Fragment key={item.id}>
                  <TableItems
                    setAccId={setAccId}
                    toggle={() => handleEditModal({ stopPropagation: () => {} }, item)}
                    item={item}
                    onClick={() => toggleRow(index)}
                    openRow={openRow}
                    index={index}
                    toggleRow={toggleRow}
                  />                    
                  <td colSpan={CourseAssistanceTable.length + 1}>
                      <Collapse isOpen={openRow === index}>
                        <Row className="p-2">
                          <Col>
                            <h5 className="text-primary"><span className="text-dark">وظایف :</span> {item.assistanceName}</h5>
                            <AssistanceWorkTable
                              user={{ id: item.userId }}
                              singleCourse={courseId}
                              isCurrentUserAssistance={[item]}
                            />
                          </Col>
                        </Row>
                      </Collapse>
                  </td>
                </Fragment>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      <ModalAssistance
        isOpen={editModal.show}
        toggle={() => setEditModal({ ...editModal, show: false })}
        data={details?.courseAssistanceDto || editModal.currentAssistance}
        refetch={refetch}
        courseId={courseId}
        section="update"
      />
      <ModalAssistance
        isOpen={createModal}
        toggle={toggleCreateModal}
        data={{ userId: "", courseId: "" }}
        refetch={refetch}
        courseId={courseId}
        section="create"
      />
    </Fragment>
  );
};

export default CourseAssistance;