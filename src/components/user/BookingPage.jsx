
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import axiosInstance from "../../http-common";
import { useState } from "react";
export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const { selectedBus, tripId, selectedSeats, userId: stateUserId } = location.state || {};
  const storedUserId = localStorage.getItem("userId"); 
  const userId = stateUserId || storedUserId;

  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [paymentDone, setPaymentDone] = useState(false);
  const [error, setError] = useState("");

  if (!selectedBus || !tripId || !selectedSeats || !userId) {
    return <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>No booking data found. Please select bus and seats first.</p>;
  }

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleCreateBooking = () => {
    const bookingDto = {
      userId: parseInt(userId),
      busId: selectedBus.busId,
      tripId: tripId,
      selectedSeats: selectedSeats,
      bookingDate: getTodayDate(),
      status: "Pending",
      totalPrice: selectedSeats.length * selectedBus.fare,
      paymentId: 1,
      paymentDone: false,
    };

    axiosInstance
      .post("/booking/add", bookingDto)
      .then((res) => {
        if (res.data && res.data.bookingId) {
          setBooking({
            bookingId: res.data.bookingId,
            totalPrice: res.data.totalPrice,
          });
          setError("");
        } else {
          setError("Booking failed: invalid server response.");
        }
      })
      .catch(() => setError("Booking failed. Try again."));
  };

  const handlePayment = () => {
    if (!booking || !booking.bookingId) {
      setError("Create booking first.");
      return;
    }

    const paymentDto = {
      bookingId: booking.bookingId,
      amount: booking.totalPrice,
      paymentMethod: paymentMethod,
    };

    axiosInstance
      .post("/payment/make", paymentDto)
      .then((res) => {
        setPaymentDone(true);
        setError("");
        alert("Payment successful!");
        navigate("/confirmation", { state: { booking: booking, payment: res.data } });
      })
      .catch(() => setError("Payment failed. Try again."));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "30px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", borderRadius: "12px", backgroundColor: "#fff", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>Booking & Payment</h2>

      <div style={{ marginBottom: "20px", padding: "15px", border: "1px solid #eee", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
        <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>Selected Bus: {selectedBus.busName}</h3>
        <p style={{ margin: "0", color: "#666" }}>Trip ID: {tripId}</p>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>Seats: {selectedSeats.join(", ")}</p>
      </div>

      {!booking && (
        <button
          onClick={handleCreateBooking}
          style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#4CAF50", color: "#fff", fontSize: "16px", cursor: "pointer", marginTop: "10px" }}
        >
          Confirm Booking
        </button>
      )}

      {booking && !paymentDone && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#555", marginBottom: "15px" }}>Payment</h3>
          <p style={{ fontSize: "16px", marginBottom: "10px" }}>Total Price: <strong>₹{booking.totalPrice}</strong></p>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "15px", fontSize: "16px" }}
          >
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>UPI</option>
            <option>Net Banking</option>
          </select>

          <button
            onClick={handlePayment}
            disabled={!booking.bookingId || booking.totalPrice <= 0}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", backgroundColor: "#2196F3", color: "#fff", fontSize: "16px", cursor: "pointer" }}
          >
            Pay
          </button>
        </div>
      )}

      {paymentDone && (
        <p style={{ color: "#4CAF50", textAlign: "center", fontSize: "18px", marginTop: "20px" }}>Payment successful! Booking confirmed.</p>
      )}

      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</p>
      )}
    </div>
  );
}
