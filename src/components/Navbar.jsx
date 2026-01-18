import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="glass-panel" style={{
            position: 'sticky',
            top: '1rem',
            zIndex: 100,
            margin: '0 1rem',
            padding: '0.8rem 1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem'
        }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--color-dark)', margin: 0 }}>
                    <span style={{ color: 'var(--color-primary)' }}>H&G</span> Flour Mill
                </h2>
            </Link>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/" style={linkStyle}>Home</Link>
                <Link to="/order" style={linkStyle}>Order Now</Link>
                <Link to="/estimate" style={linkStyle}>Price Estimate</Link>
            </div>
        </nav>
    );
};

const linkStyle = {
    textDecoration: 'none',
    color: 'var(--color-dark)',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'color 0.2s'
};

export default Navbar;
