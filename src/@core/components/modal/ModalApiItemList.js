import { Card, Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { ListSearchbar } from "../products-list";
import HeaderTable from "../header-table/HeaderTable";
import { useDispatch } from "react-redux";
import CustomPagination2 from "../pagination/index2";

const ModalApiItemList = ({
  isOpen,
  toggle,
  handleQuery,
  totalCount,
  PageNumber,
  RowsOfPage,
  children,
  headerTitles,
  modalTitle,
  handlePageNumber,
}) => {
 const dispatch = useDispatch();

  const handleWithDispatch = (page) => {
    dispatch(handlePageNumber(page.selected + 1));
  };

  return (
    <div className="vertically-centered-modal bg-black">
      <Modal
        className={`modal-dialog-centered modal-lg`}
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader toggle={toggle}></ModalHeader>
        <ModalBody>
          <div className="text-center mb-2">
            <h1 className="mb-1">{modalTitle}</h1>
          </div>
          <ListSearchbar QueryFunction={handleQuery} width={"px-1"} />
          <Card style={{ width: "100%" }}>
            <Table hover>
              <HeaderTable titles={headerTitles} />
              <tbody>{children}</tbody>
            </Table>
          </Card>
        </ModalBody>
        <CustomPagination2
          total={totalCount}
          current={PageNumber}
          rowsPerPage={RowsOfPage}
          handleClickFunc={handleWithDispatch}
        />
      </Modal>
    </div>
  );
};

export default ModalApiItemList;
