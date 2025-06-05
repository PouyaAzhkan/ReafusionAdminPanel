import { useState, useRef, useEffect } from "react";
import Avatar from "@components/avatar";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
import { MessageSquare, Menu, Send } from "react-feather";
import { Input, Button, InputGroup } from "reactstrap";
import "../../../assets/scss/PanelStayle/Chat.scss";
import AddTeacherMessage from "../../Services/Api/chat/SendTeacherMassage";
import AddAdminMessage from "../../Services/Api/chat/SendMassage";

const ChatLog = ({ selectedUser, role }) => {
  const chatArea = useRef(null);
  const [msg, setMsg] = useState("");
  const [chatRoom, setChatRoom] = useState([]);

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // کلید localStorage جدا برای هر نقش و کاربر
  const storageKey = selectedUser ? `chatRoom_${role}_${selectedUser.id}` : null;

  useEffect(() => {
  if (selectedUser && storageKey) {
    const savedMessages = localStorage.getItem(storageKey);
    if (savedMessages) {
      setChatRoom(JSON.parse(savedMessages));
    } else if (selectedUser.chatRoom) {
       setChatRoom(selectedUser.chatRoom);
    } else {
      setChatRoom([]);
    }
    setMsg("");
  } else {
    setChatRoom([]);
  }
}, [selectedUser, storageKey, role]);


  const handleSend = async () => {
  if (!msg.trim() || !selectedUser) return;

  const newMessage = {
    id: Date.now(),
    userId: selectedUser.id,
    text: msg,
    messageTime: time,
    sender: role,
  };

  const res = role === "teacher"
    ? await AddTeacherMessage({ chatRoom: [...chatRoom, newMessage] })
    : await AddAdminMessage({ chatRoom: [...chatRoom, newMessage] });

  if (res) {
    // فرض کنیم API یک آرایه کامل چت‌های آپدیت شده برمی‌گردونه:
    // اگر API فقط تایید میکنه، باید یه API جدا بگیری که چت‌ها رو دوباره لود کنه
    const updatedChat = res.chatRoom || [...chatRoom, newMessage];

    setChatRoom(updatedChat);

    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(updatedChat));
    }

    setMsg("");
    scrollToBottom();
  }
};

  return (
    <div className="chat-app-window h-100">
      {!selectedUser ? (
        <div className="start-chat-area">
          <div className="start-chat-icon mb-1">
            <MessageSquare />
          </div>
          <h4 className="sidebar-toggle start-chat-text">شروع مکالمه</h4>
        </div>
      ) : (
        <div className="active-chat">
          <div className="chat-navbar">
            <header className="chat-header">
              <div className="d-flex align-items-center">
                <div className="sidebar-toggle d-block d-lg-none me-1">
                  <Menu size={21} />
                </div>
                <Avatar
                  imgHeight="36"
                  imgWidth="36"
                  img={selectedUser.currentPictureAddress}
                  status="online"
                  className="avatar-border user-profile-toggle m-0 me-1"
                />
                <h6 className="mb-0">
                  {selectedUser.fName} {selectedUser.lName}
                </h6>
              </div>
            </header>
          </div>

          <PerfectScrollbar
            ref={chatArea}
            className="user-chats"
            options={{ wheelPropagation: false }}
            style={{ height: "480px" }}
          >
            {chatRoom.length ? (
              <div className="chats">
                {chatRoom.map((chat) => (
                  <div
                    key={chat.id}
                    className={classnames("chat-message", {
                      "chat-message-admin": chat.sender === "admin",
                      "chat-message-teacher": chat.sender === "teacher",
                      "chat-message-user": !["admin", "teacher"].includes(chat.sender),
                    })}
                  >
                    <div className="chat-bubble">
                      <div className="message-text">{chat.text}</div>
                      <div className="message-time">{chat.messageTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </PerfectScrollbar>

          <div className="d-flex">
            <InputGroup className="input-group-merge me-1 form-send-message">
              <Input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="متن خود را وارد کنید..."
                className="text-primary"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
              />
            </InputGroup>
            <Button onClick={handleSend} className="send" color="primary">
              <Send size={14} className="d-lg-none" />
              <span className="d-none d-lg-block">ارسال</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatLog;
