import { useState } from "react";

import BusService from "../../service/BusService";
import RouteService from "../../service/RouteService";
export default function ShowBusAndRoute({ selectBus, selectRoute, selectedBusId, selectedRouteId }) {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState("");
  const [showBuses, setShowBuses] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

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

  const handleShowBuses = () => {
    setShowBuses(true);
    setShowRoutes(false);
    if (buses.length === 0) fetchBuses();
  };

  const handleShowRoutes = () => {
    setShowRoutes(true);
    setShowBuses(false);
    if (routes.length === 0) fetchRoutes();
  };

  return (
    <div className="p-4">
      <div className="flex gap-3 mb-4 justify-center flex-wrap">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleShowBuses}
        >
          Show Buses
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={handleShowRoutes}
        >
          Show Routes
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {showBuses && buses.length > 0 && (
        <div className="overflow-x-auto mb-6">
          <h2 className="text-xl font-semibold mb-3 text-center text-blue-700">Available Buses</h2>
          <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-100 text-blue-800 uppercase text-sm font-semibold">
              <tr>
                <th className="p-3 border-b">Bus ID</th>
                <th className="p-3 border-b">Bus Name</th>
                <th className="p-3 border-b">Type</th>
                <th className="p-3 border-b">Capacity</th>
                <th className="p-3 border-b">Amenities</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr
                  key={bus.busId}
                  className={`cursor-pointer transition hover:bg-blue-50 ${
                    selectedBusId === bus.busId ? "bg-blue-200 font-bold" : ""
                  }`}
                  onClick={() => selectBus(bus.busId)}
                >
                  <td className="p-3 border-b">{bus.busId}</td>
                  <td className="p-3 border-b">{bus.busName}</td>
                  <td className="p-3 border-b">{bus.busType}</td>
                  <td className="p-3 border-b">{bus.capacity}</td>
                  <td className="p-3 border-b">
                    {bus.amenities?.length
                      ? bus.amenities.map((a) => a.amenityName).join(", ")
                      : "None"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showRoutes && routes.length > 0 && (
        <div className="overflow-x-auto">
          <h2 className="text-xl font-semibold mb-3 text-center text-green-700">Available Routes</h2>
          <table className="min-w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
            <thead className="bg-green-100 text-green-800 uppercase text-sm font-semibold">
              <tr>
                <th className="p-3 border-b">Route ID</th>
                <th className="p-3 border-b">Origin</th>
                <th className="p-3 border-b">Destination</th>
                <th className="p-3 border-b">Distance</th>
                <th className="p-3 border-b">Duration</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr
                  key={route.routeId}
                  className={`cursor-pointer transition hover:bg-green-50 ${
                    selectedRouteId === route.routeId ? "bg-green-200 font-bold" : ""
                  }`}
                  onClick={() => selectRoute(route.routeId)}
                >
                  <td className="p-3 border-b">{route.routeId}</td>
                  <td className="p-3 border-b">{route.origin}</td>
                  <td className="p-3 border-b">{route.destination}</td>
                  <td className="p-3 border-b">{route.distanceKm} km</td>
                  <td className="p-3 border-b">{route.estimatedTime} hrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
