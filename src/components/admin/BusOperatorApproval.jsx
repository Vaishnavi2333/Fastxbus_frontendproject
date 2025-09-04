import { useState,useEffect } from "react";
import AdminService from "../../service/AdminService";

export default function BusOperatorApproval() {
  const [pendingOperators, setPendingOperators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 const fetchPendingOperators = async () => {
  try {
    const res = await AdminService.pendingRequest();
    
   
    let operators = [];
    if (Array.isArray(res.data)) {
      operators = res.data;
    } else if (res.data.pendingOperators) {
      operators = res.data.pendingOperators;
    }

   
    operators = operators.filter(op => op.status === "PENDING");

    setPendingOperators(operators);
    setLoading(false);
  } catch (err) {
    console.error(err);
    setError("Failed to fetch pending bus operators");
    setLoading(false);
  }
};

useEffect(() => {
  fetchPendingOperators();
}, []);

  
  const handleStatusChange = async (busOpId, action) => {
    try {
      await AdminService.updateBusOperatorStatus(busOpId, action);
      alert(`Bus Operator ${action}d successfully`);
     
      fetchPendingOperators();
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} bus operator`);
    }
  };

  if (loading) return <p>Loading pending bus operators...</p>;

  return (
    <div className="container my-5">
      <h3>Pending Bus Operator Requests</h3>
      {error && <p className="text-danger">{error}</p>}

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingOperators.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                No pending requests
              </td>
            </tr>
          )}
          {Array.isArray(pendingOperators) &&
            pendingOperators.map((op) => (
              <tr key={op.busOpId}>
                <td>{op.busOpId}</td>
                <td>{op.username}</td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleStatusChange(op.busOpId, "approve")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusChange(op.busOpId, "reject")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}