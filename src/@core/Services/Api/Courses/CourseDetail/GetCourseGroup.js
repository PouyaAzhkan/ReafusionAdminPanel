import { useQuery } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";
// import { boolean } from "yup";

const GetCourseGroup = (id, teacherId) => {
  return useQuery({
    queryKey: ["GetCourseGroup", id, teacherId],
    queryFn: async () => {
      const response = await Api.get(`/CourseGroup/GetCourseGroup?TeacherId=${teacherId}&CourseId=${id}`);
      return response;
    },
    enabled: Boolean(id && teacherId), // فقط زمانی اجرا شود که هر دو مقدار معتبر باشند
  });
};

export default GetCourseGroup;