import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './WelcomePopup.css';

const WelcomePopup = () => {
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hg_has_visited');
        if (!hasVisited) {
            // Delay slightly for effect
            const timer = setTimeout(() => {
                setShowPopup(true);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setShowPopup(false);
        localStorage.setItem('hg_has_visited', 'true');
    };

    if (!showPopup) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-card">
                <button className="popup-close-btn" onClick={handleClose}>
                    &times;
                </button>

                <div className="popup-content">
                    <div className="popup-icon">🌾</div>
                    <h2 className="popup-title">Welcome to H&G Flour Mill!</h2>
                    <p className="popup-message">
                        Digital Ordering Platform <br />
                        Where you can order our <strong>Fresh & Pure</strong> Powdered Spices and Grains.
                    </p>

                    <Link to="/order" className="btn btn-primary popup-cta" onClick={handleClose}>
                        Try Ordering Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default WelcomePopup;
