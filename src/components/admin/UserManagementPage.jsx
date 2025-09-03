import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import axiosInstance from "../../http-common";
export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [singleUser, setSingleUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

 
  const fetchAllUsers = async () => {
    try {
      const response = await axiosInstance.get("/userdata/allusers");
      console.log("Raw API Response (all users):", response.data);

      let data = response.data;

     
      if (!Array.isArray(data)) {
        data = [data];
      }

      
      const cleaned = data.map((u) => ({
        userdataId: u.userdataId,
        userId: u.userId,
        name: u.name,
        email: u.email,
        contactNumber: u.contactNumber,
        address: u.address,
      }));

      setUsers(cleaned);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err.response?.data || err.message);
      setError("Failed to fetch users.");
      setUsers([]);
    }
  };

 
  const fetchUserById = async () => {
    if (!userId) return;
    try {
      const response = await axiosInstance.get(`/userdata/getuser/${userId}`);
      console.log("Raw API Response (single user):", response.data);

      const u = response.data;
      const cleaned = {
        userdataId: u.userdataId,
        userId: u.userId,
        name: u.name,
        email: u.email,
        contactNumber: u.contactNumber,
        address: u.address,
      };

      setSingleUser(cleaned);
      setError("");
    } catch (err) {
      console.error("Error fetching user:", err.response?.data || err.message);
      setError("User not found!");
      setSingleUser(null);
    }
  };

  
  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axiosInstance.delete(`/userdata/deleteuser/${id}`);
      setMessage(response.data);
      setError("");
      fetchAllUsers(); 
    } catch (err) {
      console.error("Error deleting user:", err.response?.data || err.message);
      setError("Failed to delete user.");
      setMessage("");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">User Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

     
      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter User ID"
          className="form-control w-25 d-inline-block me-2"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchUserById}>
          Get User
        </button>
      </div>

    
      {singleUser && (
        <div className="card mb-4 p-3">
          <h5>User ID: {singleUser.userId}</h5>
          <p>Name: {singleUser.name}</p>
          <p>Email: {singleUser.email}</p>
          <p>Phone: {singleUser.contactNumber}</p>
          <p>Address: {singleUser.address}</p>
          <button
            className="btn btn-danger mt-2"
            onClick={() => deleteUser(singleUser.userId)}
          >
            Delete This User
          </button>
        </div>
      )}

     
      <h4>All Users</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.userId}>
                  <td>{u.userId}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.contactNumber}</td>
                  <td>{u.address}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteUser(u.userId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-secondary mt-4"
        onClick={() => navigate("/admin/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}