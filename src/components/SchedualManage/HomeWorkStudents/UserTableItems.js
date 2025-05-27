import { Badge, Button } from "reactstrap";
import fallback from "../../../assets/images/element/UnKnownUser.jpg";
import { Link } from "react-router-dom";

const UserTableItems = ({ item, onSelect, toggle, isSelected }) => {
  if (!item) {
    return (
      <tr>
        <td colSpan="5" className="text-center py-2">
          داده‌ای برای نمایش وجود ندارد
        </td>
      </tr>
    );
  }

  return (
    <tr className="text-center" style={{ whiteSpace: "nowrap" }}>
      <td style={{ width: "150px", padding: "0.5rem" }}>
        <Link
          to={`/users/view/${item.studentId}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{item?.studentName || "بدون نام"}</span>
        </Link>
      </td>
      <td style={{ width: "100px", padding: "0.5rem" }}>
        <Badge color={item.peymentDone ? "light-success" : "light-danger"} pill>
          {item.peymentDone ? "پرداخت شده" : "پرداخت نشده"}
        </Badge>
      </td>
      <td style={{ width: "100px", padding: "0.5rem" }}>
        <Badge
          color={item.notification ? "light-success" : "light-danger"}
          pill
        >
          {item.notification ? "فعال" : "غیرفعال"}
        </Badge>
      </td>
      <td style={{ width: "100px", padding: "0.5rem" }}>
        <Button
          className="p-0 py-1 text-center"
          style={{ width: "120px", float: "left" }}
          color="primary"
          onClick={onSelect}
          disabled={isSelected}
        >
          <span className="mx-auto">
            {isSelected ? "انتخاب‌شده" : "انتخاب"}
          </span>
        </Button>
      </td>
    </tr>
  );
};

export default UserTableItems;