import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Col,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DateObject from "react-date-object";
import gregorian_en from "react-date-object/locales/gregorian_en";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import { EditAssWorkFields } from "../../../../@core/constants/assistance-work/EditBuildingFields";
import ChangeMoment from "../../../../utility/moment";
import ModalApiItemList from "../../../../@core/components/modal/ModalApiItemList";
import { AssistanceWorkValidations } from "../../../../@core/utils/Validation";
import GetAssistanceList from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/GetAssistanceList";
import GetAssistanceDetail from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/GetAssistanceDetail";
import AddAsistance from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/AddAsistance";
import EditAsistance from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/EditAsistance";
import AssWorkTableItems from "../AssWorkTableItems";

const ModalTask = ({ isOpen, toggle, data, refetch, section, id }) => {
  const [assistanceId, setAssistanceId] = useState(id);
  const [assistanceParams, setAssistanceParams] = useState({
    PageNumber: 1,
    RowsOfPage: 5,
    Query: "",
  });
  const [selectedCourseName, setSelectedCourseName] = useState("");

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AssistanceWorkValidations),
    defaultValues: {},
  });

  // Fetch assistance list and details
  const {
    data: assCourse,
    isLoading: assCourseLoading,
    error: assCourseError,
  } = GetAssistanceList(assistanceParams);
  const {
    data: assDetails,
    isLoading: assDetailsLoading,
    error: assDetailsError,
  } = GetAssistanceDetail(assistanceId);

  // Log debugging information
  console.log("assistanceId:", assistanceId);
  console.log("assDetails in ModalTask:", assDetails);
  console.log("data in ModalTask:", data);
  console.log("selectedCourseName:", selectedCourseName);

  // Set initial form values and assistanceId
  useEffect(() => {
    if (data) {
      const defaults = EditAssWorkFields(data);
      reset(defaults);
      const initialAssistanceId = data.assistanceId || null;
      setAssistanceId(initialAssistanceId);
      setSelectedCourseName(data.courseName || "");
      console.log("Initial assistanceId set to:", initialAssistanceId);
    } else {
      reset({});
      setSelectedCourseName("");
    }
  }, [data, reset]);

  // Update form with selected assistanceId and courseName
  useEffect(() => {
    if (assistanceId) {
      setValue("assistanceId", assistanceId);
      // Find course name from assCourse or assDetails
      const selectedCourse = assCourse?.find(
        (course) => course.id === assistanceId
      );
      const courseName =
        selectedCourse?.courseName ||
        assDetails?.courseName ||
        data?.courseName ||
        "";
      setSelectedCourseName(courseName);
      console.log(
        "Form assistanceId updated to:",
        assistanceId,
        "CourseName:",
        courseName
      );
    } else {
      setSelectedCourseName("");
    }
  }, [assistanceId, assCourse, assDetails, setValue, data]);

  // API mutations
  const { mutate: create, isPending: CreactPending } = AddAsistance();
  const { mutate: update, isPending: UpdatePending } = EditAsistance();

  // Form submission
  const onSubmit = (values) => {
    if (section === "update") {
      update(values, {
        onSuccess: () => {
          refetch();
          toggle();
        },
      });
    } else {
      create(values, {
        onSuccess: () => {
          refetch();
          toggle();
        },
      });
    }
  };

  // Date picker handler
  const handleDatePicker = (date) => {
    if (!date) return;
    const gregorianDate = new DateObject(date)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DDTHH:mm:ss");
    setValue("workDate", gregorianDate);
  };

  // Modal for choosing assistance
  const [chooseUserModal, setChooseUserModal] = useState(false);
  const toggleChooseUserModal = () => setChooseUserModal((v) => !v);

  // Pagination and query handlers
  const handlePageNumber = (page) => {
    setAssistanceParams((prev) => ({ ...prev, PageNumber: page }));
  };

  const handleQuery = (query) => {
    setAssistanceParams((prev) => ({ ...prev, Query: query }));
  };

  // Loading and error handling
  if (assCourseLoading || assDetailsLoading) {
    return <p>در حال بارگذاری...</p>;
  }
  if (assCourseError || assDetailsError) {
    console.log("Error in ModalTask:", { assCourseError, assDetailsError });
    return <p>خطا در بارگذاری داده‌ها</p>;
  }

  return (
    <Fragment>
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="modal-dialog-centered modal-base"
      >
        <ModalHeader className="bg-transparent" toggle={toggle}></ModalHeader>
        <ModalBody className="px-sm-5 mx-50 pb-5">
          <div className="text-center mb-2">
            <h1 className="mb-1">
              {section === "update" ? "ویرایش تسک" : "ساخت تسک"}
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="gy-1 pt-75">
              <Col md="12" className="mb-1">
                <Label className="form-label" for="worktitle">
                  نام تسک
                </Label>
                <Controller
                  name="worktitle"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="worktitle"
                      className="text-primary"
                      placeholder="نام تسک"
                      {...field}
                      invalid={!!errors.worktitle}
                    />
                  )}
                />
                <FormFeedback>{errors.worktitle?.message}</FormFeedback>
              </Col>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="workDescribe">
                  توضیحات تسک
                </Label>
                <Controller
                  name="workDescribe"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="workDescribe"
                      className="text-primary"
                      placeholder="توضیحات تسک"
                      {...field}
                      invalid={!!errors.workDescribe}
                    />
                  )}
                />
                <FormFeedback>{errors.workDescribe?.message}</FormFeedback>
              </Col>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="assistanceId">
                  دوره
                </Label>
                <Controller
                  name="assistanceId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="assistanceId"
                      placeholder="انتخاب دوره"
                      onClick={toggleChooseUserModal}
                      value={selectedCourseName || data?.courseName}
                      invalid={!!errors.assistanceId}
                      className="form-control text-primary cursor-pointer"
                      readOnly
                    />
                  )}
                />
                <FormFeedback>{errors.assistanceId?.message}</FormFeedback>
              </Col>
              <Col md="12" className="mb-1">
                <Label className="form-label" for="workDate">
                  تایم تسک
                </Label>
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  containerStyle={{ width: "100%" }}
                  format="YYYY/MM/DD"
                  onChange={handleDatePicker}
                  style={{
                    width: "100%",
                    height: "39px",
                    paddingLeft: "14px",
                    paddingRight: "14px",
                  }}
                  className="datePicker"
                  value={ChangeMoment(
                    watch("workDate"),
                    "YYYY/MM/DD",
                    "persian"
                  )}
                />
              </Col>
              <Col xs="12" className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="primary" disabled={CreactPending || UpdatePending}>
                  {section === "update" ? "ویرایش" : "ساختن"} {CreactPending || UpdatePending && <Spinner size="sm" color="light" />}
                </Button>
                <Button type="reset" color="secondary" outline onClick={toggle}>
                  لغو
                </Button>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>

      <ModalApiItemList
        PageNumber={assistanceParams.PageNumber}
        RowsOfPage={assistanceParams.RowsOfPage}
        isOpen={chooseUserModal}
        toggle={toggleChooseUserModal}
        handlePageNumber={handlePageNumber}
        handleQuery={handleQuery}
        modalTitle={"دوره را انتخاب کنید"}
        totalCount={assCourse?.length || 0} // اصلاح خطای سینتکسی
        headerTitles={["نام دوره", "منتور", "تاریخ ایجاد", "عملیات"]}
      >
        {assCourse?.map((item, index) => (
          <AssWorkTableItems
            key={index}
            item={item}
            toggle={toggleChooseUserModal}
            setId={setAssistanceId}
          />
        ))}
      </ModalApiItemList>
    </Fragment>
  );
};

export default ModalTask;