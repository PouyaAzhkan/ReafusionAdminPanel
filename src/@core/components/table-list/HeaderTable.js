import { Row, Col, Input, Button } from "reactstrap";
import { useDispatch } from "react-redux";

// Styles
import "@styles/react/libs/react-select/_react-select.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";

const HeaderTable = ({
  toggleSidebar,
  handleRowOfPage,
  rowOfPage,
  buttonText,
  isCreate = true,
  isSearching = true,
  handleSearch, // این در واقع handleQuery است
}) => {
  const dispatch = useDispatch();

  return (
    <Row className="w-100 mx-0 my-2">
      <Col xl="6" className="d-flex align-items-center">
        <div className="d-flex align-items-center w-100">
          <label htmlFor="rows-per-page">نمایش</label>
          <Input
            className="mx-50 text-primary"
            type="select"
            id="rows-per-page"
            value={rowOfPage}
            onChange={(e) => handleRowOfPage(Number(e.target.value))}
            style={{ width: "5rem" }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </Input>
        </div>
      </Col>
      <Col
        xl="6"
        className="d-flex align-items-center justify-content-end gap-75"
      >
        {isSearching && (
          <Input
            style={{ width: "300px" }}
            id="searchBox"
            className="text-primary"
            placeholder="جستجو ..."
            onChange={(e) => {
              e.preventDefault();
              dispatch(handleSearch(e.target.value));
            }}
          />
        )}
        {isCreate && (
          <Button
            className="add-new-user"
            color="primary"
            onClick={toggleSidebar}
          >
            {buttonText}
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default HeaderTable;