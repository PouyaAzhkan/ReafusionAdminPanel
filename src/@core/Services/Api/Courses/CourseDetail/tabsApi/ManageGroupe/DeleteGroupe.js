import { useMutation } from "@tanstack/react-query";
import Api from "../../../../../../../@core/Services/interceptor";

const DeleteGroupe = () => {
  return useMutation({
    mutationKey: ['DeleteGroupe'],
    mutationFn: async (formData) => {
      // ارسال فرم دیتا در بدن درخواست DELETE
      const response = await Api.delete(`/CourseGroup`, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData, // ارسال FormData در بدن درخواست
      });

      return response;
    }
  })
}

export default DeleteGroupe;