import { Button } from "reactstrap";
import fallback from "../../assets/images/element/CourseImage.jpg";

const CourseTableItems = ({ item, setId, toggle }) => {
  console.log("Rendering CourseTableItems, item:", item);
  return (
    <tr className="text-center" style={{ whiteSpace: "nowrap" }}>
      <td style={{ width: "100px" }} className="px-0">
        <img
          src={item.tumbImageAddress || fallback}
          alt={item.title || "تصویر دوره"}
          className="w-100 h-100"
          style={{ borderRadius: "15px" }}
          onError={(e) => {
            e.target.src = fallback;
            console.error("خطا در بارگذاری تصویر:", item.tumbImageAddress);
          }}
        />
      </td>
      <td className="px-0" style={{ width: "280px" }}>
        {item.title || "بدون عنوان"}
      </td>
      <td className="px-0" style={{ width: "100px" }}>
        {item.isActive ? "فعال" : "غیر فعال"}
      </td>
      <td>
        <Button
          className="p-0 py-1 text-center bg-black"
          style={{ width: "120px", float: "left" }}
          color="primary"
          onClick={() => {
            setId(item.courseId || item.id); // سازگار با هر دو فرمت داده
            toggle(); // اول آیدی رو تنظیم می‌کنه، بعد مودال رو می‌بنده
          }}
        >
          <span className="mx-auto">انتخاب</span>
        </Button>
      </td>
    </tr>
  );
};

export default CourseTableItems;