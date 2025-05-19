import React from "react";
import "../../assets/scss/PanelStayle/ManageWeblogs.scss";
import { Star, Calendar, Eye } from "react-feather";
import { Card, CardBody, CardFooter, CardImg, CardText, CardTitle } from "reactstrap";
import { NavLink } from "react-router-dom";
import EmptyImageForWeblog from "../../assets/images/element/weblogImage.jpg";

const WeblogCard = ({ Api }) => {
  return (
    <>
      {Api?.news?.map((item) => (
        <Card key={item.id} className="WeblogCard">
          <NavLink
            to={`/WeblogAndNewsList/${item.id}`}
            onClick={(e) => {
              if (!item.isActive) {
                e.preventDefault()
                alert("این خبر غیر فعال است و امکان مشاهده جزئیات وجود ندارد.")
              }
            }}
          >
            <CardImg
              className="card-Img"
              src={
                !item.currentImageAddressTumb || item.currentImageAddressTumb === "null"
                  ? EmptyImageForWeblog
                  : item.currentImageAddressTumb
              }
              alt={item.title}
            />
          </NavLink>

          {/* امتیاز ستاره‌ای */}
          <div className="d-flex pt-1 px-2">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                color={index < item.currentRate ? "#f7d106" : "#ccc"}
                size={20}
              />
            ))}
          </div>

          <CardBody className="py-1">
            <CardTitle title={item.title} className="truncate-text text-black m-0">
              {item.title}
            </CardTitle>
            <CardText title={item.miniDescribe} className="text-primary line-clamp-3">
              {item.miniDescribe}
            </CardText>
          </CardBody>

          <CardFooter className="d-flex justify-content-between gap-1 text-black">
            <div>
              <Calendar className="text-primary" size={20} />
              <small className="ms-25">{item.insertDate?.slice(0, 10)}</small>
            </div>
            <div>
              <Eye className="text-primary" size={20} />
              <small className="ms-25">{item.currentView}</small>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default WeblogCard;
