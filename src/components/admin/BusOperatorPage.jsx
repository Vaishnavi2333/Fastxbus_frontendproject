import { useEffect, useState } from "react";
import axiosInstance from "../../http-common";
import { useNavigate } from "react-router";

export default function BusOperatorPage() {
  const [operators, setOperators] = useState([]);
  const [operatorId, setOperatorId] = useState("");
  const [singleOperator, setSingleOperator] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllOperators();
  }, []);

  const fetchAllOperators = async () => {
    try {
      const response = await axiosInstance.get("busopdata/getall");
      setOperators(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch operators.");
    }
  };

  const fetchOperatorById = async () => {
    if (!operatorId) return;
    try {
      const response = await axiosInstance.get(`busopdata/getbyid/${operatorId}`);
      setSingleOperator(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Operator not found!");
      setSingleOperator(null);
    }
  };

  const deleteOperator = async (id) => {
    if (!window.confirm("Are you sure you want to delete this operator?")) return;

    try {
      const response = await axiosInstance.delete(`busopdata/delete/${id}`);
      setMessage(response.data); 
      setError("");
      
      fetchAllOperators();
    } catch (err) {
      console.error(err);
      setError("Failed to delete operator.");
      setMessage("");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Bus Operator Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="mb-4">
        <input
          type="number"
          placeholder="Enter Operator ID"
          className="form-control w-25 d-inline-block me-2"
          value={operatorId}
          onChange={(e) => setOperatorId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchOperatorById}>
          Get Operator
        </button>
      </div>

      {singleOperator && (
        <div className="card mb-4 p-3">
          <h5>Operator ID: {singleOperator.busOpLoginId}</h5>
          <p>Name: {singleOperator.name}</p>
          <p>Company: {singleOperator.companyName}</p>
          <p>Address: {singleOperator.address}</p>
          <p>Contact Number: {singleOperator.contactNumber}</p>
          <p>Email: {singleOperator.email}</p>
          <p>Date of Birth: {singleOperator.dateOfBirth}</p>
          <p>Gender: {singleOperator.gender}</p>
          <p>Licence Number: {singleOperator.licenceNumber}</p>
          <button
            className="btn btn-danger mt-2"
            onClick={() => deleteOperator(singleOperator.busOpLoginId)}
          >
            Delete This Operator
          </button>
        </div>
      )}

      <h4>All Bus Operators</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th>Bus Operator ID</th>
              <th>Name</th>
              <th>Company</th>
              <th>Address</th>
              <th>Contact Number</th>
              <th>Email</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Licence Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {operators.map((op) => (
              <tr key={op.busOpLoginId}>
                <td>{op.busOpLoginId}</td>
                <td>{op.name}</td>
                <td>{op.companyName}</td>
                <td>{op.address}</td>
                <td>{op.contactNumber}</td>
                <td>{op.email}</td>
                <td>{op.dateOfBirth}</td>
                <td>{op.gender}</td>
                <td>{op.licenceNumber}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteOperator(op.busOpLoginId)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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