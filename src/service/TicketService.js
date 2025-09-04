import axiosInstance from "../http-common";

const TicketService ={

  generateTicket: async (bookingId) => {
    return axiosInstance.post(`/ticket/generate/${bookingId}`);
  },
};

export default TicketService;

