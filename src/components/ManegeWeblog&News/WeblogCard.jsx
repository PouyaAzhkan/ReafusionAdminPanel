import React from "react";
import "../../assets/scss/PanelStayle/ManageWeblogs.scss";
import { Star } from "react-feather";
import {Card, CardBody, CardFooter, CardImg,CardText, CardTitle } from "reactstrap";
import EmptyImageForWeblog from "../../assets/images/element/weblogImage.jpg";
import { Calendar, Eye } from "react-feather";

const WeblogCard = ({ Api }) => {
  return (
    <>
      {Api?.news?.map((item) => (
        
        <Card className="WeblogCard">
          <CardImg className="card-Img" src={ !item.currentImageAddressTumb || item.currentImageAddressTumb === "null"
          ? EmptyImageForWeblog : item.currentImageAddressTumb } alt="card1" />
          {/* بخش ستاره‌ها */}
          <div className="d-flex pt-1 px-2">
            {[...Array(5)].map((_, index) =>
              index < item.currentRate ? (
                <Star key={index} color="#f7d106" size={20} />
              ) : (
                <Star key={index} color="#ccc" size={20} />
              )
            )}
          </div>
          <CardBody className="py-1">
            <CardTitle title={item.title} className="truncate-text text-black m-0">{item.title}</CardTitle>
            <CardText title={item.miniDescribe} className="text-primary line-clamp-3"> {item.miniDescribe} </CardText>
          </CardBody>
          <CardFooter className="d-flex justify-content-between gap-1 text-black">
            <div>
              <Calendar className="text-primary" size={20} />
              <small> {item.insertDate?.slice(0, 10)} </small>
            </div>
            <div>
              <Eye className="text-primary" size={20} />
              <small> {item.currentView} </small>
            </div>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default WeblogCard;
