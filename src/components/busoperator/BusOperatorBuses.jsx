
import  { useEffect, useState } from "react";
import http from "../../http-common";
import { useNavigate } from "react-router";

export default function BusOperatorBuses() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchBuses = async () => {
    try {
      const operatorId = localStorage.getItem("busOpId");
      const token = localStorage.getItem("token");

      const response = await http.get(`/bus/getbusbyoperator/${operatorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load buses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const handleDelete = async (busId) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;

    try {
      const token = localStorage.getItem("token");
      await http.delete(`/bus/delete/${busId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBuses(buses.filter((bus) => bus.busId !== busId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete bus.");
    }
  };

  const handleUpdate = (bus) => {
    navigate("/addbus", { state: { bus } }); 
  };

  if (loading) return <p>Loading buses...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">All Buses</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Bus Name</th>
            <th>Bus Number</th>
            <th>Bus Type</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Amenities</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.busId}>
              <td>{bus.busName}</td>
              <td>{bus.busNumber}</td>
              <td>{bus.busType}</td>
              <td>{bus.capacity}</td>
              <td>{bus.status}</td>
              <td>
        {bus.amenities && bus.amenities.length > 0
          ? bus.amenities.map(a => a.amenityName).join(", ")
          : "-"}
      </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleUpdate(bus)}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(bus.busId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
