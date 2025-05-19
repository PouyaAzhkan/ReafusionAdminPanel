import { MoreVertical, Edit, Delete } from "react-feather";
import {
  Table,
  Badge,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Card,
} from "reactstrap";
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import { useParams } from "react-router-dom";
import { useState } from "react";
import CustomPagination from "../../../../../@core/components/pagination";
import AcceptComment from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageComment/AcceptComment";
import RejectComment from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageComment/RejectComment";
import useGetCourseComment from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageComment/GetCourseComment";
import DeleteComment from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageComment/DeleteComment";

const CourseCommment = () => {
  const { id } = useParams();
  const headerTable = ["نام کاربر", "عنوان کامنت", "متن کامنت", "وضعیت", "اقدام"];

  const { data: commentData, isLoading, error, refetch } = useGetCourseComment(id);

  // Pagination
  const [PageNumber, setPageNumber] = useState(1);
  const [RowsOfPage, setRowsOfPage] = useState(9);
  const [itemOffset, setItemOffset] = useState(0);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const endOffset = itemOffset + RowsOfPage;

  const { mutate: AcceptComments } = AcceptComment();
  const { mutate: RejectComments } = RejectComment();
  const { mutate: DeleteComments } = DeleteComment();
 
  const handleWithOutDispatch = (page) => {
    const newOffset = (page.selected * RowsOfPage) % commentData?.length;
    setItemOffset(newOffset);
    setPageNumber(page.selected + 1);
  };

  const handleAccept = (commentId) => {
    AcceptComments(commentId, {
      onSuccess: () => {
        refetch(); // Refetch after accepting
      }
    });
  };

  const handleReject = (commentId) => {
    RejectComments(commentId, {
      onSuccess: () => {
        refetch(); // Refetch after rejecting
      }
    });
  };

 const handleDelete = (commentId) => {
    DeleteComments(commentId, {
      onSuccess: () => {
        refetch(); 
      },
    });
}

  if (isLoading) return <p>در حال بارگزاری کامنت‌های این دوره</p>;
  if (error) return <p>خطا در بارگزاری کامنت‌های این دوره</p>;

  const currentData = commentData?.slice(itemOffset, endOffset) || [];

  return (
    <>
      <Card>
        <div className="react-dataTable">
          <Table hover>
            <thead>
              <tr>
                {headerTable.map((item, index) => (
                  <th key={index} className="px-1"> {item} </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.map((item, index) => (
                <tr key={index}>
                  <td style={{ maxWidth: "160px" }} className="px-1">
                    {item.author || item.courseTitle}
                  </td>
                  <td className="px-0" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "130px" }}>
                    {item.title || item.commentTitle}
                  </td>
                  <td style={{ maxWidth: "220px" }} className="p-0">
                    {item.describe}
                  </td>
                  <td
                    className=" p-0"
                    onClick={item.accept === true ? () => handleReject(item.id) : () => handleAccept(item.id)}
                  >
                    <Badge pill color={item.accept ? "light-primary" : "light-danger"} className="me-1">
                      {item.accept === true ? "تایید شده" : " تایید نشده"}
                    </Badge>
                  </td>
                  <td className="p-0">
                    <UncontrolledDropdown direction="start">
                      <DropdownToggle
                        className="icon-btn hide-arrow text-primary"
                        color="transparent"
                        size="sm"
                        caret
                        onClick={() => {
                          const commentId = item.id;
                          setSelectedCommentId(commentId);
                          console.log("Comment ID:", commentId);
                        }}
                      >
                        <MoreVertical size={15} />
                      </DropdownToggle>
                      <DropdownMenu className="d-flex flex-column p-0">
                        {item.accept ? (
                          <DropdownItem onClick={() => handleReject(item.id)}>
                            <Delete className="me-50" size={15} />
                            <span className="align-middle">عدم تایید</span>
                          </DropdownItem>
                        ) : (
                          <DropdownItem onClick={() => handleAccept(item.id)}>
                            <Edit className="me-50" size={15} />
                            <span className="align-middle">تایید</span>
                          </DropdownItem>
                        )}
                        <DropdownItem divider className="p-0 m-0" />
                        <DropdownItem
                          onClick={() =>
                            handleDelete(item.id)
                          }
                        >
                        <Delete className="me-50" size={15} />{" "}
                        <span className="align-middle"> حذف </span>
                        </DropdownItem>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      {commentData?.length === 0 ? (
        <div className="mx-auto my-6 text-center">کامنتی پیدا نشد</div>
      ) : (
        <CustomPagination
          total={commentData?.length}
          current={PageNumber - 1}
          rowsPerPage={RowsOfPage}
          handleClickFunc={handleWithOutDispatch}
        />
      )}
    </>
  );
};

export default CourseCommment;
