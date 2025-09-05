import axiosInstance from "../http-common";

const UserService = {

    
  getAllUsers : async () => {
    return await  axiosInstance.get("/userdata/allusers");
  },
  getUserById : async (userId) => {
    return await axiosInstance.get(`/userdata/getuser/${userId}`);
  },
  deleteUser : async (id) => {
    return await axiosInstance.delete(`/userdata/deleteuser/${id}`);
  },

  createUser: (userData) => {
    return axiosInstance.post("/userdata/createuser", userData);
  },
updateUser: (userData) => {
    return axiosInstance.put("/userdata/updateuser", userData);
  }

}

export default UserService;