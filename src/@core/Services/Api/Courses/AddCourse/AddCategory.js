import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../@core/Services/interceptor";

const AddCategory = (courseId, selectedTech) => {
  return useMutation({
    mutationKey: ["AddCategory", courseId, selectedTech],
    mutationFn: async () => {
      const response = await Api.post(`/Course/AddCourseTechnology?courseId=${courseId}`, selectedTech);

      return response;
    },
  });
};

export default AddCategory;