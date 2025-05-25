import { useState } from "react";
import "@styles/base/pages/app-chat.scss";
import "@styles/base/pages/app-chat-list.scss";
import Sidebar from "../../@core/components/chat/Sidebar";
import ChatLog from "../../@core/components/chat/Chat";

const TeacherSupport = () => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="chat-application d-flex">
      <Sidebar onSelectUser={setSelectedUser} />
      <div className="content-right">
        <div className="content-wrapper h-100">
          <div className="content-body h-100">
            <ChatLog selectedUser={selectedUser} role="teacher"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSupport;
