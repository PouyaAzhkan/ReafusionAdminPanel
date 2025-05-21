import {
    Modal,
    Button,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
} from "reactstrap";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { Fragment, useState } from "react";
import { columns } from "./HomeWorksColumns";
import ReactPaginate from "react-paginate";
import { getSessionHomeWorks } from "../../../@core/Services/Api/HomeWorks/HomeWorks";
import AddHomeWorkModal from "./AddHomeWorkModal";

const CustomHeader = () => null;

const HomeWorksModal = ({ open, handleModal, sessionId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [openAddHomeWorkModal, setOpenAddHomeWorkModal] = useState(false);
    const rowsPerPage = 6;
    const { data, isLoading, isError, refetch } = getSessionHomeWorks(sessionId);

    if (open === true) {
        console.log("session home work is :", data);
    }

    const handleAddHomeWorkModal = () => {
        setOpenAddHomeWorkModal(!openAddHomeWorkModal);
    };

    // handle close modal
    const handleCloseModal = () => {
        handleModal();
    };

    const handlePagination = (page) => {
        setCurrentPage(page.selected + 1);
    };

    // table
    const replies = Array.isArray(data) ? data : data ? [data] : [];
    const totalRows = replies.length;
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedReplies = replies.slice(startIndex, startIndex + rowsPerPage);

    const CustomPagination = () => {
        const pageCount = Math.max(1, Math.ceil(totalRows / rowsPerPage));
        return (
            <ReactPaginate
                previousLabel={"قبلی"}
                nextLabel={"بعدی"}
                activeClassName="active"
                forcePage={currentPage - 1}
                onPageChange={handlePagination}
                pageCount={pageCount}
                pageClassName={"page-item"}
                nextLinkClassName={"page-link"}
                nextClassName={"page-item next"}
                previousClassName={"page-item prev"}
                previousLinkClassName={"page-link"}
                pageLinkClassName={"page-link"}
                containerClassName={"pagination react-paginate justify-content-end my-2 pe-1"}
                disabledClassName={"disabled"}
            />
        );
    };

    return (
        <Fragment>
            <Modal
                isOpen={open}
                toggle={handleCloseModal}
                className="modal-dialog-centered modal-lg"
            >
                <ModalHeader toggle={handleCloseModal}></ModalHeader>
                <ModalBody className="pb-5 px-1 mx-50" style={{ overflow: "visible" }}>
                    <h1 className="text-center mb-1">تکلیف‌های جلسه</h1>
                    <Card style={{ overflow: "visible" }}>
                        <div className="react-dataTable" style={{ overflow: "visible" }}>
                            <DataTable
                                noHeader
                                subHeader
                                sortServer
                                pagination
                                responsive
                                paginationServer
                                columns={columns()}
                                onSort={() => { }}
                                sortIcon={<ChevronDown />}
                                className="react-dataTable overflow-visible"
                                paginationComponent={CustomPagination}
                                data={paginatedReplies}
                                subHeaderComponent={<CustomHeader />}
                                style={{ minHeight: "200px" }}
                            />
                        </div>
                    </Card>
                </ModalBody>
                <ModalFooter className="justify-content-between">
                    <Button onClick={handleAddHomeWorkModal} type="submit" className="me-1 mt-2" color="primary">
                        افزودن تکلیف
                    </Button>
                    <Button
                        type="button"
                        className="mt-2"
                        color="secondary"
                        outline
                        onClick={handleCloseModal}
                    >
                        انصراف
                    </Button>
                </ModalFooter>
            </Modal>

            <AddHomeWorkModal
                open={openAddHomeWorkModal}
                handleModal={handleAddHomeWorkModal}
                sessionId={sessionId}
                refetchHomeWorks={refetch}
            />
        </Fragment>
    );
};

export default HomeWorksModal;