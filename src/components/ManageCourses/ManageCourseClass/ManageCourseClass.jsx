import { useState } from "react";
import { Card, Col, Row, Table } from "reactstrap";
import CustomPagination from "../../../@core/components/pagination";
import { HeaderTable } from "../../../@core/components/table-list";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner.js";
import TableItems from "./TableItems.js";
import GetClassList from "../../../@core/Services/Api/Courses/ManageClass/GetClassList.js";
import headerTable from "../../../@core/constants/class-manage/HeaderTable";
import CreateClass from "./AddOrEditClassModal/CreateClass.js";
import EditClass from "./AddOrEditClassModal/EditClass.js";

const ManageCourseClass = () => {
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [id, setId] = useState("");

  const { data: classes, isLoading, error, refetch } = GetClassList();

  if (isLoading) return <ComponentSpinner />;
  if (error) return <p>خطا در بارگذاری کلاس‌ها</p>;

  const filteredClasses = classes.filter((classItem) =>
    classItem.classRoomName?.toLowerCase().includes(query.toLowerCase())
  );

  const endOffset = itemOffset + rowsPerPage;
  const paginatedData = filteredClasses.slice(itemOffset, endOffset);
  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);

  const handleMovePage = ({ selected }) => {
    setCurrentPage(selected);
    const newOffset = (selected * rowsPerPage) % filteredClasses.length;
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
            <div className="react-dataTable">
              <HeaderTable
                toggleSidebar={toggleCreateModal}
                rowOfPage={rowsPerPage}
                handleRowOfPage={handleRows}
                handleSearch={handleSearch}
                buttonText={"افزودن کلاس"}
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
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={headerTable.length}>
                        <h2
                          className="section-label text-danger fs-3"
                          style={{
                            textAlign: "center",
                            marginTop: "100px",
                            marginBottom: "100px",
                          }}
                        >
                          کلاسی یافت نشد
                        </h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <CustomPagination
              total={filteredClasses.length || 0}
              current={currentPage}
              rowsPerPage={rowsPerPage}
              handleClickFunc={handleMovePage}
            />
          </Card>
        </Col>

        {/* فقط id و باز بودن مودال را می‌دهیم */}
        <EditClass
          id={id}
          refetch={refetch}
          isOpen={editModal}
          toggle={toggleEditModal}
        />

        <CreateClass
          refetch={refetch}
          isOpen={createModal}
          toggle={toggleCreateModal}
        />
      </Row>
    </div>
  );
};

export default ManageCourseClass;
