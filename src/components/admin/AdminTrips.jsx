import { useState,useEffect } from "react";
import TripService from "../../service/TripService";


export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [error, setError] = useState("");


  const fetchTrips = async () => {
    try {
      const response = await TripService.getAllTrips();
      setTrips(response.data);
    } catch (err) {
      setError("Failed to fetch trips");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  
  const deleteTrip = async (id) => {
    if (window.confirm(`Are you sure you want to delete trip ${id}?`)) {
      try {
        await TripService.deleteTrip(id);
        setTrips(trips.filter((trip) => trip.tripId !== id));
      } catch (err) {
        setError("Failed to delete trip");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Trips</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus ID</th>
            <th>Date</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Fare</th>
            <th>Route ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.tripId}>
              <td>{trip.tripId}</td>
              <td>{trip.busId}</td>
              <td>{trip.date}</td>
              <td>{trip.departureTime}</td>
              <td>{trip.arrivalTime}</td>
              <td>{trip.fare}</td>
              <td>{trip.routeId}</td>
              <td>{trip.status}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTrip(trip.tripId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {trips.length === 0 && (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No trips available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}