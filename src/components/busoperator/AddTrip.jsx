import { useState } from "react";
import BusService from "../../service/BusService";
import RouteService from "../../service/RouteService";
import TripService from "../../service/TripService";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function AddTrip() {
  const location = useLocation();
  const [trip, setTrip] = useState({
    tripId: null,
    date: "",
    departureTime: "",
    arrivalTime: "",
    fare: "",
    status: "Scheduled",
    busId: "",
    routeId: "",
  });
  const [message, setMessage] = useState("");
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showBuses, setShowBuses] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  
  useEffect(() => {
    if (location.state?.trip) {
      const existingTrip = location.state.trip;
      setTrip({
        tripId: existingTrip.tripId || null,
        date: existingTrip.date || "",
        departureTime: existingTrip.departureTime || "",
        arrivalTime: existingTrip.arrivalTime || "",
        fare: existingTrip.fare || "",
        status: existingTrip.status || "Scheduled",
        busId: existingTrip.bus?.busId || existingTrip.busId || "",
        routeId: existingTrip.route?.routeId || existingTrip.routeId || "",
      });
    }
  }, [location.state]);

  const fetchBuses = async () => {
    try {
      const res = await BusService.getAllBus();
      setBuses(res.data);
    } catch {
      setMessage("Error fetching buses");
    }
  };

  const fetchRoutes = async () => {
    try {
      const res = await RouteService.getRoutes();
      setRoutes(res.data);
    } catch {
      setMessage("Error fetching routes");
    }
  };

  const handleChange = (e) => {
    setTrip({ ...trip, [e.target.name]: e.target.value });
  };

  const selectBus = (busId) => {
    setTrip({ ...trip, busId });
    setMessage(`Selected Bus ID: ${busId}`);
  };

  const selectRoute = (routeId) => {
    setTrip({ ...trip, routeId });
    setMessage(`Selected Route ID: ${routeId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (trip.tripId) {
        await TripService.updateTrip(trip);
        setMessage("Trip updated successfully!");
      } else {
        await TripService.addTrip(trip);
        setMessage("Trip added successfully!");
        setTrip({
          tripId: null,
          date: "",
          departureTime: "",
          arrivalTime: "",
          fare: "",
          status: "Scheduled",
          busId: "",
          routeId: "",
        });
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Error saving trip");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      <h2 className="mb-4 text-center">{trip.tripId ? "Update Trip" : "Add Trip"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              value={trip.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Departure Time</label>
            <input
              type="time"
              name="departureTime"
              className="form-control"
              value={trip.departureTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Arrival Time</label>
            <input
              type="time"
              name="arrivalTime"
              className="form-control"
              value={trip.arrivalTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Fare</label>
            <input
              type="number"
              name="fare"
              className="form-control"
              value={trip.fare}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={trip.status}
              onChange={handleChange}
              required
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Bus</label>
            <input
              type="number"
              name="busId"
              className="form-control"
              value={trip.busId || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Route</label>
            <input
              type="number"
              name="routeId"
              className="form-control"
              value={trip.routeId || ""}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <button type="submit" className="btn btn-primary btn-lg">
            {trip.tripId ? "Update Trip" : "Add Trip"}
          </button>
        </div>
      </form>

      {message && <p className="text-center text-success">{message}</p>}

      
      <div className="d-flex justify-content-center gap-3 mb-4 flex-wrap">
        <button
          className="btn btn-info text-white"
          onClick={() => {
            setShowBuses(true);
            setShowRoutes(false);
            if (buses.length === 0) fetchBuses();
          }}
        >
          Show Buses
        </button>
        <button
          className="btn btn-success text-white"
          onClick={() => {
            setShowRoutes(true);
            setShowBuses(false);
            if (routes.length === 0) fetchRoutes();
          }}
        >
          Show Routes
        </button>
      </div>

      
      {showBuses && buses.length > 0 && (
        <div className="table-responsive mb-4">
          <h4 className="text-center text-info mb-3">Available Buses</h4>
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Amenities</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr
                  key={bus.busId}
                  className={`cursor-pointer ${
                    trip.busId === bus.busId ? "table-primary fw-bold" : ""
                  }`}
                  onClick={() => selectBus(bus.busId)}
                >
                  <td>{bus.busId}</td>
                  <td>{bus.busName}</td>
                  <td>{bus.busType}</td>
                  <td>{bus.capacity}</td>
                  <td>{bus.amenities?.length ? bus.amenities.map(a => a.amenityName).join(", ") : "None"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      
      {showRoutes && routes.length > 0 && (
        <div className="table-responsive">
          <h4 className="text-center text-success mb-3">Available Routes</h4>
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Distance</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr
                  key={route.routeId}
                  className={`cursor-pointer ${
                    trip.routeId === route.routeId ? "table-success fw-bold" : ""
                  }`}
                  onClick={() => selectRoute(route.routeId)}
                >
                  <td>{route.routeId}</td>
                  <td>{route.origin}</td>
                  <td>{route.destination}</td>
                  <td>{route.distanceKm} km</td>
                  <td>{route.estimatedTime} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
