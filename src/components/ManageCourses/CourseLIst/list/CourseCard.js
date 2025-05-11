import classNames from "classnames";
import { Badge, Card, CardBody, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { Calendar, ShoppingCart, User } from "react-feather";
import HandleIdentityEditorJs from "../../../../utility/create-editorjs-blocks/IdentityEditorJs";
import ImageFallback from "../../../../@core/components/image-fallback";
import fallback from "../../../../assets/images/element/CourseImage.jpg"
import ChangeStatusButton from "../../../../@core/components/products-list/ChangeStatusButton";

const CourseCard = ({ activeView, item, handleActiveOrDetective }) => {
  const renderProducts = () => (
    <Row className="mt-2">
      {item.map((item, index) => (
        <Col key={index} md="4" sm="6" xs="12" className="d-flex">
          <Card className="ecommerce-card d-flex flex-column w-100">
            <ChangeStatusButton
              handleActiveOrDetective={handleActiveOrDetective}
              id={item.courseId}
              status={item.isActive}
            />
            <Link to={`/courses/${item.courseId}`}>
              <div className="item-img text-center p-0" style={{ height: "200px", width: "100%" }}>
                <ImageFallback
                  src={item.tumbImageAddress}
                  className="img-fluid card-img-top w-100 h-100"
                  fallback={fallback}
                />
              </div>
            </Link>
            <CardBody className="flex-grow-1 d-flex flex-column">
              <div className="text-body">
                <h4 className="mt-75 text-truncate">{item.title}</h4>
                <p
                  className="item-description overflow-hidden text-wrap text-primary"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '3.5em',
                  }}
                >
                  <HandleIdentityEditorJs desc={item?.describe} />
                </p>
                <div className="d-flex justify-content-between mb-1">
                  <div>
                    <User size={18} color="#716c83" />
                    <span style={{ color: "#716c83", marginRight: "4px" }}>{item.fullName}</span>
                  </div>
                  <div>
                    <span style={{ color: "#716c83", marginLeft: "4px" }}>{item.reserveCount}</span>
                    <ShoppingCart size={18} color="#716c83" />
                  </div>
                </div>
                <div>
                <div className="border border-secendery"></div>
                <div className="d-flex justify-content-between align-item-center mt-1">
                    <div className="d-flex align-items-center">
                        <Calendar size={18} color="#716c83" />
                        <h6 className="mb-0 ml-1" style={{ marginRight: "6px" }}>
                          {item?.lastUpdate?.slice(0, 10)}
                        </h6>
                      </div>
                      <Badge
                        pill
                        color={
                          item.statusName === "شروع ثبت نام"
                            ? "light-primary"
                            : item.statusName === "درحال برگزاری"
                            ? "light-success"
                            : "light-warning"
                        }
                      >
                        {item.statusName}
                      </Badge>
                </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );

  return (
    <>
      {item?.length ? (
        <div className={classNames({ "grid-view": activeView === "grid", "list-view": activeView === "list" })}>
          {renderProducts()}
        </div>
      ) : (
        <div className="mx-auto my-5 content-body text-center">دوره‌ای وجود ندارد</div>
      )}
    </>
  );
};

export default CourseCard;
