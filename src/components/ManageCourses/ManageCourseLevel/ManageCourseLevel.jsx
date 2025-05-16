import { Fragment, useState } from "react";
import { Button, Col, Row, Table } from "reactstrap";
import GeneralStatistics from "../../../@core/components/generalStatistics";
import { StatisticsOfCourseLevel } from "../../../@core/constants/courses/StatisticsOfCourses";
import ListHeader from "../../../@core/components/products-list/ListHeader";
import ListSearchbar from "../../../@core/components/products-list/ListSearchbar";
import HeaderTable from "../../../@core/components/header-table/HeaderTable";
import { LevelsTableTitles } from "../../../@core/constants/courses/DetailsTabs";
import CustomPagination from "../../../@core/components/pagination";
import Img from "../../../assets/images/element/level.png";
import { Edit } from "react-feather";
// import AddLevelModal from "../create";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner.js";
import GetCourseLevelList from "../../../@core/Services/Api/Courses/ManageLevel/GetCourseLevelList.js";
import AddLevelModal from "./AddOrEditLevelModal/index.js";

const ManageCourseLevel = () => {
  const [showModal, setShowModal] = useState(false);
  const [variantState, setVariantState] = useState(undefined);
  const [levelDetails, setLevelDetails] = useState(undefined);
  const [query, setQuery] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch course levels using react-query
  const { data, isLoading, error, isSuccess, refetch } = GetCourseLevelList();

  // Loading and error states
  if (isLoading) return <ComponentSpinner />;
  if (error) return <p>خطا در بارگذاری سطوح دوره</p>;

  // Filter data based on search query
  const filteredData = data?.filter(
    (item) =>
      item.levelName.toLowerCase().includes(query.toLowerCase()) ||
      item.describe?.toLowerCase().includes(query.toLowerCase())
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
  const handleLevelDetail = (id) => {
    const level = data.find((item) => item.id === id);
    setLevelDetails(level);
    setVariantState("update");
    setShowModal(true);
  };

  return (
    <Fragment>
      <Row>
        <Col md={3} xs={12}>
          <GeneralStatistics
            data={data}
            statisticsData={StatisticsOfCourseLevel}
            resize="12"
          />
          <div className="d-flex justify-content-end">
            <Button
              className="p-0 py-1 text-center"
              style={{ width: "100%" }}
              color="primary"
              onClick={() => {
                setVariantState("create");
                setLevelDetails(undefined);
                setShowModal(true);
              }}
            >
              <span className="mx-auto">افزودن سطح دوره</span>
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
                <HeaderTable titles={LevelsTableTitles} />
                <tbody style={{ overflowX: "auto" }}>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            alt="img"
                            src={Img}
                            style={{ height: "30px" }}
                            className="rounded-2"
                          />
                        </td>
                        <td>{item.levelName}</td>
                        <td
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.describe || item.levelName}
                        </td>
                        <td className="text-center">
                          <span
                            onClick={() => handleLevelDetail(item.id)}
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
                          سطح دوره‌ای یافت نشد
                        </h2>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
            {showModal && (
              <AddLevelModal
                showModal={showModal}
                setShowModal={setShowModal}
                refetch={refetch}
                variantState={variantState}
                levelDetails={levelDetails}
              />
            )}
            <CustomPagination
              total={filteredData.length || 0}
              current={currentPage}
              rowsPerPage={rowsPerPage}
              handleClickFunc={handlePageChange}
            />
          </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ManageCourseLevel;
