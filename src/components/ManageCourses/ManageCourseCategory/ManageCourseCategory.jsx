import { Fragment, useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import GeneralStatistics from "../../../@core/components/generalStatistics";
import { StatisticsOfCourseTechnologies } from "../../../@core/constants/courses/StatisticsOfCourses";
import ListHeader from "../../../@core/components/products-list/ListHeader";
import ListSearchbar from "../../../@core/components/products-list/ListSearchbar";
import HeaderTable from "../../../@core/components/header-table/HeaderTable";
import { technologiesTableTitles } from "../../../@core/constants/courses/DetailsTabs";
import fallback from "../../../assets/images/element/Modren-Tech.jpg";
import ImageFallBack from "../../../@core/components/image-fallback";
import { Edit } from "react-feather";
import CustomPagination from "../../../@core/components/pagination";
import AddTechnologyModal from "./AddOrEditModal";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner.js";
import GetCategoryList from "../../../@core/Services/Api/Courses/ManageCategory/GetCategoryList.js";

const ManageCourseCategory = () => {
  const [showModal, setShowModal] = useState(false);
  const [variantState, setVariantState] = useState(undefined);
  const [categoryDetails, setCategoryDetails] = useState(undefined);
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories using react-query
  const { data, isLoading, error, isSuccess, refetch } = GetCategoryList();

  // Loading and error states
  if (isLoading) return <ComponentSpinner />;
  if (error) return <p>خطا در بارگذاری دسته‌بندی‌ها</p>;

  // Filter data based on search query
  const filteredData = data?.filter(
    (item) =>
      item.techName.toLowerCase().includes(query.toLowerCase()) ||
      item.describe.toLowerCase().includes(query.toLowerCase())
  ) || [];

  // Pagination logic
  const endOffset = itemOffset + rowsPerPage;
  const paginatedData = filteredData.slice(itemOffset, endOffset);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Handle pagination page change
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
    const newOffset = (selected * rowsPerPage) % filteredData.length;
    setItemOffset(newOffset);
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(0);
    setItemOffset(0);
  };

  // Handle search query change
  const handleSearch = (value) => {
    setQuery(value);
    setCurrentPage(0);
    setItemOffset(0);
  };

  // Handle category details for editing
  const handleCategoryDetail = (Id) => {
    const category = data.find((item) => item.id === Id);
    setCategoryDetails(category);
    setVariantState("update");
    setShowModal((old) => !old);
  };

  return (
    <Fragment>
      <Row>
        <Col md={3} xs={12}>
          <GeneralStatistics
            data={data}
            statisticsData={StatisticsOfCourseTechnologies}
            resize="12"
          />
          <div className="d-flex justify-content-end">
            <Button
              className="p-0 py-1 text-center"
              style={{ width: "100%" }}
              color="primary"
              onClick={() => {
                setVariantState("create");
                setCategoryDetails(undefined);
                setShowModal(true);
              }}
            >
              <span className="mx-auto">افزودن تکنولوژی</span>
            </Button>
          </div>
        </Col>
        <Col md={9} xs={12}>
          <div>
            <Row>
              <Col className="pt-2">
                <ListHeader
                  rowsPerPage={rowsPerPage}
                  rowsFunc={handleRowsPerPageChange}
                  styleDisplay={"hidden"}
                  colWidth={"6"}
                />
              </Col>
              <Col>
                <ListSearchbar
                  QueryFunction={handleSearch}
                  width={"mb-1 w-100"}
                />
              </Col>
            </Row>
            <div style={{ overflowX: "auto" }}>
              <Table hover style={{ overflowX: "auto" }}>
                <HeaderTable titles={technologiesTableTitles} />
                <tbody style={{ overflowX: "auto" }}>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <ImageFallBack
                            alt="img"
                            src={item.iconAddress}
                            fallback={fallback}
                            className="rounded-2"
                            style={{ height: "30px" }}
                          />
                        </td>
                        <td>{item.techName}</td>
                        <td
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.describe}
                        </td>
                        <td className="text-center">
                          <span
                            onClick={() => handleCategoryDetail(item.id)}
                            style={{ cursor: "pointer" }}
                          >
                            <span className="align-middle text-primary">ویرایش</span>
                            <Edit className="ms-50 text-primary" size={15} />
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>
                        <h2
                          className="section-label text-danger fs-3"
                          style={{
                            textAlign: "center",
                            marginTop: "200px",
                            marginBottom: "200px",
                          }}
                        >
                           تکنولوژیی یافت نشد 
                        </h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {showModal && (
              <AddTechnologyModal
                showModal={showModal}
                setShowModal={setShowModal}
                refetch={refetch}
                variantState={variantState}
                categoryDetails={categoryDetails}
              />
            )}
            <CustomPagination
              total={filteredData.length || 0}
              current={currentPage - 1}
              rowsPerPage={rowsPerPage}
              handleClickFunc={handlePageChange}
            />
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ManageCourseCategory;