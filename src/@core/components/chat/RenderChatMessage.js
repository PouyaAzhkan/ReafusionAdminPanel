import classNames from "classnames";
import React, { Fragment } from "react";
import Avatar from "../../../@core/components/avatar";
import { useGetItem } from "../../../utility/hooks/useLocalStorage";
import GetUserDetail from "../../Services/Api/chat/GetUserDetail";
import '../../scss/base/pages/app-chat-list.scss'

const RenderChatMessage = ({ chatRoom, userImage }) => {
  const id = useGetItem("id") && useGetItem("id");

  const { data: supporter, isLoading } = GetUserDetail(id);
  if (isLoading) return <p>در حال بارگزاری پیام ها</p>

  return (
    <Fragment>
      {chatRoom.map((msg, index) => (
        <div
          key={index}
          className={classNames("chat", {
            "chat-left": msg.sender !== "user",
          })}
        >
          <div className="chat-avatar">
            <Avatar
              imgWidth={36}
              imgHeight={36}
              className="box-shadow-1 cursor-pointer"
              img={
                msg.sender !== "user" ? supporter.currentPictureAddress : userImage
              }
              status={'online'}
            />
          </div>

          <div className="chat-body">
            <div className="chat-content">
              <p>{msg.text}</p>
            </div>
          </div>
        </div>
      ))}
    </Fragment>
  );
};

export default RenderChatMessage;
