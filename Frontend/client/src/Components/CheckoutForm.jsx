import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "../Styling/CheckoutForm.css";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");
  const [rideAmount, setRideAmount] = useState(null); 

  const rideId = localStorage.getItem("rideId");
  const passengerCount = localStorage.getItem("passengerCount");

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchRideAmount = async () => {
      try {
        if (!rideId || !passengerCount) {
          setError("Missing ride details.");
          return;
        }

        const response = await fetch(`/api/get-ride-amount?rideId=${rideId}&passengerCount=${passengerCount}`);
        if (!response.ok) throw new Error("Failed to fetch ride amount.");

        const data = await response.json();
        setRideAmount(data.amount);
      } catch (error) {
        console.error("Error fetching ride amount:", error);
        setError("Failed to retrieve ride amount.");
      }
    };

    fetchRideAmount();
  }, [rideId, passengerCount]);

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements || rideAmount === null || !rideId || !passengerCount) {
      setError("Missing ride details. Please try again.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: rideAmount, paymentRequestRideId: rideId, passengerCount }),
      });

      if (!response.ok) throw new Error("Failed to create payment intent.");

      const { clientSecret } = await response.json();

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setError(error.message);
        setSuccess(false);
      } else if (paymentIntent.status === "succeeded") {
        setSuccess(true);
      }
    } catch (err) {
      setError("Something went wrong.");
    }

    setLoading(false);
  };

  const CancelPayment = () => {
    navigate("/Passenger/home");
  };

  return (
    <div className="checkout-container">
      <button className="dark-mode-toggle" onClick={handleToggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div className="checkout-box">
        <h2 className="checkout-title">Checkout</h2>
        {rideAmount === null ? (
          <p>Loading ride amount...</p>
        ) : (
          <>
            <p className="amount-display">Total: ${(rideAmount / 100).toFixed(2)}</p>
            <form onSubmit={handleSubmit}>
              <div className="card-input">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: darkMode ? "white" : "black",
                        "::placeholder": { color: darkMode ? "#ccc" : "#666" },
                      },
                      invalid: { color: "#ff4d4d" },
                    },
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !stripe || rideAmount === null}
                className="pay-button"
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">Payment Successful!</p>}
            </form>
            <button className="cancel-button" onClick={CancelPayment}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutForm;
