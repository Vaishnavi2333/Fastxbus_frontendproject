import { useState } from "react";
import AuthService from "../../service/AuthService";
import { useNavigate } from "react-router";

export default function ForgotPasswordPage() {
  const [role, setRole] = useState("user");
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [step, setStep] = useState(1); 
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await AuthService.forgotPassword(role, username);
      setMessage(response.data);
      setStep(2);
    } catch (err) {
      setError(err.response?.data || "Username not found");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await AuthService.resetPassword(role, username, newPassword);
      setMessage(response.data);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data || "Password reset failed");
    }
  };

  const checkPasswordStrength = (password) => {
  let strength = "";
  if (password.length < 8) {
    strength = "Weak";
  } else if (
    /[A-Z]/.test(password) &&  
    /[a-z]/.test(password) &&  
    /[0-9]/.test(password) &&  
    /[^A-Za-z0-9]/.test(password) 
  ) {
    strength = "Strong";
  } else {
    strength = "Medium";
  }
  setPasswordStrength(strength);
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
            <h2>Forgot Password</h2>
            <p className="text-muted">Reset your account password</p>
          </div>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleForgotPassword}>
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
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-primary w-100" type="submit">
                Validate Username
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  placeholder="Enter new password"
                  value={newPassword}
                 onChange={(e) => {
    setNewPassword(e.target.value);
    checkPasswordStrength(e.target.value);
  }}
                  required
                />
                <small className={`text-${passwordStrength === 'Strong' ? 'success' : passwordStrength === 'Medium' ? 'warning' : 'danger'}`}>
  Strength: {passwordStrength}
</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button className="btn btn-success w-100" type="submit">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}