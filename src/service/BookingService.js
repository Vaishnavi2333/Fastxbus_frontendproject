import axiosInstance from "../http-common";

const BookingService={
    getBookings: async () =>{
    return await axiosInstance.get("/booking/bookings/summary"); 
  },
  refundBooking: async (bookingId) => {
    return await axiosInstance.put(
      `/booking/refund/${bookingId}`,
      null,
      {
        headers: {
          "Content-Type": "text/plain",
          Accept: "text/plain",
        },
        responseType: "text",
      }
    );
  },

  createBooking: async (bookingDto) => {
    return axiosInstance.post("/booking/add", bookingDto);
  },

  getBookingByUser: async(userId) => {
    return  await axiosInstance.get(`/booking/user/${userId}/summary`);
  },

  deleteBooking: async(bookingId) =>{
    return await axiosInstance.delete(`/booking/cancel/${bookingId}`);
  },
   getBookingById : async(bookingId) => {
  return await axiosInstance.get(`booking/get/${bookingId}`);
}

}

export default BookingService;