import { Fragment, useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import Avatar from "../../../@core/components/avatar";
import { CardText } from "reactstrap";
import { useLocation } from "react-router-dom";
import { useGetItem } from "../../../utility/hooks/useLocalStorage";
import GetUserDetail from "../../Services/Api/chat/GetUserDetail";

const RenderUserChats = ({ onSelectUser }) => {
  const [active, setActive] = useState(null);
  const [chats, setChats] = useState([]);
  const [usersWithChatInfo, setUsersWithChatInfo] = useState([]);
  const location = useLocation();
  const id = useGetItem("id");
  const isAdminRoute = location.pathname.toLowerCase() === "/adminsuports";
  const isTeacherRoute = location.pathname.toLowerCase() === "/teachersupport";

  // Query for Admin or Teacher chat
  const { data, isSuccess } = useQuery({
    queryKey: [isAdminRoute ? "adminChats" : "teacherChats"],
    queryFn: async () => {
      const url = isAdminRoute
        ? "https://682e27a1746f8ca4a47c199e.mockapi.io/AdminChat/AdminPanel"
        : "https://682f175b746f8ca4a47fcad8.mockapi.io/TeacherChat/teacherChat";
      const res = await axios.get(url);
      return res.data || [];
    },
  });

  // Mutation to get user details
  const { mutateAsync: fetchUserDetail } = useMutation({
    mutationKey: ["getUserDetails"],
    mutationFn: GetUserDetail,
  });

  // Load user info from chats
  const loadUserInfo = async () => {
    if (!Array.isArray(data)) return;

    const relevantChats = data.filter((chat) => {
      if (isTeacherRoute) {
         return chat.chatRoom?.filter((msg) => String(msg.teacherId) === String(id));
      }
      return true; // Admin sees all
    });

    const enrichedUsers = await Promise.all(
      relevantChats.map(async (chat) => {
        try {
          const user = await fetchUserDetail(chat.userId);
          return {
            ...user,
            id: chat.userId,
            chatRoom: chat.chatRoom || [],
          };
        } catch (err) {
          return {
            id: chat.userId,
            fName: "نامشخص",
            lName: "",
            currentPictureAddress:
              "../../../assets/images/element/UnKnownUser.jpg",
            status: "offline",
            chatRoom: chat.chatRoom || [],
          };
        }
      })
    );

    setChats(relevantChats);
    setUsersWithChatInfo(enrichedUsers);
  };

  useEffect(() => {
    if (isSuccess) {
      loadUserInfo();
    }
  }, [isSuccess, data]);

  const getLastMessage = (id, field) => {
    const chatData = chats.find((c) => c.userId === id);
    return chatData?.chatRoom?.at(-1)?.[field] || null;
  };

  const handleUserClick = (user) => {
    setActive(user.id);
    onSelectUser?.(user);
  };

  if (!usersWithChatInfo.length) return <div>در حال بارگذاری کاربران...</div>;

  return (
    <Fragment>
      {usersWithChatInfo.map((user) => (
        <li
          key={user.id}
          onClick={() => handleUserClick(user)}
          className={classNames({ active: active === user.id })}
          style={{ cursor: "pointer" }}
        >
          <Avatar
            img={user.currentPictureAddress}
            imgHeight="42"
            imgWidth="42"
            status={user.status || "online"}
          />
          <div className="chat-info flex-grow-1">
            <h5 className="mb-0">
              {user.fName} {user.lName}
            </h5>
            <CardText className="text-truncate">
              {getLastMessage(user.id, "text") || "چتی وجود ندارد"}
            </CardText>
          </div>
          <div className="chat-meta text-nowrap">
            <small className="float-end mb-25 chat-time ms-25">
              {getLastMessage(user.id, "messageTime") || ""}
            </small>
          </div>
        </li>
      ))}
    </Fragment>
  );
};

export default RenderUserChats;
