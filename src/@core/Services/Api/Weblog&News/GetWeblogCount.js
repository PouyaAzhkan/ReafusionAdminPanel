import { useQuery } from "@tanstack/react-query";
import Api from '../../../../@core/Services/interceptor';

export const GetCount = ({ isActive, pageNumber, rowsOfPage }) => {
  return useQuery({
    queryKey: ["GetCount", isActive, pageNumber, rowsOfPage],
    queryFn: async () => {
      const response = await Api.get(
        `/News/AdminNewsFilterList`, {
          params: {
            PageNumber: pageNumber,
            RowsOfPage: rowsOfPage,
            SortingCol: "InsertDate",
            SortType: "DESC",
            Query: "",
            IsActive: isActive
          }
        }
      );
      return response;
    }
  });
};
