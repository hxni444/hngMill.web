import React from 'react';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="glass-panel navbar-panel">
            <Link to="/" className="brand-link">
                <h2 className="brand-title">
                    <span className="brand-highlight">H&G</span> Flour Mill
                </h2>
            </Link>

            <div className="nav-links-container">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/order" className="nav-link">Order Now</Link>
                <Link to="/about" className="nav-link">About Us</Link>

            </div>
        </nav>
    );
};

export default Navbar;
