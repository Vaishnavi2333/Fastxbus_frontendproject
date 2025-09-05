import axiosInstance from "../http-common";

const BusOperatorService ={

    getAllBusOp : async () => {
    return await axiosInstance.get("busopdata/getall");
  },

  deleteBusOp : async (id) => {
    return await axiosInstance.delete(`busopdata/delete/${id}`);
  },

  getBusOpById : async (operatorId) => {
    return  await axiosInstance.get(
        `busopdata/getbyid/${operatorId}`
      );
  },

createBusOp: async(data) => {
    return await axiosInstance.post("/busopdata/add", data);
  },


  updateBusOp: async (data) => {
    return await axiosInstance.put("/busopdata/update", data);
  },

};

export default BusOperatorService;