import { useEffect, useState } from "react";

import { format } from "date-fns";
import BookingService from "../../service/BookingService";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await BookingService.getBookings();
      setBookings(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bookings.");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">All Bookings (Admin View)</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {bookings.length === 0 ? (
        <p className="text-center">No bookings available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Booking ID</th>
                <th>User</th>
                <th>Bus</th>
                <th>Booking Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Seats Booked</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId}>
                  <td>{b.bookingId}</td>
                  <td>{b.username}</td>
                  <td>{b.busName}</td>
                  <td>{format(new Date(b.bookingDate), "dd/MM/yyyy")}</td>
                  <td>{b.startingTime}</td>
                  <td>{b.endingTime}</td>
                  <td>{b.seatsBooked.join(", ")}</td>
                  <td>{b.totalAmount.toFixed(2)}</td>
                  <td>{b.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}