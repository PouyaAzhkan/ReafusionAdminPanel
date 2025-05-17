import Api from '../../../interceptor'

const GetGroupDetails = async (id) => {
  try {
    const result = await Api.get(
      `/CourseGroup/Details?Id=${id}`
    );
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export default GetGroupDetails;