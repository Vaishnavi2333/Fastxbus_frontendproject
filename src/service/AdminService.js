import axiosInstance from "../http-common";


const AdminService = {
  
  
  pendingRequest : async() => {
    return await axiosInstance.get("/admin/pending");
  },
 
  updateBusOperatorStatus: async (busOpId, action) => {
    
    return await axiosInstance.put(`/admin/${action}/${busOpId}`);
  },


};

export default AdminService;