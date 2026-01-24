import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Navbar />
            <main className="container" style={{ flex: 1, paddingBottom: '2rem' }}>
                <Outlet />
            </main>
            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-dark)',
                borderTop: '1px solid #e2e8f0'
            }}>
                <p>© 2026 H&G Flour Mill. Premium Quality Food Products.</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                    Contact: {import.meta.env.VITE_FOOTER_PHONE_NUMBER}
                </p>
            </footer>
        </div>
    );
};

export default Layout;
