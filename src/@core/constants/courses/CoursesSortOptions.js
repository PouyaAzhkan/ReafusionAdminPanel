import { handleSortingCol, handleSortType } from "../../../components/ManageCourses/CourseLIst/store/CourseList";

const coursesSortOption = [
  {
    Options: [
      { value: "lastUpdate", label: "جدیدترین" },
      { value: "cost", label: "بیشترین قیمت" },
    ],
    setState: handleSortingCol,
  },
  {
    Options: [
      { value: "ASC", label: "صعودی" },
      { value: "DESC", label: "نزولی" },
    ],
    setState: handleSortType,
  },
];

export default coursesSortOption;
