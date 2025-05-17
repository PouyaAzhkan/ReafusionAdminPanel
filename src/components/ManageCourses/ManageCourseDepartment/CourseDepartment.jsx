import { useState } from "react";
import { Card, Col, Row, Table } from "reactstrap";
import CustomPagination from "../../../@core/components/pagination";
import { HeaderTable } from "../../../@core/components/table-list";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner.js";
import headerTable from "../../../@core/constants/department-manage/HeaderTable";
import TableItems from "./TableItems.js";
import GetDepartmantList from "../../../@core/Services/Api/Courses/ManageDepartment/GetDepartmantList.js";
import CreateDepartment from "./AddOrEditDepartmant/CreateDepartment.js";
import GetDepartmantDetail from "../../../@core/Services/Api/Courses/ManageDepartment/GetDepartmentDetail.js";
import EditDepartment from "./AddOrEditDepartmant/EditDepartment.js";

const CourseDepartment = () => {
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [id, setId] = useState("");

  const { data: departments, isLoading, error, refetch } =  GetDepartmantList();

  const { data: depDetail, isSuccess: detailSuccess } = GetDepartmantDetail(id);

  if (isLoading) return <ComponentSpinner />;
  if (error) return <p>خطا در بارگذاری بخش‌ها</p>;

  const filteredDepartments = departments.filter((item) =>
    item.depName?.toLowerCase().includes(query.toLowerCase())
  );

  const endOffset = itemOffset + rowsPerPage;
  const paginatedData = filteredDepartments.slice(itemOffset, endOffset);
  const totalPages = Math.ceil(filteredDepartments.length / rowsPerPage);

  const handleMovePage = ({ selected }) => {
    setCurrentPage(selected);
    const newOffset = (selected * rowsPerPage) % filteredDepartments.length;
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
                buttonText={"افزودن بخش"}
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
                          بخشی یافت نشد
                        </h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            <CustomPagination
              total={filteredDepartments.length || 0}
              current={currentPage}
              rowsPerPage={rowsPerPage}
              handleClickFunc={handleMovePage}
            />
          </Card>
        </Col>

          <EditDepartment
            id={id}
            refetch={refetch}
            isOpen={editModal}
            toggle={toggleEditModal}
          />

        <CreateDepartment
          refetch={refetch}
          isOpen={createModal}
          toggle={toggleCreateModal}
        />
      </Row>
    </div>
  );
};

export default CourseDepartment;