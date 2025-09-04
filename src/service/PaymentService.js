import axiosInstance from "../http-common";

const PaymentService = {
    makePayment: async (paymentDto) => {
    return axiosInstance.post("/payment/make", paymentDto);
  },
};

export default PaymentService;