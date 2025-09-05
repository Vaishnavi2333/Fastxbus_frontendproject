import { useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import { useEffect } from "react";

import RouteService from "../../service/RouteService";

const AddRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [route, setRoute] = useState({
    routeId: null,
    routeName: "",
    origin: "",
    destination: "",
    distanceKm: "",
    estimatedTime: ""
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (location.state?.route) {
      const existingRoute = location.state.route;
      setRoute({
        routeId: existingRoute.routeId || null,
        routeName: existingRoute.routeName || "",
        origin: existingRoute.origin || "",
        destination: existingRoute.destination || "",
        distanceKm: existingRoute.distanceKm || "",
        estimatedTime: existingRoute.estimatedTime || ""
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setRoute({ ...route, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (route.origin.toLowerCase() === route.destination.toLowerCase()) {
      setMessage("Origin and Destination cannot be the same!");
      return;
    }

    try {
      if (route.routeId) {
       
        await RouteService.updateRoute(route);
        setMessage("Route updated successfully!");
      } else {
       
        const response = await RouteService.addRoute(route);
        setMessage(`Route added successfully with ID: ${response.data.routeId}`);
      }

     
      setTimeout(() => navigate("/routebusop"), 1200);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Failed to save route.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="mb-4 text-center">
        {route.routeId ? "Update Route" : "Add Route"}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Route Name:</label>
          <input
            type="text"
            name="routeName"
            className="form-control"
            value={route.routeName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Origin:</label>
          <input
            type="text"
            name="origin"
            className="form-control"
            value={route.origin}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Destination:</label>
          <input
            type="text"
            name="destination"
            className="form-control"
            value={route.destination}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Distance (Km):</label>
            <input
              type="number"
              name="distanceKm"
              className="form-control"
              value={route.distanceKm}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Estimated Time:</label>
            <input
              type="text"
              name="estimatedTime"
              className="form-control"
              value={route.estimatedTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            {route.routeId ? "Update Route" : "Add Route"}
          </button>
        </div>
      </form>

      {message && (
        <p className="mt-3 text-center text-success">{message}</p>
      )}
    </div>
  );
};

export default AddRoute;