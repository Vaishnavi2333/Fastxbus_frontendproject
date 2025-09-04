import { useNavigate } from "react-router";
import { useState,useEffect } from "react";

import { House, People, BusFront, CalendarCheck, Map, SignpostSplit, Truck } from "react-bootstrap-icons";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    { label: "Bus Operator Requests", path: "/bus-operator-approvals", icon: <People size={40} /> },
    { label: "Manage Bus Operators", path: "/adminviewbusop", icon: <BusFront size={40} /> },
    { label: "Manage Users", path: "/usermanage", icon: <People size={40} /> },
    { label: "Manage Bookings", path: "/adminbooking", icon: <CalendarCheck size={40} /> },
    { label: "Manage Routes", path: "/adminroute", icon: <Map size={40} /> },
    { label: "Manage Trips", path: "/admintrip", icon: <SignpostSplit size={40} /> },
    { label: "Manage Bus", path: "/adminbus", icon: <Truck size={40} /> },
  ];

  return (
    <div className="container my-5">
      <h2 className="text-center mb-5">Admin Dashboard</h2>

      <div className="row g-4">
        {dashboardItems.map((item, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div
              className="card shadow-sm h-100 text-center p-4"
              style={{ cursor: "pointer", transition: "transform 0.2s" }}
              onClick={() => navigate(item.path)}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="mb-3">{item.icon}</div>
              <h5 className="card-title">{item.label}</h5>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}