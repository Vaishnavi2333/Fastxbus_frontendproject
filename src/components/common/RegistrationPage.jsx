import { useState } from "react";
import AuthService from "../../service/AuthService";


export default function RegisterPage() {
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
const handleRegister = async (e) => {
  e.preventDefault();
  setError("");

  try {
    let response;
    if (role === "user") {
      response = await AuthService.registerUser(formData);
    } else if (role === "busoperator") { 
      response = await AuthService.registerBusOperator(formData);
    } else {
      throw new Error("Invalid role selected"); 
    }

    alert(`${role} registered successfully`);
    console.log(response.data);
  } catch (err) {
    console.error(err);
    setError("Registration failed! Please try again.");
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
            <p className="text-muted">Register your account</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                 <option value="user">👤 User</option>
              <option value="busoperator">🚌 Bus Operator</option>
             
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username"
                value={formData.username}
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
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}