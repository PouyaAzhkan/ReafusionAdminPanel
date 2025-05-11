import { Fragment, useEffect, useState } from "react";
import { Edit, Globe, Plus } from "react-feather";
import { useParams } from "react-router-dom";
import { Button, Card, Table } from "reactstrap";
import { SocialGroupsTableTitle } from "../../../../../@core/constants/courses/DetailsTabs";
import HeaderTable from "../../../../../@core/components/header-table/HeaderTable";
import SocialModal from "../../../../../view/SocialCreateModal";
import GetSocialGroupeList from "../../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageSocialGroupe/GetSocialGroupeList";

const SocialGroups = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [variantState, setVariantState] = useState("");
  const [groupId, setGroupId] = useState(undefined);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupsData, setGroupsData] = useState([]);

  const { data, isLoading, error, isSuccess, isRefetching, refetch } = GetSocialGroupeList();

  // فیلتر گروه‌های مرتبط با این دوره
  const getSocialCourseGroups = () => {
    const socialGroupData = data?.filter((item) => item.courseId == id);
    setGroupsData(socialGroupData || []);
  };

  useEffect(() => {
    if (isSuccess) getSocialCourseGroups();
  }, [isSuccess, isRefetching, data]);

  if (isLoading) return <p>در حال بارگذاری گروه‌های مجازی...</p>;
  if (error) return <p>خطا در بارگذاری گروه‌های مجازی</p>;

  return (
    <Fragment>
      <div className="d-flex mb-1">
        <Button
          className="p-0 py-1 text-center d-flex align-items-center"
          style={{ width: "120px", direction: "ltr" }}
          color="primary"
          onClick={() => {
            setVariantState("add");
            setGroupId(undefined);
            setSelectedGroup(null);
            setShowModal(true);
          }}
        >
          <Plus size={15} />
          <span className="mx-auto">ایجاد گروه مجازی</span>
        </Button>
      </div>

      <Card>
        <div className="react-dataTable">
          <Table hover style={{ overflow: "visible" }}>
            <HeaderTable titles={SocialGroupsTableTitle} />
            <tbody>
              {groupsData?.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="text-primary"><Globe /></td>
                  <td className="p-0">{item.groupName}</td>
                  <td className="p-0">{item.groupLink}</td>
                  <td
                    className="text-center text-primary"
                    onClick={() => {
                      setVariantState("edit");
                      setGroupId(item.id);
                      setSelectedGroup(item);
                      setShowModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="align-middle">ویرایش</span>
                    <Edit className="ms-50" size={15} />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
      {groupsData?.length === 0 && (
        <div className="mx-auto my-4 text-center">
          گروهی پیدا نشد
        </div>
      )}

      <SocialModal
        setShowModal={setShowModal}
        showModal={showModal}
        refetchGroup={refetch}
        groupId={groupId}
        data={selectedGroup}
        variant={variantState}
      />
    </Fragment>
  );
};

export default SocialGroups;
