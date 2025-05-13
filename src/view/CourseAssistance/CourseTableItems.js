import { Badge, Button } from "reactstrap";
import fallback from "../../assets/images/element/CourseImage.jpg";
import { Link } from "react-router-dom";

const CourseTableItems = ({ item, setId, toggle }) => {
  return (
    <tr className="text-center" style={{ whiteSpace: "nowrap" }}>
      <td style={{ width: "60px", padding: "0.5rem" }}>
        <img
          src={item.tumbImageAddress || fallback}
          alt={item.title || "تصویر دوره"}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            display: "block",
            margin: "0 auto",
          }}
          onError={(e) => {
            e.target.src = fallback;
            console.error("خطا در بارگذاری تصویر:", item.tumbImageAddress);
          }}
        />
      </td>
      <td style={{ width: "280px", padding: "0.5rem" }}>
        <Link
          to={`/courses/${item.courseId || item.id}`}
          className="user_name text-truncate text-body"
        >
          <span className="fw-bolder">{item.title || "بدون عنوان"}</span>
        </Link>
      </td>
      <td style={{ width: "100px", padding: "0.5rem" }}>
        <Badge color={item.isActive ? "light-success" : "light-danger"} pill>
          {item.isActive ? "فعال" : "غیرفعال"}
        </Badge>
      </td>
      <td style={{ padding: "0.5rem" }}>
        <Button
          className="p-0 py-1 text-center bg-black"
          style={{ width: "120px", float: "left" }}
          color="primary"
          onClick={() => {
            setId(item.courseId || item.id); // سازگار با هر دو فرمت داده
            toggle(); // بستن مودال
          }}
        >
          <span className="mx-auto">انتخاب</span>
        </Button>
      </td>
    </tr>
  );
};

export default CourseTableItems;