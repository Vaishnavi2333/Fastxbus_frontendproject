import { useState } from "react";
import axiosInstance from "../../http-common";
import BusService from "../../service/BusService";
import RouteService from "../../service/RouteService";

export default function ShowBusAndRoute() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBuses();
    fetchRoutes();
  }, []);

  const fetchBuses = async () => {
    try {
      const response = await BusService.getAllBus();
      setBuses(response.data);
    } catch (err) {
      setError("Failed to fetch buses");
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await RouteService.getRoutes();
      setRoutes(response.data);
    } catch (err) {
      setError("Failed to fetch routes");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Buses</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full border-collapse border border-gray-300 mb-8">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Bus ID</th>
            <th className="border border-gray-300 p-2">Bus Name</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Capacity</th>
            <th className="border border-gray-300 p-2">Amenities</th>
          </tr>
        </thead>
        <tbody>
          {buses.map((bus) => (
            <tr key={bus.busId}>
              <td className="border border-gray-300 p-2">{bus.busId}</td>
              <td className="border border-gray-300 p-2">{bus.busName}</td>
              <td className="border border-gray-300 p-2">{bus.busType}</td>
              <td className="border border-gray-300 p-2">{bus.capacity}</td>
              <td className="border border-gray-300 p-2">{bus.amenities}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-2xl font-bold mb-4">Available Routes</h2>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Route ID</th>
            <th className="border border-gray-300 p-2">Origin</th>
            <th className="border border-gray-300 p-2">Destination</th>
            <th className="border border-gray-300 p-2">Distance</th>
            <th className="border border-gray-300 p-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          {routes.map((route) => (
            <tr key={route.routeId}>
              <td className="border border-gray-300 p-2">{route.routeId}</td>
              <td className="border border-gray-300 p-2">{route.origin}</td>
              <td className="border border-gray-300 p-2">{route.destination}</td>
              <td className="border border-gray-300 p-2">{route.distanceKm} km</td>
              <td className="border border-gray-300 p-2">{route.estimatedTime} hrs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}