import { Row, Col, Input, Button } from "reactstrap";

// Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const HeaderTable2 = ({
  toggleSidebar,
  setScheduleDetails,
  handleRowOfPage,
  rowOfPage,
  buttonText,
  setVariantState,
  isCreate = true,
  isSearching = true,
  handleSearch,
}) => {
  return (
    <Row className="w-100 mx-0 my-2">
      <Col xl="6" className="d-flex align-items-center">
      </Col>
      <Col
        xl="6"
        className="d-flex align-items-center justify-content-end gap-75"
      >
        {isSearching && (
          <Input
            style={{ width: "300px" }}
            placeholder="جستجو ..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        )}
        {isCreate && (
          <Button
            className="add-new-user"
            color="primary"
            onClick={() => {
              toggleSidebar();
              setScheduleDetails("test");
              setVariantState("create");
            }}
          >
            {buttonText}
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default HeaderTable2;
