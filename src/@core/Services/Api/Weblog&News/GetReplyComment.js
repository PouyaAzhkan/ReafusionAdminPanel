import { useQuery } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor'; 

export const GetReplyComment = (commentId) => {
   return useQuery({
     queryKey: ["GetReplyComment", commentId],
     queryFn: async () => {
        const response = await Api.get(`/News/GetAdminRepliesComments?CommentId=${commentId}`);

        return response
     },
      enabled: !!commentId,
   })
}