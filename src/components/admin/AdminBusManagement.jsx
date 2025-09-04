import { useState,useEffect } from "react";

import BusService from "../../service/BusService";


export default function AdminBusManagement() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await BusService.getAllBus();
      setBuses(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch buses");
      setLoading(false);
    }
  };

  const deleteBus = async (id) => {
    if (window.confirm("Are you sure you want to delete this bus?")) {
      try {
        await BusService.deleteBus(id);
        setBuses(buses.filter((bus) => bus.busId !== id));
      } catch (err) {
        alert("Failed to delete bus");
      }
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  if (loading) return <p>Loading buses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container">
      <h2>Manage Buses</h2>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Bus ID</th>
            <th>Bus Name</th>
            <th>Bus Number</th>
            <th>Bus Type</th>
            <th>Capacity</th>
            <th>Status</th>
           
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.busId}>
              <td>{bus.busId}</td>
              <td>{bus.busName}</td>
              <td>{bus.busNumber}</td>
              <td>{bus.busType}</td>
              <td>{bus.capacity}</td>
              <td>{bus.status}</td>
             
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteBus(bus.busId)}
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