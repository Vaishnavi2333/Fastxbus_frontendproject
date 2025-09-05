import { useNavigate } from "react-router-dom";
import {
  BsPersonCircle,
  BsBusFront,
  BsMap,
  BsCalendarCheck,
  BsTicketPerforated,
  BsListUl,
  BsMapFill,
  BsCalendar2Event,
} from "react-icons/bs";

export default function BusOperatorDashboard() {
  const navigate = useNavigate();

  const handleClick = () => navigate("/busopprofile");
  const handleAdd = () => navigate("/addBus");
  const handleRoute = () => navigate("/addroute");
  const handleTrip = () => navigate("/addtrip");
  const handleBookings = () => navigate("/busoperator/bookings");
  const handleBuses = () => navigate("/busoperator/buses");
  const handleViewRoute = () => navigate("/routebusop");
  const handleViewTrip = () => navigate("/tripbusop");

  return (
    <div className="container mt-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-primary">🚍 Bus Operator Dashboard</h2>
        <p className="text-muted">
          Manage buses, routes, trips, and bookings efficiently.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsPersonCircle size={40} className="text-primary mb-3" />
            <h5 className="card-title">Profile</h5>
            <p className="card-text">View and edit your profile.</p>
            <button
              className="btn btn-primary mt-3 w-100"
              onClick={handleClick}
            >
              Go to Profile
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsBusFront size={40} className="text-success mb-3" />
            <h5 className="card-title">Add Bus</h5>
            <p className="card-text">Register a new bus in your fleet.</p>
            <button className="btn btn-success mt-3 w-100" onClick={handleAdd}>
              Add Bus
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsMap size={40} className="text-warning mb-3" />
            <h5 className="card-title">Add Route</h5>
            <p className="card-text">Create new routes for buses.</p>
            <button
              className="btn btn-warning mt-3 w-100"
              onClick={handleRoute}
            >
              Add Route
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsCalendarCheck size={40} className="text-danger mb-3" />
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
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsTicketPerforated size={40} className="text-info mb-3" />
            <h5 className="card-title">View Bookings</h5>
            <p className="card-text">See all recent bookings.</p>
            <button
              className="btn btn-info mt-3 w-100"
              onClick={handleBookings}
            >
              View Bookings
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsListUl size={40} className="text-secondary mb-3" />
            <h5 className="card-title">My Buses</h5>
            <p className="card-text">See all buses you registered.</p>
            <button
              className="btn btn-secondary mt-3 w-100"
              onClick={handleBuses}
            >
              View Buses
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsMapFill size={40} className="text-dark mb-3" />
            <h5 className="card-title">My Routes</h5>
            <p className="card-text">Check all routes you created.</p>
            <button
              className="btn btn-dark mt-3 w-100"
              onClick={handleViewRoute}
            >
              View Routes
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm h-100 text-center p-4 card-hover">
            <BsCalendar2Event size={40} className="text-primary mb-3" />
            <h5 className="card-title">My Trips</h5>
            <p className="card-text">See all your scheduled trips.</p>
            <button
              className="btn btn-primary mt-3 w-100"
              onClick={handleViewTrip}
            >
              View Trips
            </button>
          </div>
        </div>
      </div>

      
      <style>{`
        .card-hover {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0px 8px 20px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}