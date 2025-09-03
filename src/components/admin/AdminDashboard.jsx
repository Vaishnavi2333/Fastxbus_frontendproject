import { useNavigate } from "react-router";
import { useState,useEffect } from "react";
import axiosInstance from "../../http-common";


export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <div className="d-flex flex-column gap-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/bus-operators")}
        >
          Manage Bus Operators
        </button>


       
      </div>

       <div className="d-flex flex-column gap-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/usermanage")}
        >
          Manage Users
        </button>

        </div>

       <div className="d-flex flex-column gap-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => navigate("/adminbooking")}
        >
          Manage Bookings
        </button>
        
        

       
      </div>
    </div>
  );
}