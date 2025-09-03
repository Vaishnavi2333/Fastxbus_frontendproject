import { useEffect, useState } from "react";
import axiosInstance from "../../http-common"; 
import { format } from 'date-fns';


export default function BusOperatorBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(""); 
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get("/booking/bookings/summary"); 
      setBookings(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch bookings.");
    }
  };

  const handleRefund = async (bookingId) => {
    try {
      const response = await axiosInstance.put(
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

      setMessage(response.data);  
      setError("");               
      fetchBookings();           
    } catch (err) {
      console.error(err);
      setError("Failed to refund booking.");
      setMessage("");            
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Recent Bookings</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>} 

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
                <th>Action</th>
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
                  <td>
                    {b.status === "Cancelled" && (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleRefund(b.bookingId)}
                      >
                        Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}