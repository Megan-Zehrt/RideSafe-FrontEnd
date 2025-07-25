import React from 'react';
import { Link } from 'react-router-dom';
import '../Styling/Test.css';

const Test = () => {
    return (
        <div className="test-container">
            <h1 className="test-header">ROUTES</h1>

            <div className="route-section">
                <h2 className="section-title">Landing Page</h2>
                <Link className="route-card" to="/">RegisterDriverLandingPage</Link>
            </div>

            <div className="route-section">
                <h2 className="section-title">Admin Routes</h2>
                <Link className="route-card" to="/admin/home">AdminHome</Link>
            </div>

            <div className="route-section">
                <h2 className="section-title">Driver Routes</h2>
                <Link className="route-card" to="/drivers/all">AllDrivers</Link>
                <Link className="route-card" to="/one/driver/67ef0bc76b18b16e97e08a5f">SingleDriver</Link>
                <Link className="route-card" to="/login/driver">LoginDriver</Link>
                <Link className="route-card" to="/register/driver">Register Driver</Link>
                <Link className="route-card" to="/register/driver/google">GoogleRegisterDriver</Link>
                <Link className="route-card" to="/driver/home/67ef0bc76b18b16e97e08a5f">DriverHomePage</Link>
                <Link className="route-card" to="/edit/driver/67ef0bc76b18b16e97e08a5f/info">EditDriver</Link>
                <Link className="route-card" to="/driver/67ef0bc76b18b16e97e08a5f/verification/account/setup">Stripe Account</Link>
            </div>

            <div className="route-section">
                <h2 className="section-title">Passenger Routes</h2>
                <Link className="route-card" to="/passengers/all">AllPassengers</Link>
                <Link className="route-card" to="/register/passenger">RegisterPassenger</Link>
                <Link className="route-card" to="/register/passenger/google">GoogleRegisterPassenger</Link>
                <Link className="route-card" to="/login/passenger">LoginPassenger</Link>
                <Link className="route-card" to="/Passenger/show1/Booking">PassengerShow1</Link>
                <Link className="route-card" to="/Passenger/home">PassengerHomePage</Link>
                <Link className="route-card" to="/Passenger/home/settings">PassengerSettings</Link>
            </div>

            <div className="route-section">
                <h2 className="section-title">Ride Routes</h2>
                <Link className="route-card" to="/passenger/67ed9b2f11ba6e07ea1c4117/book/ride/driver/67ef0bc76b18b16e97e08a5f">RideForm</Link>
                <Link className="route-card" to="/view/ride/googlemaps">ViewGoogleMaps</Link>
                <Link className="route-card" to="/passenger/ride/waiting">PassengerRideWaitingScreen</Link>
            </div>

            <div className="route-section">
                <h2 className="section-title">Google API Routes</h2>
                <Link className="route-card" to="/google/signin/driver">GoogleSignIn Driver</Link>
                <Link className="route-card" to="/google/signin/passenger">GoogleSignIn Passenger</Link>
            </div>

            <div className="route-section">
                <h2 className="section-title">Payment Routes</h2>
                <Link className="route-card" to="/ride/checkout">CheckoutForm</Link>
            </div>

            <div className="route-section">
                <h2 className="section-title">TODO*</h2>
                <p className="todo-item">Add Passenger Home Page ("/Passenger/:id")</p>
                <p className="todo-item">implement importing driver address into Google or Apple Maps</p>
                <p className="todo-item">Add Backend Route Logic for Driver Rating</p>
                <p className="todo-item">Validating token and email service method for security</p>
                <p className="todo-item">Route Validation</p>
                <p className="todo-item">Email Verification? No duplicate emails</p>
                <p className="todo-item">Add Function to Admin Panel (Accept, Decline, info rendering etc)</p>
                <p className="todo-item">Show driver rating</p>
                <p className="todo-item">Implement more dark and light modes to pages</p>
                <p className="todo-item">## STYLE THE FOLLOWING ... ###</p>
                <p className="todo-item">no styling todo for now</p>
            </div>
        </div>
    );
};

export default Test;
