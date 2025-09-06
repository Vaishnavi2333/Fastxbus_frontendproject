import { FaBus, FaSearch, FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/userprofile");
  };

  const searchBus = () => {
    navigate("/searchbus");
  };

  const viewBookings = () => {
    navigate("/mybookings");
  };

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100" style={{ paddingTop: "80px", backgroundColor: "#f8f9fa" }}>
      <div style={{ width: "100%", maxWidth: "1100px" }}>
       
        <div className="card shadow-lg p-4 mb-5 text-center border-0" style={{ borderRadius: "15px", backgroundColor: "#ffffff" }}>
          <h2 className="card-title mb-3" style={{ fontWeight: "700", color: "#343a40" }}>User Dashboard</h2>
          <p className="card-text mb-0" style={{ fontSize: "1.1rem", color: "#6c757d" }}>
            Welcome! Manage your profile, view bookings, and search for buses seamlessly.
          </p>
        </div>

       
        <div className="row g-4">
        
          <div className="col-md-4">
            <div
              className="card text-center h-100 shadow-sm"
              style={{
                borderRadius: "15px",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div className="card-body">
                <FaBus size={40} className="mb-3 text-primary" />
                <h5 className="card-title mb-2">My Bookings</h5>
                <p className="card-text mb-3">View and manage all your bus bookings.</p>
                <button className="btn btn-primary btn-sm" onClick={viewBookings}>
                  View Bookings
                </button>
              </div>
            </div>
          </div>

          {/* Search Routes */}
          <div className="col-md-4">
            <div
              className="card text-center h-100 shadow-sm"
              style={{
                borderRadius: "15px",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div className="card-body">
                <FaSearch size={40} className="mb-3 text-success" />
                <h5 className="card-title mb-2">Search Routes</h5>
                <p className="card-text mb-3">Find the best buses and routes available.</p>
                <button className="btn btn-success btn-sm" onClick={searchBus}>
                  Search
                </button>
              </div>
            </div>
          </div>

         
          <div className="col-md-4">
            <div
              className="card text-center h-100 shadow-sm"
              style={{
                borderRadius: "15px",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div className="card-body">
                <FaUserEdit size={40} className="mb-3 text-warning" />
                <h5 className="card-title mb-2">Edit Profile</h5>
                <p className="card-text mb-3">Update your personal details and preferences.</p>
                <button className="btn btn-warning btn-sm" onClick={handleClick}>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}