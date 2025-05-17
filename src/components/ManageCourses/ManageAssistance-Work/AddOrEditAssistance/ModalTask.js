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
} from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DateObject from "react-date-object";
import gregorian_en from "react-date-object/locales/gregorian_en";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import { useDispatch, useSelector } from "react-redux";
import { EditAssWorkFields } from "../../../../@core/constants/assistance-work/EditBuildingFields";
import ChangeMoment from "../../../../utility/moment";
import ModalApiItemList from "../../../../@core/components/modal/ModalApiItemList";
import {
  handleData,
  handlePageNumber,
  handleQuery,
} from "../store/AssistanceCourseSlice";
import { AssistanceWorkValidations } from "../../../../@core/utils/Validation";
import GetAssistanceList from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/GetAssistanceList";
import GetAssistanceDetail from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/GetAssistanceDetail";
import AddAsistance from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/AddAsistance";
import AssWorkTableItems from "../AssWorkTableItems";
import EditAsistance from "../../../../@core/Services/Api/Courses/ManageAssistanceWork/EditAsistance";

const ModalTask = ({ isOpen, toggle, data, refetch, section }) => {
  const dispatch = useDispatch();
  const AssistanceCourseSlice = useSelector(
    (state) => state.AssistanceCourseSlice
  );

  const [assistanceid, setAssistanceId] = useState(null);
  
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

  useEffect(() => {
    if (data) {
      const defaults = EditAssWorkFields(data);
      reset(defaults);
      setAssistanceId(defaults.assistanceId);
    }
  }, [data, reset]);

  const { data: assCourse, isSuccess } = GetAssistanceList();

  useEffect(() => {
    if (isSuccess) {
      dispatch(handleData(assCourse));
    }
  }, [isSuccess, assCourse, dispatch]);

  const { data: assDetails } = GetAssistanceDetail(
    assistanceid ? assistanceid : null
  );

  useEffect(() => {
    if (assistanceid) {
      setValue("assistanceId", assistanceid);
    }
  }, [assistanceid, setValue]);

  const { mutate: create } = AddAsistance();
  const { mutate: update } = EditAsistance()

  const onSubmit = (values) => {
    if (section === "update") {
      update(values, { onSuccess: () => {refetch(), toggle() }});
    } else {
      create(values, { onSuccess: () => {refetch(), toggle()}});
    }
  };
  
  console.log(assDetails?.courseAssistanceDto?.courseName);

  const handleDatePicker = (date) => {
    if (!date) return;
    const gregorianDate = new DateObject(date)
      .convert(gregorian, gregorian_en)
      .format("YYYY-MM-DDTHH:mm:ss");
    setValue("workDate", gregorianDate);
  };

  const [chooseUserModal, setChooseUserModal] = useState(false);
  const toggleChooseUserModal = () => setChooseUserModal((v) => !v);

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
                <Input
                  id="assistanceId"
                  className="text-primary"
                  placeholder="انتخاب دوره"
                  onClick={toggleChooseUserModal}
                  value={assDetails?.courseAssistanceDto?.courseName}
                  invalid={!!errors.assistanceId}
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
              <Col xs={12} className="text-center mt-2 pt-50">
                <Button type="submit" className="me-1" color="primary">
                  {section === "update" ? "ویرایش" : "ساختن"}
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
        PageNumber={AssistanceCourseSlice.PageNumber}
        RowsOfPage={AssistanceCourseSlice.RowsOfPage}
        isOpen={chooseUserModal}
        toggle={toggleChooseUserModal}
        handlePageNumber={handlePageNumber}
        handleQuery={handleQuery}
        modalTitle={"دوره را انتخاب کنید"}
        totalCount={AssistanceCourseSlice.FilteredData?.length}
        headerTitles={["نام دوره", "منتور", "تاریخ ایجاد", "عملیات"]}
      >
        {AssistanceCourseSlice.FilteredData?.map((item, index) => (
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

export default ModalTask