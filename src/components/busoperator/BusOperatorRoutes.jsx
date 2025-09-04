import  { useEffect, useState } from "react";

import { useNavigate } from "react-router";
import RouteService from "../../service/RouteService";

export default function BusOperatorRoutes() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchRoutes = async () => {
    try {
      const response = await RouteService.getRouteByOp();
      setRoutes(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load routes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleDelete = async (routeId) => {
    if (!window.confirm("Are you sure you want to delete this route?")) return;

    try {
      await RouteService.deleteRoute(routeId);
      setRoutes(routes.filter((route) => route.routeId !== routeId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete route.");
    }
  };

  const handleUpdate = (route) => {
    navigate("/addroute", { state: { route } });
  };

  if (loading) return <p>Loading routes...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">All Routes</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Route Name</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Distance (km)</th>
            <th>Estimated Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.routeId}>
              <td>{route.routeName}</td>
              <td>{route.origin}</td>
              <td>{route.destination}</td>
              <td>{route.distanceKm}</td>
              <td>{route.estimatedTime}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleUpdate(route)}
                >
                  Update
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(route.routeId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {routes.length === 0 && !loading && (
            <tr>
              <td colSpan="6" className="text-center">No routes found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}