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
                <p className="footer-contact">
                    Contact: {import.meta.env.VITE_FOOTER_PHONE_NUMBER}
                </p>
            </footer>
        </div>
    );
};

export default Layout;
