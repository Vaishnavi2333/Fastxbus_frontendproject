import  { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import TripService from "../../service/TripService";


export default function BusOperatorTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const response = await TripService.getTripById();
      setTrips(response.data); 
    } catch (err) {
      console.error(err);
      setError("Failed to load trips.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await TripService.deleteTrip(tripId);
      setTrips(trips.filter((trip) => trip.tripId !== tripId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete trip.");
    }
  };

  const handleUpdate = (trip) => {
    navigate("/addtrip", { state: { trip } });
  };

  if (loading) return <p>Loading trips...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">My Trips</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Trip Date</th>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Fare</th>
            <th>Status</th>
            <th>Bus</th>
            <th>Route</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.tripId}>
              <td>{trip.date}</td>
              <td>{trip.departureTime}</td>
              <td>{trip.arrivalTime}</td>
              <td>{trip.fare}</td>
              <td>{trip.status}</td>
              <td>{trip.busName}</td> {/* use transient busName */}
              <td>{trip.route?.routeName || "N/A"}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleUpdate(trip)}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(trip.tripId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
