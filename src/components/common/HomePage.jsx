import logo from "C:/reactjs/projectstructure/src/assets/logo2.png"
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useState } from "react";
import RouteService from "../../service/RouteService";


export function HomePage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [routes, setRoutes] = useState([]);
  const [filteredOrigin, setFilteredOrigin] = useState([]);
  const [filteredDestination, setFilteredDestination] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  
  useEffect(() => {
    RouteService.getRoutes()
      .then((res) => setRoutes(res.data))
      .catch((err) => console.error("Error fetching routes:", err));
  }, []);

  
  const handleOriginChange = (value) => {
    setOrigin(value);
    if (value.trim().length > 0) {
      const uniqueOrigins = [...new Set(routes.map((r) => r.origin))];
      const filtered = uniqueOrigins.filter((o) =>
        o.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredOrigin(filtered);
    } else {
      setFilteredOrigin([]);
    }
  };

  
  const handleDestinationChange = (value) => {
    setDestination(value);
    if (value.trim().length > 0) {
      const uniqueDestinations = [...new Set(routes.map((r) => r.destination))];
      const filtered = uniqueDestinations.filter((d) =>
        d.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredDestination(filtered);
    } else {
      setFilteredDestination([]);
    }
  };

  const handleSearch = () => {
    if (!origin || !destination || !date) {
      setError("Please enter origin, destination, and date!");
      return;
    }
    if (origin.toLowerCase() === destination.toLowerCase()) {
      setError("Origin and destination cannot be the same!");
      return;
    }
    navigate("/searchbus", { state: { origin, destination, date } });
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "40px 20px",
        backgroundColor: "#f0f4f8",
      }}
    >
      <div>
        <img src={logo} alt="Bus Ticket System Logo" width={300} height={300} />
      </div>
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "700",
          color: "#0d6efd",
          marginBottom: "20px",
        }}
      >
        Welcome to SwiftBus
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#6c757d",
          maxWidth: "600px",
          lineHeight: "1.6",
        }}
      >
        Book your bus tickets quickly and easily. Enjoy a seamless travel
        experience with our reliable and convenient service.
      </p>

    
      <div
        className="card shadow-sm p-4 mt-4"
        style={{ maxWidth: "700px", width: "100%" }}
      >
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="row g-3">
          
          <div className="col-md-4 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Origin"
              value={origin}
              onChange={(e) => handleOriginChange(e.target.value)}
              onBlur={() => setTimeout(() => setFilteredOrigin([]), 200)}
            />
            {filteredOrigin.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10 }}
              >
                {filteredOrigin.map((s, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      setOrigin(s);
                      setFilteredOrigin([]);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

         
          <div className="col-md-4 position-relative">
            <input
              type="text"
              className="form-control"
              placeholder="Destination"
              value={destination}
              onChange={(e) => handleDestinationChange(e.target.value)}
              onBlur={() => setTimeout(() => setFilteredDestination([]), 200)}
            />
            {filteredDestination.length > 0 && (
              <ul
                className="list-group position-absolute w-100"
                style={{ zIndex: 10 }}
              >
                {filteredDestination.map((s, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => {
                      setDestination(s);
                      setFilteredDestination([]);
                    }}
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

         
          <div className="col-12 text-center">
            <button className="btn btn-primary btn-lg" onClick={handleSearch}>
              Search Buses
            </button>
          </div>
        </div>
      </div>

      {/* <div style={{ marginTop: "30px" }}>
        <a
          href="/login"
          className="btn btn-primary me-3"
          style={{ padding: "10px 25px", fontSize: "1rem" }}
        >
          Login
        </a>
        <a
          href="/register"
          className="btn btn-success"
          style={{ padding: "10px 25px", fontSize: "1rem" }}
        >
          Register
        </a>
      </div> */}
    </div>
  );
}