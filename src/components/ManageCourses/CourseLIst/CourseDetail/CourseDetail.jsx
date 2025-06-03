import { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import "@styles/react/apps/app-users.scss";
import { useParams } from "react-router-dom";
import InfoCard from "./InfoCard";
import { CoursesInfo } from "../../../../@core/constants/courses";
import UserTabs from "./Tabs";
import ModalBasic from "./ModalBasic";
import useGetCourseDetailInfo from "../../../../@core/Services/Api/Courses/CourseDetail/GetDetailInfo";
import EditCourse from "./EditCourse";
import GetCreateCourse from "../../../../@core/Services/Api/Courses/CourseDetail/GetCreateCourse";
import GetCourseGroup from "../../../../@core/Services/Api/Courses/CourseDetail/GetCourseGroup";
import ChangeUserReserve from "../../../../@core/Services/Api/Courses/CourseDetail/tabsApi/ManageUser/ChangeUserReserve";
import ActiveOrDeActive from "../../../../@core/Services/Api/Courses/CourseList/ActiveDectiveCourses";
import toast from "react-hot-toast";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CourseDetail = () => {
  const { id } = useParams();
  const [editModal, setEditModal] = useState(false);
  const [centeredModal, setCenteredModal] = useState(false);
  const [refetchChange, setRefetchChange] = useState(false);
  const [userSel, setUserSel] = useState([]);
  const [teacherId, setTeacherId] = useState(null);
  const [active, setActive] = useState("1");

  // the api calls
  const { data: GetCourseInfo, isLoading: GetCourseInfoLoading, error: GetCourseInfoError, refetch } = useGetCourseDetailInfo(id);
  const { data: GetCreateCourses, isLoading: GetCreateCourseLoading, error: GetCreateCourseError } = GetCreateCourse();
  const { data: GetCourseGroupe, isLoading: GetCourseGroupeLoading, error: GetCourseGroupeError, refetch: refetchGroup } = GetCourseGroup(id, teacherId);
  const { mutate, isPending, refetch: ResereveRefetch } = ChangeUserReserve();
  // the api calls end

  // get teacherId from api and used them
  useEffect(() => {
    if (GetCourseInfo && GetCourseInfo.teacherId) {
      setTeacherId(GetCourseInfo.teacherId);
    }
  }, [GetCourseInfo]);

  useEffect(() => {
    if (teacherId) {
      refetchGroup();
    }
  }, [teacherId, refetchGroup]);
  // get teacherId from api and used them finish

  useEffect(() => {
    console.log("GetCourseGroupe Response:", GetCourseGroupe);
    console.log("Teacher ID:", teacherId);
    console.log("Course ID:", id);
    console.log("GetCourseInfo:", GetCourseInfo);
  }, [GetCourseGroupe, teacherId, id, GetCourseInfo]);

  // نمایش اسکلتون در حالت لودینگ
  if (GetCourseInfoLoading || GetCreateCourseLoading || GetCourseGroupeLoading) {
    return (
      <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
        <div className="app-user-view">
          <Row>
            <Col xl="4" lg="5" xs={{ order: 0 }} md={{ order: 0, size: 5 }}>
              {/* اسکلتون برای InfoCard */}
              <Skeleton
                height={700}
                width="100%"
                borderRadius={8}
                className="shadow-sm"
                style={{ marginBottom: "16px" }}
              />
            </Col>
            <Col xl="8" lg="7" xs={{ order: 1 }} md={{ order: 1, size: 7 }}>
              {/* اسکلتون برای UserTabs */}
              <Skeleton
                height={50}
                width="100%"
                borderRadius={8}
                className="shadow-sm"
                style={{ marginBottom: "16px" }}
              />
              <Skeleton
                height={500}
                width="100%"
                borderRadius={8}
                className="shadow-sm"
              />
            </Col>
          </Row>
        </div>
      </SkeletonTheme>
    );
  }

  if (GetCourseInfoError || GetCreateCourseError || GetCourseGroupeError) {
    return <p>خطا در بارگذاری اطلاعات: {GetCourseInfoError?.message || GetCreateCourseError?.message || GetCourseGroupeError?.message}</p>;
  }

  // for open and close modal
  const toggle = () => setEditModal(!editModal);

  const toggleTab = (tab) => {
    if (active !== tab) {
      setActive(tab);
    }
  };
  // for open and close modal end

  // Active and Deactive Courses
  const activeOrDeActive = async () => {
    try {
      const data = {
        active: GetCourseInfo.isActive ? false : true,
        id: GetCourseInfo.courseId,
      };
      await ActiveOrDeActive(data, refetch);
    } catch (error) {
      throw new Error("ERROR: ", error);
    }
  };
  // Active and Deactive Courses finish

  // Change Reserve Course
  const handleChangeReserve = () => {
    const courseGroupId = (Array.isArray(GetCourseGroupe) && GetCourseGroupe.length > 0 ? GetCourseGroupe[0]?.groupId : undefined) || GetCourseInfo?.groupId;
    if (!courseGroupId) {
      console.error("No valid courseGroupId available");
      return;
    }
    if (!userSel.studentId) {
      console.error("No valid studentId available");
      return;
    }
    const data = {
      courseId: GetCourseInfo.courseId,
      courseGroupId,
      studentId: userSel.studentId,
    };
    console.log("Reserve Data:", data);
    mutate(data, {
      onSuccess: (data) => {
        toast.success("این دانش آموز به گروه با موفقیت اضافه شد");
        ResereveRefetch();
        refetchGroup();
        refetch();
        console.log(data);
      },
      onError: (error) => {
        const errorMessage = error?.response?.data?.ErrorMessage?.[0];
        console.log(error);
        toast.error(errorMessage);
      },
    });
  };
  // Change Reserve Course end

  const groupId = Array.isArray(GetCourseGroupe) && GetCourseGroupe.length > 0 ? GetCourseGroupe[0]?.groupId : GetCourseInfo?.groupId;

  return (
    <div className="app-user-view">
      <Row>
        <Col xl="4" lg="5" xs={{ order: 0 }} md={{ order: 0, size: 5 }}>
          <InfoCard
            setEditModal={setEditModal}
            editModal={editModal}
            activeOrDeactive={activeOrDeActive}
            fields={CoursesInfo(GetCourseInfo)}
            detailParams={GetCourseInfo}
            CreateCourse={GetCreateCourses}
            variant={"course"}
            refetch={refetch}
          />
          <EditCourse CreateCourse={GetCreateCourses} isOpen={editModal} toggle={toggle} refetchData={refetch} />
        </Col>
        <Col xl="8" lg="7" xs={{ order: 1 }} md={{ order: 1, size: 7 }}>
          <UserTabs
            active={active}
            toggleTab={toggleTab}
            data={GetCourseInfo}
            centeredModal={centeredModal}
            setCenteredModal={setCenteredModal}
            refetchChange={refetchChange}
            setUserSel={setUserSel}
            groupData={GetCourseGroupe}
            refetchGroup={refetchGroup}
            gropId={groupId}
          />
        </Col>
      </Row>
      <ModalBasic
        centeredModal={centeredModal}
        setCenteredModal={setCenteredModal}
        groupData={GetCourseGroupe}
        id={id}
        changeReserve={handleChangeReserve}
        toggleTab={toggleTab}
        isPending={isPending}
      />
    </div>
  );
};

export default CourseDetail;