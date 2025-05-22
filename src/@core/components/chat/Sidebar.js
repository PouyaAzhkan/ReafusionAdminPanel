import Avatar from "../../../@core/components/avatar";
import { useDispatch, useSelector } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Search } from "react-feather";
import { InputGroup, InputGroupText, Input } from "reactstrap";
import { useLocation } from "react-router-dom";
import { useGetItem } from "../../../utility/hooks/useLocalStorage";
import { handleQuery } from "../../../components/PanelSupports/store";
import GetUserDetail from "../../Services/Api/chat/GetUserDetail";
import RenderUserChats from "./RenderUserChats";
import { useMutation } from "@tanstack/react-query";
import GetUserImage from "../../Services/Api/chat/GetAdminImage";

const Sidebar = ({ onSelectUser }) => {
  const params = useSelector((state) => state.SupportSlice || {});
  const dispatch = useDispatch();
  const id = useGetItem("id") && useGetItem("id");
  const location = useLocation();

  const { data } = GetUserImage(id);

  const handleSearch = (ev) => {
    const section = location.pathname.toLowerCase() === "/adminsuports";
    dispatch(
      handleQuery({
        query: ev.target.value,
        section,
      })
    );
  };

  return (
    <div className="sidebar-left">
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="chat-fixed-search">
            <div className="d-flex align-items-center w-100">
              <div className="sidebar-profile-toggle">
                <Avatar
                  className="avatar-border"
                  img={data?.currentPictureAddress}
                  status="online"
                  imgHeight="42"
                  imgWidth="42"
                />
              </div>
              <InputGroup className="input-group-merge ms-1 w-100">
                <InputGroupText className="round">
                  <Search className="text-muted" size={14} />
                </InputGroupText>
                <Input
                  value={params.query || ""}
                  className="round"
                  placeholder="جستجو..."
                  onChange={handleSearch}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar
            className="chat-user-list-wrapper list-group"
            options={{ wheelPropagation: false }}
            style={{ height: "480px" }}
          >
            <h4 className="chat-list-title">لیست کاربران</h4>
            <div className="chat-users-list chat-list media-list">
              <RenderUserChats onSelectUser={onSelectUser} />
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
