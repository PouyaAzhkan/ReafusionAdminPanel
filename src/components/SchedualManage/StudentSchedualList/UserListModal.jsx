import { Fragment, useState } from "react";
import { Input, Modal, ModalBody, ModalHeader } from "reactstrap";
import ModalApiItemList from "../../../@core/components/modal/ModalApiItemList";
import { GetUserList } from "./../../../@core/Services/Api/UserManage/user";
import UserTableItems from "./UserTableItems";

const UserListModal = ({ isOpen, toggle, onSelectUser, selectedUserId }) => {
    const [userListParams, setUserListParams] = useState({
        PageNumber: 1,
        RowsOfPage: 6,
        Query: "",
    });

    const { data: users, isLoading: usersLoading, error: usersError } = GetUserList(userListParams);

    const handleQueryUser = (query) => {
        setUserListParams((prev) => ({ ...prev, Query: query, PageNumber: 1 }));
    };

    const handleUserPageNumber = (page) => {
        setUserListParams((prev) => ({ ...prev, PageNumber: page }));
    };

    const handleSelectUser = (id) => {
        if (typeof onSelectUser === "function") {
            onSelectUser(id);
            toggle();
        } else {
            console.warn("onSelectUser is not a function");
        }
    };

    const userTableHeader = ["", "نام کاربر", "وضعیت", "دانشجو", "عملیات"];

    if (usersLoading) return <p>در حال بارگذاری...</p>;
    if (usersError) {
        console.error("خطای API کاربران:", usersError);
        return <p>خطا در بارگذاری کاربران</p>;
    }

    return (
        <Fragment>
            <Modal isOpen={isOpen} toggle={toggle} className="modal-dialog-centered">
                <ModalHeader toggle={toggle}>انتخاب دانشجو</ModalHeader>
                <ModalBody>
                    <Input
                        placeholder="جستجوی دانشجو..."
                        onChange={(e) => handleQueryUser(e.target.value)}
                        className="mb-2"
                    />
                    <ModalApiItemList
                        PageNumber={userListParams.PageNumber}
                        RowsOfPage={userListParams.RowsOfPage}
                        isOpen={isOpen}
                        toggle={toggle}
                        handlePageNumber={handleUserPageNumber}
                        handleQuery={handleQueryUser}
                        modalTitle={"انتخاب دانشجو"}
                        totalCount={users?.totalCount || 0}
                        headerTitles={userTableHeader}
                    >
                        {!users?.listUser ? (
                            <tr>
                                <td colSpan="5" className="text-center py-2">
                                    کاربران بارگذاری نشدند
                                </td>
                            </tr>
                        ) : !Array.isArray(users.listUser) || users.listUser.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center py-2">
                                    هیچ کاربری یافت نشد
                                </td>
                            </tr>
                        ) : (
                            users.listUser.map((item, index) => (
                                <UserTableItems
                                    item={item}
                                    toggle={toggle}
                                    key={item.id || index}
                                    onSelect={() => handleSelectUser(item.id)}
                                    isSelected={selectedUserId === item.id}
                                />
                            ))
                        )}
                    </ModalApiItemList>
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

export default UserListModal;