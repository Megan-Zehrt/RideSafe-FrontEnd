import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import "../Styling/RideForm.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const RideForm = () => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const navigate = useNavigate();
  const { passengerId, driverId } = useParams();

  // Load Google Maps API
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setGoogleLoaded(true);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    } else {
      setGoogleLoaded(true);
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      passengerId: passengerId || "",
      driverId: driverId || "",
      fromLocation: "",
      toLocation: "",
      fromLatitude: "",
      fromLongitude: "",
      toLatitude: "",
      toLongitude: "",
      status: "PENDING",
      isPaid: false,
      passengerAmount: "1", // Set to 1 by default
      rate: 10, // You can start with a default rate if necessary
    },
    validationSchema: Yup.object({
      passengerId: Yup.string().required("Passenger ID is required"),
      driverId: Yup.string().required("Driver ID is required"),
      fromLocation: Yup.string().required("Pickup location is required"),
      toLocation: Yup.string().required("Dropoff location is required"),
      passengerAmount: Yup.number()
        .required("Passenger count is required")
        .min(1, "Must be at least 1")
        .max(5, "Cannot exceed 5 passengers"),
    }),
    onSubmit: async (values) => {
      try {
        // Fetch the driver's rate
        const driverResponse = await axios.get(`http://localhost:8080/driver/${values.driverId}`);
        console.log("Driver Response:", driverResponse.data); // Check the structure of the response
    
        // Access the correct driverRate field from the response
        const driversRate = driverResponse.data.driverRate; // Correctly access driverRate
    
        console.log("Driver's Rate:", driversRate);  // This should now give the correct rate
    
        if (!driversRate) {
          throw new Error("Driver's rate is not available");
        }
    
        // Calculate total rate dynamically
        const calculatedRate = driversRate * values.passengerAmount;
        const rideData = { ...values, rate: calculatedRate }; // Add calculated rate to the values
    
        const response = await axios.post("http://localhost:8080/rides/save", rideData);
    
        if (response.data && response.data.rideId) {
          localStorage.setItem("rideId", response.data.rideId);
          localStorage.setItem("passengerAmount", values.passengerAmount);
          navigate(`/ride/checkout`);
        } else {
          console.error("Error: Ride ID is undefined in response data", response.data);
        }
      } catch (error) {
        console.error("Error fetching driver rate or saving ride:", error);
      }
    }
    
  });

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (googleLoaded && window.google) {
      const options = { types: ["geocode"] };

      const setupAutocomplete = (id, latField, lngField) => {
        const input = document.getElementById(id);
        if (input) {
          const autocomplete = new window.google.maps.places.Autocomplete(input, options);
          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
              formik.setFieldValue(latField, place.geometry.location.lat());
              formik.setFieldValue(lngField, place.geometry.location.lng());
              formik.setFieldValue(id, place.formatted_address);
            }
          });
        }
      };

      setupAutocomplete("fromLocation", "fromLatitude", "fromLongitude");
      setupAutocomplete("toLocation", "toLatitude", "toLongitude");
    }
  }, [googleLoaded]);

  return (
    <div className="form-container">
      <form onSubmit={formik.handleSubmit} className="form-content">
        <h2 className="form-title">Where are we going today?</h2>

        <input name="passengerId" type="hidden" value={formik.values.passengerId} />
        <input name="driverId" type="hidden" value={formik.values.driverId} />
        <input name="status" type="hidden" value={formik.values.status} />

        <label>Pickup Location</label>
        <input
          id="fromLocation"
          className="form-input"
          name="fromLocation"
          type="text"
          placeholder="Enter pickup location"
          value={formik.values.fromLocation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.fromLocation && formik.errors.fromLocation && (
          <div className="error-message">{formik.errors.fromLocation}</div>
        )}

        <label>Dropoff Location</label>
        <input
          id="toLocation"
          className="form-input"
          name="toLocation"
          type="text"
          placeholder="Enter dropoff location"
          value={formik.values.toLocation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.toLocation && formik.errors.toLocation && (
          <div className="error-message">{formik.errors.toLocation}</div>
        )}

        <label>Number of Passengers</label>
        <select
          className="form-input"
          name="passengerAmount"
          value={formik.values.passengerAmount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        {formik.touched.passengerAmount && formik.errors.passengerAmount && (
          <div className="error-message">{formik.errors.passengerAmount}</div>
        )}

        <button type="submit" className="form-button">
          Book Ride
        </button>
      </form>
    </div>
  );
};

export default RideForm;
