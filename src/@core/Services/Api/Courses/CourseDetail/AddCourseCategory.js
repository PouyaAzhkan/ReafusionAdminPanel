import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const AddCourseCategory = (id) => {
  return useMutation({
    mutationKey: ["AddCourseCategory", id],
    mutationFn: async (payload) => {
      const response = await Api.post(`/Course/AddCourseTechnology?courseId=${id}`, payload,
        {
          headers: { "Content-Type": "application/json", },
        }
      );
      return response;
    },
  });
};

export default AddCourseCategory;