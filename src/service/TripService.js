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
  },
  updateTrip: async (tripData) => {
  return await axiosInstance.put("/trip/updatetrip", tripData);
}
}


export default TripService;