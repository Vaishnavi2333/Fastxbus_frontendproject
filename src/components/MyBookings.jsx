import { useState,useEffect } from "react";
import axiosInstance from "../http-common";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No user logged in.");

      const response = await axiosInstance.get(`/booking/user/${userId}/summary`);
      if (response.data && response.data.length > 0) {
        const formattedBookings = response.data.map((booking) => ({
          bookingId: booking.bookingId,
          status: booking.status,
          bookingDate: booking.bookingDate
            ? new Date(booking.bookingDate).toLocaleDateString()
            : "N/A",
          busName: booking.busName || "N/A",
          startingTime: booking.startingTime || "N/A",
          endingTime: booking.endingTime || "N/A",
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
      await axiosInstance.delete(`/booking/cancel/${bookingId}`);
      alert(`Booking ${bookingId} has been cancelled.`);
     
      fetchBookings();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel booking.");
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
            <li key={booking.bookingId} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>Booking ID:</strong> {booking.bookingId} <br />
                <strong>Status:</strong> {booking.status} <br />
                <strong>Date:</strong> {booking.bookingDate} <br />
                <strong>Bus Name:</strong> {booking.busName} <br />
                <strong>Start Time:</strong> {booking.startingTime} <br />
                <strong>End Time:</strong> {booking.endingTime}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleCancel(booking.bookingId)}
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyBookings;