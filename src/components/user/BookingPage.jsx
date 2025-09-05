
import { useNavigate } from "react-router";
import { useLocation } from "react-router";
import { useEffect } from "react";

import { useState } from "react";
import BookingService from "../../service/BookingService";
import PaymentService from "../../service/PaymentService";


export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
  bookingId: stateBookingId,
  selectedSeats: stateSeats,
  userId: stateUserId,
  tripId: stateTripId,
  selectedBus: stateBus
} = location.state || {};

const storedUserId = localStorage.getItem("userId");
const userId = stateUserId || storedUserId;

const [selectedBus, setSelectedBus] = useState(stateBus || null);
const [tripId, setTripId] = useState(stateTripId || null);
const [selectedSeats, setSelectedSeats] = useState(stateSeats || []);

  const [booking, setBooking] = useState(null);
  
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentDone, setPaymentDone] = useState(false);
  const [error, setError] = useState("");

  // Fetch booking on mount
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        if (stateBookingId) {
          const res = await BookingService.getBookingById(stateBookingId);
          const b = res.data;

          setSelectedBus({
            busName: b.busName || "N/A",
            startingTime: b.departureTime || "N/A",
            endingTime: b.arrivalTime || "N/A",
            fare: b.totalPrice / (b.selectedSeats?.length || 1),
            busType: b.busType || "N/A",
            busNumber: b.busNumber || "N/A",
          });

          setTripId(b.tripId);
          setSelectedSeats(b.selectedSeats || []);
          setBooking({
            bookingId: b.bookingId,
            totalPrice: b.totalPrice,
            paymentDone: b.paymentDone,
          });
          setPaymentDone(b.paymentDone);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch booking details.");
      }
    };

    fetchBooking();
  }, [stateBookingId]);

  if (!selectedBus || !tripId || !selectedSeats || !userId) {
    return (
      <p style={{ textAlign: "center", marginTop: "50px", fontSize: "18px" }}>
        No booking data found. Please select bus and seats first.
      </p>
    );
  }

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const handleCreateBooking = async () => {
    const bookingDto = {
      userId: parseInt(userId),
      busId: selectedBus.busId,
      tripId: tripId,
      selectedSeats: selectedSeats,
      bookingDate: getTodayDate(),
      status: "Pending",
      totalPrice: selectedSeats.length * selectedBus.fare,
      paymentDone: false,
    };

    try {
      const res = await BookingService.createBooking(bookingDto);
      if (res.data && res.data.bookingId) {
        setBooking({
          bookingId: res.data.bookingId,
          totalPrice: res.data.totalPrice,
          paymentDone: res.data.paymentDone,
        });
        setError("");
      } else {
        setError("Booking failed: invalid server response.");
      }
    } catch (err) {
      setError("Booking failed. Try again.");
    }
  };

  const handlePayment = async () => {
    if (!booking || !booking.bookingId) {
      setError("Create booking first.");
      return;
    }

    const paymentDto = {
      bookingId: booking.bookingId,
      amount: booking.totalPrice,
      paymentMethod: paymentMethod,
    };

    try {
      const res = await PaymentService.makePayment(paymentDto);
      setPaymentDone(true);
      setBooking({ ...booking, paymentDone: true });
      setError("");
      alert("Payment successful!");
      navigate("/confirmation", { state: { booking: booking, payment: res.data } });
    } catch (err) {
      setError("Payment failed. Try again.");
    }
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case "Credit Card":
      case "Debit Card":
        return (
          <div>
            <input
              type="text"
              placeholder="Card Number"
              value={paymentDetails.cardNumber || ""}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })
              }
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="Expiry (MM/YY)"
              value={paymentDetails.expiry || ""}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, expiry: e.target.value })
              }
              style={{ width: "48%", padding: "10px", marginRight: "4%" }}
            />
            <input
              type="text"
              placeholder="CVV"
              value={paymentDetails.cvv || ""}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, cvv: e.target.value })
              }
              style={{ width: "48%", padding: "10px" }}
            />
          </div>
        );
      case "UPI":
        return (
          <input
            type="text"
            placeholder="Enter UPI ID"
            value={paymentDetails.upiId || ""}
            onChange={(e) =>
              setPaymentDetails({ ...paymentDetails, upiId: e.target.value })
            }
            style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
          />
        );
      case "Net Banking":
        return (
          <>
            <input
              type="text"
              placeholder="Bank Name"
              value={paymentDetails.bankName || ""}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, bankName: e.target.value })
              }
              style={{ width: "48%", padding: "10px", marginRight: "4%", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="Account Number"
              value={paymentDetails.accountNumber || ""}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })
              }
              style={{ width: "48%", padding: "10px", marginBottom: "10px" }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "50px auto",
        padding: "30px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        backgroundColor: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        Booking & Payment
      </h2>

      <div
        style={{
          marginBottom: "20px",
          padding: "15px",
          border: "1px solid #eee",
          borderRadius: "8px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", color: "#555" }}>
          Bus Name: {selectedBus.busName}
        </h3>
        <p style={{ margin: "0", color: "#666" }}>Bus Type: {selectedBus.busType}</p>
        <p style={{ margin: "0", color: "#666" }}>Bus Number: {selectedBus.busNumber}</p>
        <p style={{ margin: "0", color: "#666" }}>Start Time: {selectedBus.startingTime}</p>
        <p style={{ margin: "0", color: "#666" }}>End Time: {selectedBus.endingTime}</p>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>Trip ID: {tripId}</p>
        <p style={{ margin: "5px 0 0 0", color: "#666" }}>
          Seats: {selectedSeats.join(", ")}
        </p>
      </div>

      {!booking && (
        <button
          onClick={handleCreateBooking}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Confirm Booking
        </button>
      )}

      {booking && !paymentDone && !booking.paymentDone && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#555", marginBottom: "15px" }}>Payment</h3>
          <p style={{ fontSize: "16px", marginBottom: "10px" }}>
            Total Price: <strong>₹{booking.totalPrice}</strong>
          </p>

          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginBottom: "15px",
              fontSize: "16px",
            }}
          >
            <option>Credit Card</option>
            <option>Debit Card</option>
            <option>UPI</option>
            <option>Net Banking</option>
          </select>

          {renderPaymentFields()}

          <button
            onClick={handlePayment}
            disabled={!booking.bookingId || booking.totalPrice <= 0}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#2196F3",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Pay
          </button>
        </div>
      )}

      {booking?.paymentDone || paymentDone ? (
        <p
          style={{
            color: "#4CAF50",
            textAlign: "center",
            fontSize: "18px",
            marginTop: "20px",
          }}
        >
          Payment successful! Booking confirmed.
        </p>
      ) : null}

      {error && (
        <p style={{ color: "red", textAlign: "center", marginTop: "20px" }}>{error}</p>
      )}
    </div>
  );
}

