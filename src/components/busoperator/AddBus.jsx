import { useState } from "react";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import BusService from "../../service/BusService";

const AddBus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const editingBus = location.state?.bus; 

  const [bus, setBus] = useState({
    busId: "",
    busName: "",
    busNumber: "",
    busType: "",
    capacity: "",
    status: "Available",
    amenities: [{ amenityName: "" }],
  });

  useEffect(() => {
    if (editingBus) {
      setBus(editingBus); 
    }
  }, [editingBus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBus({ ...bus, [name]: value });
  };

  const handleAmenityChange = (index, value) => {
    const newAmenities = [...bus.amenities];
    newAmenities[index].amenityName = value;
    setBus({ ...bus, amenities: newAmenities });
  };

  const addAmenityField = () => {
    setBus({ ...bus, amenities: [...bus.amenities, { amenityName: "" }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (bus.busId) {
      
        await BusService.updateBus(bus);
        alert("Bus updated successfully!");
      } else {
        
        await BusService.addBus(bus);
        alert("Bus added successfully!");
      }
      navigate("/busoperator/buses");
    } catch (err) {
      console.error(err);
      alert("Error saving bus.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4 text-center">
        {bus.busId ? "Update Bus" : "Add Bus"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Bus Name</label>
            <input
              type="text"
              name="busName"
              className="form-control"
              placeholder="Bus Name"
              value={bus.busName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Bus Number</label>
            <input
              type="text"
              name="busNumber"
              className="form-control"
              placeholder="Bus Number"
              value={bus.busNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Bus Type</label>
            <input
              type="text"
              name="busType"
              className="form-control"
              placeholder="Bus Type"
              value={bus.busType}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Capacity</label>
            <input
              type="number"
              name="capacity"
              className="form-control"
              placeholder="Capacity"
              value={bus.capacity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={bus.status}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        <h4 className="mt-4">Amenities</h4>
        {bus.amenities.map((a, idx) => (
          <div key={idx} className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder={`Amenity ${idx + 1}`}
              value={a.amenityName}
              onChange={(e) => handleAmenityChange(idx, e.target.value)}
            />
          </div>
        ))}

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={addAmenityField}
          >
            + Add Amenity
          </button>
        </div>

        <div className="text-center">
          <button type="submit" className="btn btn-primary btn-lg">
            {bus.busId ? "Update Bus" : "Add Bus"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBus;