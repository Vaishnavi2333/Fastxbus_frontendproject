
import { useState } from "react";
import { useEffect } from "react";

import { useNavigate } from "react-router";
import RouteService from "../../service/RouteService";
import BusService from "../../service/BusService";

export function SearchBus() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    RouteService.getRoutes()
      .then((res) => {
        const routes = res.data;
        setOriginSuggestions([...new Set(routes.map((r) => r.origin))]);
        setDestinationSuggestions([...new Set(routes.map((r) => r.destination))]);
      })
      .catch((err) => console.error("Error fetching routes:", err));
  }, []);

  

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    if (!origin || !destination || !date) {
      setError("Please enter origin, destination, and date!");
      return;
    }
    if (origin.toLowerCase() === destination.toLowerCase()) {
      setError("Origin and destination cannot be the same!");
      return;
    }

    try {
      const res = await BusService.searchBuses(origin, destination, date);

      if (res.data.length === 0) {
        setError("No buses available for the selected date and route!");
        return;
      }

      const busesWithSeats = await Promise.all(
        res.data.map(async (bus) => {
          try {
            const seatsRes = await BusService.getAvailableSeats(bus.tripId);
            return { ...bus, availableSeats: seatsRes.data };
          } catch {
            return { ...bus, availableSeats: [] };
          }
        })
      );

      setBuses(busesWithSeats);
      setSelectedBus(null);
      setSelectedSeats([]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while searching for buses.");
    }
  };

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat]
    );
  };

  const handleBookSeats = () => {
    if (!selectedSeats.length) {
      alert("Please select at least one seat!");
      return;
    }

    const storedUserId = localStorage.getItem("userId");
    navigate("/booking", {
      state: {
        selectedBus,
        tripId: selectedBus.tripId,
        selectedSeats,
        userId: parseInt(storedUserId),
      },
    });

    setSelectedSeats([]);
  };

  const getFilteredSuggestions = (input, suggestions) => {
    return suggestions.filter((s) =>
      s.toLowerCase().includes(input.toLowerCase())
    );
  };

  const handleSelectOrigin = (value) => {
    setOrigin(value);
    setOriginSuggestions([]);
  };

  const handleSelectDestination = (value) => {
    setDestination(value);
    setDestinationSuggestions([]);
  };

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Search Buses</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSearch} className="row g-3">
          <div className="col-md-4 position-relative">
            <label className="form-label">Origin</label>
            <input
              type="text"
              className="form-control"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="Enter origin"
              autoComplete="off"
            />
            {origin &&
              getFilteredSuggestions(origin, originSuggestions).map((s, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectOrigin(s)}
                  className="position-absolute border p-1 bg-white w-100"
                  style={{ zIndex: 10, cursor: "pointer" }}
                >
                  {s}
                </div>
              ))}
          </div>

          <div className="col-md-4 position-relative">
            <label className="form-label">Destination</label>
            <input
              type="text"
              className="form-control"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              autoComplete="off"
            />
            {destination &&
              getFilteredSuggestions(destination, destinationSuggestions).map(
                (s, i) => (
                  <div
                    key={i}
                    onClick={() => handleSelectDestination(s)}
                    className="position-absolute border p-1 bg-white w-100"
                    style={{ zIndex: 10, cursor: "pointer" }}
                  >
                    {s}
                  </div>
                )
              )}
          </div>

          <div className="col-md-4">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="col-12 text-center">
            <button type="submit" className="btn btn-primary btn-lg">
              Search
            </button>
          </div>
        </form>

        {buses.length > 0 && (
          <div className="mt-4">
            <h4>Available Buses</h4>
            <div className="list-group">
              {buses.map((bus, idx) => (
                <button
                  key={idx}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                    selectedBus === bus ? "active" : ""
                  }`}
                  onClick={() => handleSelectBus(bus)}
                >
                  <div>
                    {bus.busName} - {bus.busType} - Total Seats: {bus.capacity} - Available:{" "}
                    {bus.availableSeats.length}
                  </div>
                  <span className="badge bg-primary rounded-pill">Select</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedBus && (
          <div className="mt-4">
            <h4 className="text-center">Seats for {selectedBus.busName}</h4>
            <div className="d-flex justify-content-center">
              <div
                className="d-flex flex-wrap"
                style={{ maxWidth: "480px", gap: "8px" }}
              >
                {Array.from({ length: selectedBus.capacity }, (_, i) => {
                  const seatNumber = `S${i + 1}`;
                  const isAvailable = selectedBus.availableSeats.includes(seatNumber);
                  const isSelected = selectedSeats.includes(seatNumber);

                  
                  const seatStyle = {
                    width: "60px",
                    height: "60px",
                    textAlign: "center",
                    lineHeight: "60px",
                    cursor: isAvailable ? "pointer" : "not-allowed",
                    marginRight: (i % 4 === 1) ? "20px" : "0", 
                  };

                  return (
                    <div
                      key={seatNumber}
                      onClick={() => isAvailable && toggleSeat(seatNumber)}
                      className={`btn ${
                        isAvailable
                          ? isSelected
                            ? "btn-success"
                            : "btn-outline-primary"
                          : "btn-secondary disabled"
                      }`}
                      style={seatStyle}
                    >
                      {isAvailable ? seatNumber : ""}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="text-center mt-3">
              <button
                className="btn btn-success btn-lg"
                onClick={handleBookSeats}
              >
                Book Selected Seats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}