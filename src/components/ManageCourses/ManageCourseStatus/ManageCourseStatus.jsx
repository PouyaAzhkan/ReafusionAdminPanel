import { useEffect, useState, Fragment } from "react";
import { Row, Col, Button, Table } from "reactstrap";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import GeneralStatistics from "../../../@core/components/generalStatistics";
import ListHeader from "../../../@core/components/products-list/ListHeader";
import ListSearchbar from "../../../@core/components/products-list/ListSearchbar";
import HeaderTable from "../../../@core/components/header-table/HeaderTable";
import CustomPagination from "../../../@core/components/pagination";
import { Edit } from "react-feather";
import Img from "../../../assets/images/element/status.png";
import { StatusTableTitles } from "../../../@core/constants/courses/DetailsTabs";
import { StatisticsOfCourseStatus } from "../../../@core/constants/courses/StatisticsOfCourses";
import GetStatusList from "../../../@core/Services/Api/Courses/ManageStatus/GetStatusList";
import AddStatusModal from "./AddOrEditStatusModal";

const ManageCourseStatus = () => {
  const [PageNumber, setPageNumber] = useState(0);
  const [RowsOfPage, setRowsOfPage] = useState(15);
  const [Query, setQuery] = useState("");
  const [AllList, setAllList] = useState([]);
  const [FilteredList, setFilteredList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [variantState, setVariantState] = useState(undefined);
  const [categoryDetails, setCategoryDetails] = useState(undefined);
  const [selectedItem, setSelectedItem] = useState(undefined);

  const { data: fetchedData, isLoading, isSuccess, refetch } = GetStatusList();

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + RowsOfPage;
  const [page, setPage] = useState({ selected: 0 });

  const handlePagination = (page) => {
    setPageNumber(page.selected);
    const newOffset = (page.selected * RowsOfPage) % FilteredList.length;
    setItemOffset(newOffset);
  };

  const handleCategoryDetail = (Id) => {
    const detail = fetchedData.find((item) => item.id === Id);
    console.log("Selected detail:", detail); // لاگ برای بررسی
    if (detail) {
      setCategoryDetails(detail);
      setShowModal(true);
    } else {
      console.error("No detail found for ID:", Id);
    }
  };

  const handleQueryChange = (q) => {
    setQuery(q);
    const filtered = AllList.filter((item) =>
      item.statusName?.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredList(filtered);
    setPageNumber(0);
    setItemOffset(0);
  };

  useEffect(() => {
    if (isSuccess) {
      console.log("fetchedData:", fetchedData); // لاگ برای بررسی داده‌ها
      setAllList(fetchedData);
      setFilteredList(fetchedData);
    }
  }, [isSuccess, fetchedData]);

  useEffect(() => {
    if (!showModal) setSelectedItem(undefined);
  }, [showModal]);

  if (isLoading) return <ComponentSpinner />;

  return (
    <Fragment>
      <Row>
        <Col md={3} xs={12}>
          <GeneralStatistics
            data={fetchedData}
            statisticsData={StatisticsOfCourseStatus}
            resize="12"
          />
          <div className="d-flex justify-content-end">
            <Button
              className="p-0 py-1 text-center"
              style={{ width: "100%" }}
              color="primary"
              onClick={() => {
                setVariantState("create");
                setCategoryDetails(undefined); // برای ایجاد وضعیت جدید
                setShowModal(true);
              }}
            >
              <span className="mx-auto">افزودن وضعیت دوره</span>
            </Button>
          </div>
        </Col>
        <Col md={9} xs={12}>
          <Row>
            <Col className="pt-2">
              <ListHeader
                rowsFunc={(count) => setRowsOfPage(count)}
                styleDisplay={"hidden"}
                colWidth={"6"}
                rowsPerPage={RowsOfPage}
              />
            </Col>
            <Col>
              <ListSearchbar
                QueryFunction={handleQueryChange}
                width={"mb-1 w-100"}
              />
            </Col>
          </Row>
          <div style={{ overflowX: "auto" }}>
            <Table hover>
              <HeaderTable titles={StatusTableTitles} />
              <tbody>
                {FilteredList?.length > 0 ? (
                  FilteredList.slice(itemOffset, endOffset)?.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          alt="img"
                          src={Img}
                          style={{ height: "30px" }}
                          className="rounded-1"
                        />
                      </td>
                      <td>{item.statusName}</td>
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
                      <td
                        className="text-center"
                        onClick={() => {
                          setVariantState("update");
                          handleCategoryDetail(item.id);
                        }}
                      >
                        <span className="align-middle text-primary">ویرایش</span>
                        <Edit className="ms-50 text-primary" size={15} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={StatusTableTitles.length}>
                      <h3 className="text-center my-5 text-danger">داده‌ای یافت نشد</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          {showModal && (
            <AddStatusModal
              showModal={showModal}
              setShowModal={setShowModal}
              refetch={refetch}
              variantState={variantState}
              categoryDetails={categoryDetails}
            />
          )}
          <CustomPagination
            total={FilteredList?.length}
            current={PageNumber}
            rowsPerPage={RowsOfPage}
            handleClickFunc={handlePagination}
          />
        </Col>
      </Row>
    </Fragment>
  );
};

export default ManageCourseStatus;