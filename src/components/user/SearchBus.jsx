
import { useState } from "react";
import { useEffect } from "react";

import { useNavigate } from "react-router";
import RouteService from "../../service/RouteService";
import BusService from "../../service/BusService";
import { FaBus } from "react-icons/fa";
import { useLocation } from "react-router";


export function SearchBus() {
  const location = useLocation();
  const state = location.state || {};
  const [origin, setOrigin] = useState(state.origin || "");
  const [destination, setDestination] = useState(state.destination || "");
  const [date, setDate] = useState(state.date || "");
  const [error, setError] = useState("");

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [filteredOriginSuggestions, setFilteredOriginSuggestions] = useState([]);
  const [filteredDestinationSuggestions, setFilteredDestinationSuggestions] = useState([]);

  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const navigate = useNavigate();

  // fetch routes for autocomplete
  useEffect(() => {
    RouteService.getRoutes()
      .then((res) => {
        const routes = res.data;
        setOriginSuggestions([...new Set(routes.map((r) => r.origin))]);
        setDestinationSuggestions([...new Set(routes.map((r) => r.destination))]);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleOriginChange = (e) => {
    const value = e.target.value;
    setOrigin(value);
    if (value) {
      setFilteredOriginSuggestions(
        originSuggestions.filter((s) =>
          s.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else {
      setFilteredOriginSuggestions([]);
    }
  };

  const handleOriginSelect = (s) => {
    setOrigin(s);
    setFilteredOriginSuggestions([]);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    if (value) {
      setFilteredDestinationSuggestions(
        destinationSuggestions.filter((s) =>
          s.toLowerCase().startsWith(value.toLowerCase())
        )
      );
    } else {
      setFilteredDestinationSuggestions([]);
    }
  };

  const handleDestinationSelect = (s) => {
    setDestination(s);
    setFilteredDestinationSuggestions([]);
  };

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
          const seatsRes = await BusService.getAvailableSeats(bus.tripId);
          return { ...bus, availableSeats: seatsRes.data };
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

  if (!storedUserId) {
    sessionStorage.setItem(
      "pendingBooking",
      JSON.stringify({
        selectedBus,
        tripId: selectedBus.tripId,
        selectedSeats,
        origin,
        destination,
        date,
      })
    );

    alert("Only logged in users can book seats! Please login first.");
    navigate("/login", { state: { from: "/booking" } });
    return;
  }

  navigate("/booking", {
    state: {
      selectedBus,
      tripId: selectedBus.tripId,
      selectedSeats,
      userId: parseInt(storedUserId),
      origin,        
      destination,   
      date,          
    },
  });

  setSelectedSeats([]);
};

  const totalPrice = selectedBus ? selectedSeats.length * (selectedBus.fare || 0) : 0;

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">
          <FaBus className="me-2 text-primary" />
          Search Buses
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Search form */}
        <form onSubmit={handleSearch} className="row g-3 mb-4">
          <div className="col-md-4 position-relative">
            <label className="form-label">Origin</label>
            <input
              type="text"
              className="form-control"
              value={origin}
              onChange={handleOriginChange}
              placeholder="Enter origin"
              autoComplete="off"
            />
            {filteredOriginSuggestions.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10, cursor: "pointer" }}
              >
                {filteredOriginSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="list-group-item"
                    onClick={() => handleOriginSelect(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="col-md-4 position-relative">
            <label className="form-label">Destination</label>
            <input
              type="text"
              className="form-control"
              value={destination}
              onChange={handleDestinationChange}
              placeholder="Enter destination"
              autoComplete="off"
            />
            {filteredDestinationSuggestions.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10, cursor: "pointer" }}
              >
                {filteredDestinationSuggestions.map((s, i) => (
                  <li
                    key={i}
                    className="list-group-item"
                    onClick={() => handleDestinationSelect(s)}
                  >
                    {s}
                  </li>
                ))}
              </ul>
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
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selectedBus === bus ? "active" : ""}`}
                  onClick={() => handleSelectBus(bus)}
                >
                  <div>
                    <strong>{bus.busName}</strong> ({bus.busType}) <br />
                    Bus No: {bus.busNumber} <br />
                    Departure: {bus.departureTime} | Arrival: {bus.arrivalTime} <br />
                    Price per Seat: ₹{bus.fare} <br />
                    Total Seats: {bus.capacity} | Available: {bus.availableSeats.length}
                  </div>
                  <span className="badge bg-primary rounded-pill">Select</span>
                </button>
              ))}
            </div>
          </div>
        )}

        
        {selectedBus && (
          <div className="mt-4">
            <h4 className="text-center mb-3">
              Seats Layout - {selectedBus.busName} (₹{selectedBus.fare}/seat)
            </h4>
            <div className="d-flex justify-content-center">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(5, 60px)",
                  gap: "8px",
                }}
              >
                {Array.from({ length: selectedBus.capacity }, (_, i) => {
                  const seatNumber = `S${i + 1}`;
                  const isAvailable = selectedBus.availableSeats.includes(seatNumber);
                  const isSelected = selectedSeats.includes(seatNumber);

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
                      style={{
                        width: "60px",
                        height: "60px",
                        textAlign: "center",
                        lineHeight: "60px",
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        borderRadius: "8px",
                        transition: "transform 0.2s",
                        marginRight: i % 4 === 2 ? "20px" : "",
                      }}
                    >
                      {isAvailable ? seatNumber : ""}
                    </div>
                  );
                })}
              </div>
            </div>

            
            <div className="text-center mt-3">
              <h5>
                Selected Seats: {selectedSeats.length} | Total Price: ₹{totalPrice}
              </h5>
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