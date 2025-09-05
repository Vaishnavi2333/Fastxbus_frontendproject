import { useState } from "react";
import AuthService from "../../service/AuthService";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(""); 
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "password") {
      checkPasswordStrength(value);
    }
  };


  const checkPasswordStrength = (password) => {
    let strength = "";
    if (password.length < 6) {
      strength = "Weak";
    } else if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      strength = "Strong";
    } else {
      strength = "Medium";
    }
    setPasswordStrength(strength);
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

     setSuccess(`Registered successfully!`);

     
      setTimeout(() => navigate("/login"), 2000);
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
          {success && <div className="alert alert-success">{success}</div>}

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
              <label className="form-label">Username/Email</label>
              <input
                type="text"
                name="username"
                className="form-control"
                placeholder="Enter username or email"
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
              {passwordStrength && (
                <small
                  style={{
                    color:
                      passwordStrength === "Weak"
                        ? "red"
                        : passwordStrength === "Medium"
                        ? "orange"
                        : "green",
                  }}
                >
                  {passwordStrength} password
                </small>
              )}
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