import axiosInstance from "../http-common";

const TripService ={

     getAllTrips: async () => {
    return await axiosInstance.get("/trip/getalltrips");
  },

 
  deleteTrip: async (tripId) => {
    return await axiosInstance.delete(`/trip/delete/${tripId}`);
  },

  addTrip : async(trip)=>{
    return await axiosInstance.post("/trip/addtrip", trip);
  },

  getTripById : async () =>{
    return await axiosInstance.get(`/trip/by-operator`);
  }
}


export default TripService;