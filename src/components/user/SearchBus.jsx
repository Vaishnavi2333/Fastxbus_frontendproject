
import { useState } from "react";
import { useEffect } from "react";
import axiosInstance from "../../http-common";
import { useNavigate } from "react-router";

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

  // Fetch routes for suggestions
  useEffect(() => {
    axiosInstance
      .get("/route/getall")
      .then((res) => {
        const routes = res.data;
        setOriginSuggestions([...new Set(routes.map((r) => r.origin))]);
        setDestinationSuggestions([...new Set(routes.map((r) => r.destination))]);
      })
      .catch((err) => console.error("Error fetching routes:", err));
  }, []);

  const getFilteredSuggestions = (value, list) => {
    if (!value) return [];
    return list.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
  };

  const handleSelectOrigin = (s) => {
    setOrigin(s);
    setOriginSuggestions([]); // clear dropdown
  };

  const handleSelectDestination = (s) => {
    setDestination(s);
    setDestinationSuggestions([]); // clear dropdown
  };

  const handleSearch = (e) => {
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

    axiosInstance
      .get(`/bus/search/${origin}/${destination}/${date}`)
      .then(async (res) => {
        if (res.data.length === 0) {
          setError("No buses available for the selected date and route!");
          return;
        }

        // Fetch available seats for each bus
        const busesWithSeats = await Promise.all(
          res.data.map(async (bus) => {
            try {
              const seatsRes = await axiosInstance.get(
                `/bus/available-seats/${bus.tripId}`
              );
              return { ...bus, availableSeats: seatsRes.data };
            } catch {
              return { ...bus, availableSeats: [] };
            }
          })
        );

        setBuses(busesWithSeats);
        setSelectedBus(null);
        setSelectedSeats([]);
      })
      .catch((err) => {
        console.error(err);
        setError("Something went wrong while searching for buses.");
      });
  };

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setSelectedSeats([]);
  };

  const toggleSeat = (seat) => {
    setSelectedSeats((prev) =>
      prev.includes(seat)
        ? prev.filter((s) => s !== seat)
        : [...prev, seat]
    );
  };

  const handleBookSeats = () => {
    if (!selectedSeats.length) {
      alert("Please select at least one seat!");
      return;
    }

    // Update available seats in buses list
    const updatedBuses = buses.map((bus) =>
      bus.tripId === selectedBus.tripId
        ? {
            ...bus,
            availableSeats: bus.availableSeats.filter(
              (s) => !selectedSeats.includes(s)
            ),
          }
        : bus
    );
    setBuses(updatedBuses);

    // Update selected bus
    setSelectedBus((prev) => ({
      ...prev,
      availableSeats: prev.availableSeats.filter(
        (s) => !selectedSeats.includes(s)
      ),
    }));

    // Navigate to booking page
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

  return (
    <div className="container my-5">
      <div className="card shadow-sm p-4">
        <h2 className="text-center mb-4">Search Buses</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSearch} className="row g-3">
          {/* Origin */}
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

          {/* Destination */}
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

          {/* Date */}
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

        {/* Available Buses */}
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

        {/* Seat Selection */}
        {selectedBus &&
          selectedBus.availableSeats &&
          selectedBus.availableSeats.length > 0 && (
            <div className="mt-4">
              <h4>Available Seats for {selectedBus.busName}</h4>
              <div className="d-flex flex-wrap gap-2">
               {selectedBus.availableSeats.map((seat) => (
     <div
    key={seat}
    onClick={() => toggleSeat(seat)}
    className={`btn ${
      selectedSeats.includes(seat) ? "btn-success" : "btn-outline-secondary"
    }`}
    style={{ width: "60px", height: "60px", whiteSpace: "nowrap" }}
  >
    {seat}  
  </div>
))}
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