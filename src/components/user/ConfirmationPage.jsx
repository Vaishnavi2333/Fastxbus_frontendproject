import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import TicketService from "../../service/TicketService";

export function ConfirmationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, payment } = location.state || {};

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!booking || !payment || !booking.bookingId) {
      setError("No booking/payment data available.");
      setLoading(false);
      return;
    }

    const generateTicket = async () => {
      try {
        const res = await TicketService.generateTicket(booking.bookingId);

        const mergedTicket = {
          ticketId: res.data.ticketId || booking.bookingId,
          issueDate: res.data.issueDate || new Date().toISOString().split("T")[0],
          busName: res.data.busName || booking.busName || "N/A",
          origin: res.data.origin || booking.origin || "N/A",
          destination: res.data.destination || booking.destination || "N/A",
          date: res.data.date || booking.date || "N/A",
          tripId: res.data.tripId || booking.tripId || "N/A",
          selectedSeats: booking.selectedSeats || [],
          amountPaid: payment.amount || 0,
          paymentStatus: payment.status || "Pending",
        };

        setTicket(mergedTicket);
      } catch (err) {
        console.error("Ticket generation failed:", err);
        setError("Ticket generation failed. Please ensure payment is completed.");
      } finally {
        setLoading(false);
      }
    };

    generateTicket();
  }, [booking, payment]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "#333" }}>
        Loading confirmation details...
      </p>
    );
  if (error)
    return (
      <p style={{ textAlign: "center", marginTop: "50px", color: "red" }}>
        {error}
      </p>
    );

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
      <div
        style={{
          width: "360px",
          border: "2px solid #333",
          borderRadius: "10px",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        }}
      >
        
        <div style={{ backgroundColor: "#222", color: "#fff", padding: "15px", textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>🎟️ Bus Ticket</h2>
          <p style={{ margin: "5px 0 0 0", fontSize: "14px" }}>Ticket ID: {ticket?.ticketId}</p>
        </div>

        
        <div style={{ padding: "15px", color: "#333" }}>
          <div style={{ marginBottom: "10px" }}>
            <strong>Bus:</strong> {ticket?.busName}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>From:</strong> {ticket?.origin} <span style={{ float: "right" }}><strong>To:</strong> {ticket?.destination}</span>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Journey Date:</strong> {ticket?.date}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Trip ID:</strong> {ticket?.tripId}
          </div>

          
          <div style={{ borderTop: "1px dashed #333", margin: "10px 0" }}></div>

          <div style={{ marginBottom: "10px" }}>
            <strong>Seats:</strong> {ticket?.selectedSeats?.length ? ticket.selectedSeats.join(", ") : "N/A"}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Amount Paid:</strong> ₹{ticket?.amountPaid}
          </div>
          <div style={{ marginBottom: "10px" }}>
            <strong>Payment Status:</strong> {ticket?.paymentStatus}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Issue Date: {ticket?.issueDate}
          </div>
        </div>

        
        <div
          style={{
            backgroundColor: "#f2f2f2",
            padding: "10px",
            textAlign: "center",
            borderTop: "1px dashed #333",
          }}
        >
          <button
            onClick={() => navigate("/user/dashboard")}
            style={{
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
