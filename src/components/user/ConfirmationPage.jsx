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
    if (!booking || !payment) {
      setError("No booking/payment data available.");
      setLoading(false);
      return;
    }

    const generateTicket = async () => {
      try {
       const res = await TicketService.generateTicket(booking.bookingId);
        setTicket(res.data);
      } catch (err) {
        console.error("Ticket generation failed:", err);
        setError("Ticket generation failed. Please ensure payment is completed.");
      } finally {
        setLoading(false);
      }
    };

    generateTicket();
  }, [booking, payment]);

  if (loading) return <p>Loading confirmation details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>
      <div style={{
        border: "2px dashed #333",
        borderRadius: "10px",
        padding: "20px",
        width: "300px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        backgroundColor: "#f9f9f9"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#555" }}>Bus Ticket</h2>

        <p><strong>Ticket ID:</strong> {ticket?.ticketId || "N/A"}</p>
        <p><strong>Issue Date:</strong> {ticket?.issueDate || "N/A"}</p>
        <p><strong>Amount Paid:</strong> ₹{payment?.amount || "N/A"}</p>
        <p><strong>Payment Status:</strong> {payment?.status || "N/A"}</p>

        <button
          onClick={() => navigate("/user/dashboard")}
          style={{
            marginTop: "20px",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#4CAF50",
            color: "white",
            cursor: "pointer"
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}