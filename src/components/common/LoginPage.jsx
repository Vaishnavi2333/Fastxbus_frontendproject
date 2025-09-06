import { useState } from "react";
import { useNavigate } from "react-router";
import AuthService from "../../service/AuthService";

import UserService from "../../service/UserService";



export default function LoginPage() {
  const [role, setRole] = useState("user");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userIdOrOpId = null;

      
      if (role === "user") {
        const { token, userId } = await AuthService.loginUser(credentials);
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("username", credentials.username);
        localStorage.setItem("role", role);
        userIdOrOpId = userId;
      } else if (role === "busoperator") {
        const { token, busOpId } = await AuthService.loginBusOperator(credentials);
        localStorage.setItem("token", token);
        localStorage.setItem("busOpId", busOpId);
        localStorage.setItem("username", credentials.username);
        localStorage.setItem("role", role);
        userIdOrOpId = busOpId;
      } else {
        const response = await AuthService.loginAdmin(credentials);
        localStorage.setItem("token", response.data);
        localStorage.setItem("role", role);
        localStorage.setItem("username", credentials.username);
      }

     
      window.dispatchEvent(new Event("storageUpdated"));

     
      if (role === "user") {
        let hasProfile = false;

        try {
          const profileResponse = await UserService.getUserById(userIdOrOpId);
          const data = profileResponse.data;

         
          hasProfile = !!(data && (data.email || data.dateOfBirth));

          localStorage.setItem("profileComplete", hasProfile ? "true" : "false");
        } catch (err) {
          console.error("Error fetching profile:", err);
          localStorage.setItem("profileComplete", "false");
        }

        const pendingBooking = sessionStorage.getItem("pendingBooking");

        if (!hasProfile) {
          
          navigate("/userprofile", {
            state: pendingBooking ? { fromBooking: true } : {},
          });
          return;
        }

        if (pendingBooking) {
         
          const bookingData = JSON.parse(pendingBooking);
          sessionStorage.removeItem("pendingBooking");
          navigate("/booking", {
            state: {
              ...bookingData,
              userId: parseInt(localStorage.getItem("userId")),
            },
          });
          return;
        }

       
        navigate("/user/dashboard");
        return;
      }

     
      if (role === "busoperator") {
        navigate("/busoperator/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed! Invalid username or password.";
      setError(backendMessage);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div style={{ width: "400px" }}>
        <div className="card p-4 shadow-sm">
          <div className="text-center mb-4">
            <h2>Welcome to Swift Bus</h2>
            <p className="text-muted">Login to your account</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">👤 User</option>
                <option value="busoperator">🚌 Bus Operator</option>
                <option value="admin">🛠️ Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Login
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </button>
            </div>

            <div className="text-center mt-2">
              <span>Don’t have an account? </span>
              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() => navigate("/register")}
              >
                Create one
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

