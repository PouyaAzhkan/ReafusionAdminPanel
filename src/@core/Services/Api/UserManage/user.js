import { api } from "../../interceptor/index";

export async function addRole (roleId, id) {
    try {
      const response = await api.post(`/User/addUserAccess?Enable=true`, {
        roleId: roleId,
        userId: id
      });
      if (!response.ok) {
        // If the response is not ok, throw an error
        throw new Error(`Request failed with status ${response.status}`);
      }
      return response;
    } catch (err) {
      console.error(err);
      throw err; // Re-throw the error to ensure it is caught in useMutation's onError
    }
  };
  

 export async function addUser(data) {
    try { 
        const response = await api.post(`/User/CreateUser`, data)
        return response
    } catch (error) {
        console.log(error);
    }
}

export async function deleteUser(id) {
  try {
      console.log(id)
      const response = await api.delete(`/User/deleteUser`, {
          data: { userId: id }
      })

      return response

  } catch (err) {
      console.log(err)
      return { success: false, message: 'Error deleting user' }
  }
}

export async function recoverUser (id){
    try {
        const response = await api.put(`/User/ReverseToActiveUser`,{
            data: { userId: id }
        }
    )
        return response
    } catch (error) {
        console.log(error);
    }
}


 export async function getDetailUser (id) {
    try{
     
     const response = await api.get(`/User/UserDetails/${id}`)
     return response
 
    } catch{
     return []
    }
 }

export async function getUserList (SortType, SortingCol, Query, PageNumber, RowsOfPage, IsActiveUser, IsDeletedUser, currentRole) {
    try {        
        const response = await api.get(`/User/UserMannage?PageNumber=${PageNumber}&RowsOfPage=${RowsOfPage}&SortingCol=${SortingCol}&SortType=${SortType}&Query=${Query}${IsActiveUser !== null ? `&IsActiveUser=${IsActiveUser}` : ''}${IsDeletedUser !== null ? `&IsDeletedUser=${IsDeletedUser}` : ''}&roleId=${currentRole.value}`)
        return response
    } catch (error) {
        console.log(error);
    }
}

export async function updateUser (data) {
    try{
     
     const response = await api.put(`/User/updateUser`, data)
 
     return response
 
    } catch(err){
     return err.message
    }
 }

 export async function getUserComments(userId){
    try {
        const response = await api.get(`/Course/CommentManagment?userId=${userId}`)
        return response
    } catch (error) {
        console.log(error);
    }
 }