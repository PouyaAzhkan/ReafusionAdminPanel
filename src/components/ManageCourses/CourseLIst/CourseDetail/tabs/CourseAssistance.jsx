import { Fragment, useEffect, useState } from "react";
import { Button, Card, Table } from "reactstrap";
import { CourseAssistanceTable } from "../../../../../@core/constants/courses/CourseAssistanceTable";
import TableItems from "../../../../../view/CourseAssistance/TableItems";
import ModalAssistance from "../../../../../view/CourseAssistance/ModalAssistance";
import GetAssistanceDetail from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/GetAssistanceDetail";
import GetCourseAssistance from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/CourseAssistance/GetCourseAssistance";

const CourseAssistance = ({ id }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [accId, setAccId] = useState("");

  const { data: details, isLoading: detailsLoading, error: detailsError, isSuccess, isRefetching, refetch } = GetAssistanceDetail(accId)
  const { data: assistance, isLoading: assistanceLoading, error: assistancError } = GetCourseAssistance()


  // Edit Modal
  const [editModal, setEditModal] = useState(false);
  const toggleEditModal = () => setEditModal(!editModal);

  // Create Modal
  const [createModal, setCreateModal] = useState(false);
  const toggleCreateModal = () => setCreateModal(!createModal);

  useEffect(() => {
    if (isSuccess) {
      setFilteredData(assistance.filter((ev) => ev.courseId === id));
    }
  }, [isSuccess, id, isRefetching]);

    if (detailsError || assistanceLoading) return <p>در حال بارگزاری اطلاعات</p>
  if (detailsLoading || assistancError) return <p>خطا در بارگزاری اطلاعات</p>

  return (
    <Fragment>
      <div className="divider divider-start d-flex justify-content-between">
        <div className="divider-text fs-2">منتور ها</div>
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
              {filteredData.length > 0 &&
                filteredData.map((item, index) => (
                  <TableItems
                    key={index}
                    setAccId={setAccId}
                    toggle={toggleEditModal}
                    item={item}
                  />
                ))}
            </tbody>
          </Table>
          {filteredData.length == 0 && (
            <span className="w-100 text-center d-block my-5">
              منتوری برای این دوره وجود ندارد
            </span>
          )}
        </div>
      </Card>
      <ModalAssistance
        isOpen={editModal}
        toggle={toggleEditModal}
        data={details?.courseAssistanceDto}
        refetch={refetch}
        courseId={id}
        section={"update"}
      />
      <ModalAssistance
        isOpen={createModal}
        toggle={toggleCreateModal}
        data={{ userId: "", courseId: "" }}
        refetch={refetch}
        courseId={id}
        section={"create"}
      />
    </Fragment>
  );
};

export default CourseAssistance;
