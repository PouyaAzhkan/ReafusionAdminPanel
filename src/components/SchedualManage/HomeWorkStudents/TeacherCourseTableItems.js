import { Badge, Button } from "reactstrap";
import { Link } from "react-router-dom";

const TeacherCourseTableItems = ({ item, setId, toggle }) => {
  const courseId = item.courseId || item.id;

  return (
    <tr className="text-center" style={{ whiteSpace: "nowrap" }}>
      <td style={{ width: "280px", padding: "0.5rem" }}>
        <Link
          to={`/courses/${courseId}`}
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
      <td>
        <Button
          className="p-0 py-1 text-center bg-black"
          style={{ width: "120px", float: "left" }}
          color="primary"
          onClick={() => {
            setId(courseId);
            toggle();
          }}
        >
          انتخاب
        </Button>
      </td>
    </tr>
  );
};

export default TeacherCourseTableItems;
