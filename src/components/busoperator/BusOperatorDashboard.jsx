import { useNavigate } from "react-router-dom";

export default function BusOperatorDashboard() {
  const navigate = useNavigate();

  const handleClick = () => navigate("/busopprofile");
  const handleAdd = () => navigate("/addBus");
  const handleRoute = () => navigate("/addroute");
  const handleTrip = () => navigate("/addtrip");
  const handleBookings = () => navigate("/busoperator/bookings"); 
  const handleBuses = () => navigate("/busoperator/buses");
  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold">Bus Operator Dashboard</h2>
        <p className="text-muted">Manage buses, routes, trips, and bookings efficiently.</p>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4">
            <h5 className="card-title">Profile</h5>
            <p className="card-text">View and edit your bus operator profile.</p>
            <button className="btn btn-primary mt-3 w-100" onClick={handleClick}>
              Go to Profile
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4">
            <h5 className="card-title">Add Bus</h5>
            <p className="card-text">Register a new bus in your fleet.</p>
            <button className="btn btn-success mt-3 w-100" onClick={handleAdd}>
              Add Bus
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4">
            <h5 className="card-title">Add Route</h5>
            <p className="card-text">Create new routes for buses to follow.</p>
            <button className="btn btn-warning mt-3 w-100" onClick={handleRoute}>
              Add Route
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4">
            <h5 className="card-title">Add Trip</h5>
            <p className="card-text">Schedule a trip for your buses.</p>
            <button className="btn btn-danger mt-3 w-100" onClick={handleTrip}>
              Add Trip
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-4 g-4">
        <div className="col-md-3">
          <div className="card shadow-sm text-center p-4">
            <h5 className="card-title">View Bookings</h5>
            <p className="card-text">See all recent bookings for your buses.</p>
            <button className="btn btn-info mt-3 w-100" onClick={handleBookings}>
              View Bookings
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm text-center p-4">
            <h5 className="card-title">My Buses</h5>
            <p className="card-text">See all buses registered under your account.</p>
            <button className="btn btn-secondary mt-3 w-100" onClick={handleBuses}>
              View Buses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}