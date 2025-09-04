
import { useState,useEffect } from "react";

import RouteService from "../../service/RouteService";

export default function AdminRoutes() {
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");


  const fetchRoutes = async () => {
    try {
      const response = await RouteService.getRoutes();
      setRoutes(response.data);
    } catch (err) {
      setError("Failed to fetch routes");
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  
  const deleteRoute = async (id) => {
    if (window.confirm(`Are you sure you want to delete route ${id}?`)) {
      try {
        await RouteService.deleteRoute(id);
        setRoutes(routes.filter((route) => route.routeId !== id));
      } catch (err) {
        setError("Failed to delete route");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>All Routes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Distance (km)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.routeId}>
              <td>{route.routeId}</td>
              <td>{route.origin}</td>
              <td>{route.destination}</td>
              <td>{route.distanceKm}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteRoute(route.routeId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {routes.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No routes available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}