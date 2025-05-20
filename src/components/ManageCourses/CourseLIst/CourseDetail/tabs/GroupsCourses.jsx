import {
  MoreVertical,
  Edit,
  Delete,
  Plus,
} from "react-feather";
import {
  Table,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Row,
  Col,
  Card,
  Button,
} from "reactstrap";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

import CustomPagination from "../../../../../@core/components/pagination";
import HeaderTable from "../../../../../@core/components/header-table/HeaderTable";
import { CourseGroups } from "../../../../../@core/constants/courses";
import ModalGroup from "../../../../../view/ModalGroupe";
import DeleteGroupe from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageGroupe/DeleteGroupe";
import toast from "react-hot-toast";

const CoursesGroups = ({ groupData, refetchGroup }) => {
  const [showModal, setShowModal] = useState(false);
  const [variantState, setVariantState] = useState("");
  const [groupId, setGroupId] = useState(undefined);

  const { mutate: DeleteGroupes } = DeleteGroupe();

  const deleteGroup = (groupId) => {
  console.log("🟡 حذف گروه با GroupId:", groupId);

  if (!window.confirm("آیا مطمئن هستید که می‌خواهید این گروه را حذف کنید؟")) return;

  const formData = new FormData();
  formData.append("Id", String(groupId)); // اضافه کردن ID به فرم دیتا

  DeleteGroupes(formData, {
    onSuccess: async (data) => {
      console.log("گروه با موفقیت حذف شد:", data);
      toast.success("گروه با موفقیت حذف شد");
      await refetchGroup();
    },
    onError: (error) => {
      console.error("خطا در حذف گروه:", error);
      toast.error("خطا در حذف گروه");
    },
  });
  };


  const [PageNumber, setPageNumber] = useState(1);
  const [RowsOfPage, setRowsOfPage] = useState(8);
  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + RowsOfPage;
  const currentItems = groupData?.slice(itemOffset, endOffset);

  const handleWithOutDispatch = (page) => {
    const newOffset = (page.selected * RowsOfPage) % groupData?.length;
    setItemOffset(newOffset);
    setPageNumber(page.selected + 1);
  };

  return (
    <Fragment>
      <div className="d-flex mb-1">
        <Button
          className="p-0 py-1 text-center d-flex align-items-center"
          style={{ width: "100px", direction: "ltr" }}
          color="primary"
          onClick={() => {
            setVariantState("add");
            setGroupId(undefined);
            setShowModal(true);
          }}
        >
          <Plus size={15} />
          <span className="mx-auto">ایجاد گروه</span>
        </Button>
      </div>
      <Card>
        <div className="react-dataTable">
          <Table hover style={{ overflow: "visible" }}>
            <HeaderTable titles={CourseGroups} />
            {currentItems?.length > 0 ? (
              currentItems.map((item, index) => (
                <tbody key={index}>
                  <tr className="text-center">
                    <td className="p-0">{item.groupName}</td>
                    <td className="p-0">{item.teacherName}</td>
                    <td className="p-0">{item.groupCapacity}</td>
                    <td>
                      <UncontrolledDropdown direction="start">
                        <DropdownToggle
                          className="icon-btn hide-arrow text-primary"
                          color="transparent"
                          size="sm"
                          caret
                        >
                          <MoreVertical size={15} />
                        </DropdownToggle>
                        <DropdownMenu className="d-flex flex-column p-0">
                          <DropdownItem
                            onClick={() => {
                              setVariantState("edit");
                              setGroupId(item.groupId);
                              setShowModal(true);
                            }}
                          >
                            <Edit className="me-50" size={15} />
                            <span className="align-middle">ویرایش</span>
                          </DropdownItem>
                          <DropdownItem divider className="p-0 m-0" />
                          <DropdownItem
                            onClick={() => deleteGroup(item.groupId)}
                          >
                            <Delete className="me-50" size={15} />
                            <span className="align-middle">حذف</span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                </tbody>
              ))
            ) : (
              <tbody>
                <tr>
                  <td colSpan="4" className="text-center">
                    گروهی پیدا نشد
                  </td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
      </Card>
      <ModalGroup
        setShowModal={setShowModal}
        showModal={showModal}
        refetchGroup={refetchGroup}
        groupId={groupId}
        variant={variantState}
        groupData={
          variantState === "edit"
            ? groupData.find((g) => g.groupId === groupId)
            : null
        }
      />
      <CustomPagination
        total={groupData?.length || 0}
        current={PageNumber - 1}
        rowsPerPage={RowsOfPage}
        handleClickFunc={handleWithOutDispatch}
      />
    </Fragment>
  );
};

export default CoursesGroups;
