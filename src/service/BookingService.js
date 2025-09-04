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
  }

}

export default BookingService;