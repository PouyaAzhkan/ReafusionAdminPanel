import { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "reactstrap";
import CustomPagination from "../../../@core/components/pagination";
import { HeaderTable } from "../../../@core/components/table-list";
import headerTable from "../../../@core/constants/assistance-work/HeaderTable";
import TableItems from "./TableItems";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner.js";
import GetAssistanceList from "../../../@core/Services/Api/Courses/ManageAssistanceWork/GetAssistanceList.js";
import GetAssistanceDetail from "../../../@core/Services/Api/Courses/ManageAssistanceWork/GetAssistanceDetail.js";
import ModalTask from "./AddOrEditAssistance/ModalTask.js";

const AssistanceWork = () => {
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState();
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [id, setId] = useState("");

  const { data: assWork, isLoading, error, refetch } = GetAssistanceList();
  const { data: assDetail, isSuccess: detailSuccess } = GetAssistanceDetail(id);

  // Log the updated assDetail to verify the data structure
  console.log("assDetail in AssistanceWork:", assDetail);

  useEffect(() => {
    if (!assWork) return;
    setCurrentPage(0);
    setItemOffset(0);
  }, [assWork]);

  if (isLoading) return <ComponentSpinner />;
  if (error) return <p>خطا در دریافت اطلاعات تسک‌ها</p>;

  const filteredData = assWork.filter((item) =>
    item.worktitle?.toLowerCase().includes(query.toLowerCase())
  );

  const endOffset = itemOffset + rowsPerPage;
  const paginatedData = filteredData.slice(itemOffset, endOffset);

  const handleMovePage = ({ selected }) => {
    setCurrentPage(selected);
    const newOffset = (selected * rowsPerPage) % filteredData.length;
    setItemOffset(newOffset);
  };

  const handleRows = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(0);
    setItemOffset(0);
  };

  const handleSearch = (value) => {
    setQuery(value);
    setCurrentPage(0);
    setItemOffset(0);
  };

  const openEditModalWithId = (selectedId) => {
    setId(selectedId);
    setEditModal(true);
  };

  const toggleEditModal = () => {
    setEditModal(!editModal);
    if (editModal) setId("");
  };

  const toggleCreateModal = () => setCreateModal(!createModal);

  return (
    <div className="app-user-list">
      <Row>
        <Col sm="12">
          <Card className="overflow-hidden">
            <div className="react-dataTable overflow-auto">
              <HeaderTable
                toggleSidebar={toggleCreateModal}
                rowOfPage={rowsPerPage}
                handleRowOfPage={handleRows}
                handleSearch={handleSearch}
                buttonText={"افزودن تسک"}
              />
              <Table hover>
                <thead className="text-center">
                  <tr>
                    {headerTable.map((item, index) => (
                      <th key={index} className="px-0">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <TableItems
                        key={index}
                        item={item}
                        toggleModal={() => openEditModalWithId(item.id)}
                        setId={setId}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={headerTable.length} className="text-center">
                        <h2 className="section-label text-danger fs-3 my-5">
                          تسکی یافت نشد
                        </h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <CustomPagination
              total={filteredData.length || 0}
              current={currentPage}
              rowsPerPage={rowsPerPage}
              handleClickFunc={handleMovePage}
            />
          </Card>
        </Col>

        <ModalTask
          data={detailSuccess ? assDetail : undefined}
          refetch={refetch}
          isOpen={editModal}
          toggle={toggleEditModal}
          section={"update"}
          id={id} // Pass the actual id value, not the setId function
        />

        <ModalTask
          data={{
            worktitle: "",
            workDescribe: "",
            assistanceId: "",
            workDate: ""
          }}
          refetch={refetch}
          isOpen={createModal}
          toggle={toggleCreateModal}
          section={"create"}
          id={id} // Pass the actual id value, not the setId function
        />
      </Row>
    </div>
  );
};

export default AssistanceWork;