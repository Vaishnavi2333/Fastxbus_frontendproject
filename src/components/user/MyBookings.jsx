import { useState,useEffect } from "react";
import { useNavigate } from "react-router";

import BookingService from "../../service/BookingService";


const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No user logged in.");

      const response = await BookingService.getBookingByUser(userId);

      if (response.data && response.data.length > 0) {
        const formattedBookings = response.data.map((booking) => ({
          bookingId: booking.bookingId,
          status: booking.status,
          bookingDate: booking.bookingDate
            ? new Date(booking.bookingDate).toLocaleDateString()
            : "N/A",
          busName: booking.busName || "N/A",
          departureTime: booking.departureTime || "N/A",
          arrivalTime: booking.arrivalTime || "N/A",
          tripId: booking.tripId,
          selectedSeats: booking.seatsBooked || [], 
          totalAmount: booking.totalAmount || 0,
          userId: booking.userId || null,
        }));
        setBookings(formattedBookings);
        setError("");
      } else {
        setBookings([]);
        setError("No bookings found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  
  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await BookingService.deleteBooking(bookingId);
      alert(`Booking ${bookingId} has been cancelled.`);
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
    }
  };

  const handleResume = async (bookingId) => {
    try {
      const res = await BookingService.getBookingById(bookingId);
      const booking = res.data;

      if (!booking || !booking.selectedSeats || booking.selectedSeats.length === 0) {
        alert("Cannot resume: No seat info found.");
        return;
      }

      navigate("/booking", {
        state: {
          bookingId: booking.bookingId,
          selectedBus: {
            busName: booking.busName,
            departureTime: booking.departureTime,
            arrivalTime: booking.arrivalTime,
            fare: booking.totalAmount / booking.selectedSeats.length,
          },
          tripId: booking.tripId,
          selectedSeats: booking.selectedSeats,
          userId: booking.userId,
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch booking details.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2>My Bookings</h2>
      {error && <p className="text-danger">{error}</p>}
      {!error && bookings.length > 0 && (
        <ul className="list-group">
          {bookings.map((booking) => (
            <li
              key={booking.bookingId}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>Booking ID:</strong> {booking.bookingId} <br />
                <strong>Status:</strong> {booking.status} <br />
                <strong>Date:</strong> {booking.bookingDate} <br />
                <strong>Bus Name:</strong> {booking.busName} <br />
                <strong>Departure Time:</strong> {booking.departureTime} <br />
                <strong>Arrival Time:</strong> {booking.arrivalTime} <br />
                <strong>Seats:</strong>{" "}
                {booking.selectedSeats.length > 0
                  ? booking.selectedSeats.join(", ")
                  : "N/A"}
              </div>

              <div className="d-flex gap-2">
                {booking.status === "Pending" && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleResume(booking.bookingId)}
                  >
                    Resume
                  </button>
                )}

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleCancel(booking.bookingId)}
                >
                  Cancel
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;
