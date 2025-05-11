// ** Images
import IMG from "../../../../../assets/images/element/UnKnownUser.jpg";
// ** Reactstrap Imports
import { Table, Badge, Button } from "reactstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CourseTableTitles } from "../../../../../@core/constants/courses";
import HeaderTable from "../../../../../@core/components/header-table/HeaderTable";
import CustomPagination from "../../../../../@core/components/pagination";
import GetReservedCourses from "../../../../../@core/Services/Api/Courses/GetReserveCourses";

// **start
const CourseReserve = () => {
  const [coursesState, setCoursesState] = useState([]);
  const [PageNumber, setPageNumber] = useState(1);
  const [RowsOfPage, setRowsOfPage] = useState(18);

  //Getting Courses Reserved from API
  const { data, isLoading, error } = GetReservedCourses()
  if (isLoading) <p>درحال بارگزاری اطلاعات</p>
  if (error) <p>خطا در بارگزاری اطلاعات</p>
  
  useEffect(() => {
    if (data) {
      setCoursesState(data)
    }
  }, [data] );

  // Pagination
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + RowsOfPage;
  const handleWithOutDispatch = (page) => {
    const newOffset = (page.selected * RowsOfPage) % coursesState.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Table hover>
        <HeaderTable titles={CourseTableTitles} />
        <tbody style={{ overflowX: "auto" }}>
          {coursesState &&
            coursesState.slice(itemOffset, endOffset)?.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <img src={IMG} className="me-75 rounded-circle overflow-hidden" height="30" width="30" />
                    <span className="align-middle fw-bold text-dark">{item.studentName}</span>
                  </td>
                  <td className="text-dark">{item.courseName}</td>
                  <td>
                    {item.accept === true ? (
                       <Badge pill color="light-success" className="me-1"> تایید شده </Badge>
                    ) : (
                       <Badge pill color="light-danger" className="me-1"> تایید نشده </Badge>
                    )}
                  </td>
                  <td>
                    <Link to={"/courses/view/" + item.courseId} state={{ tab: "3" }} > 
                       <Button color="primary">جزئیات</Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <CustomPagination
        total={coursesState?.length}
        current={PageNumber}
        rowsPerPage={RowsOfPage}
        handleClickFunc={handleWithOutDispatch}
      />
    </>
  );
};

export default CourseReserve;
