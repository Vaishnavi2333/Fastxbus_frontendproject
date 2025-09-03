import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/userprofile");
  };

  const searchBus = () => {
    navigate("/searchbus");
  };

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100" style={{ paddingTop: "100px" }}>
      <div style={{ width: "100%", maxWidth: "1000px" }}>
        <div className="card shadow-lg p-4 mb-4">
          <div className="card-body text-center">
            <h2 className="card-title mb-3">User Dashboard</h2>
            <p className="card-text mb-4">
              Welcome to your dashboard! Here you can manage your profile, view bookings, and search for buses.
            </p>
            
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">My Bookings</h5>
                <p className="card-text">View and manage all your bus bookings.</p>
               <button 
  className="btn btn-outline-primary" 
  onClick={() => navigate("/mybookings")}
>
  View Bookings
</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Search Routes</h5>
                <p className="card-text">Find the best buses and routes available.</p>
                <button className="btn btn-outline-success" onClick={searchBus}>Search</button>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">Edit Profile</h5>
                <p className="card-text">Update your personal details and preferences.</p>
                <button className="btn btn-outline-primary" onClick={handleClick}>Edit Profile</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
