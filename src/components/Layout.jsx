import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

import './Layout.css';

const Layout = () => {
    return (
        <div className="layout-wrapper">
            <Navbar />
            <main className="container main-content">
                <Outlet />
            </main>
            <footer className="site-footer">
                <p>© 2026 H&G Flour Mill. Premium Quality Food Products.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    Contact: <a href={`tel:${import.meta.env.VITE_FOOTER_PHONE_NUMBER}`} style={{ color: 'inherit', textDecoration: 'none' }}>{import.meta.env.VITE_FOOTER_PHONE_NUMBER}</a> • <a href="https://maps.app.goo.gl/annHu55jWxpfxtiE6" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>📍 Locate Us</a>
                </p>
            </footer>
        </div>
    );
};

export default Layout;
