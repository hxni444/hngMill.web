import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Home = () => {
    return (
        <div style={{ padding: '2rem 0' }}>
            <Helmet>
                <title>Home - H&G Flour Mill | Fresh Spices & Flour</title>
                <meta name="description" content="Welcome to H&G Flour Mill. Purest grains and finest flour, fresh from the mill. Order turmeric, chilli, coriander and more online." />
            </Helmet>
            {/* Hero Section */}
            <section style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, #ecfdf5 0%, #ffffff 100%)',
                marginBottom: '3rem',
                border: '1px solid #d1fae5'
            }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: '#065f46' }}>
                    Purest <span style={{ color: 'var(--color-accent)' }}>Grains</span>, <br />
                    Finest <span style={{ color: 'var(--color-primary)' }}>Flour</span>.
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    Experience the authentic taste of freshly milled spices and grains.
                    Direct from H&G Flour Mill to your kitchen.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/order" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                        Order Fresh Products
                    </Link>
                    <Link to="/estimate" className="btn" style={{
                        backgroundColor: 'white',
                        border: '2px solid var(--color-primary)',
                        color: 'var(--color-primary)',
                        textDecoration: 'none'
                    }}>
                        Check Grinding Rates
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Why Choose H&G?</h2>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                <FeatureCard
                    title="Premium Quality"
                    desc="We select only the finest raw materials for milling."
                    icon="✨"
                />
                <FeatureCard
                    title="Freshly Milled"
                    desc="Zero preservatives. Milled frequently for maximum flavor."
                    icon="🍃"
                />
                <FeatureCard
                    title="Custom Grinding"
                    desc="Get your rice milled exactly how you like it"
                    icon="⚙️"
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ title, desc, icon }) => (
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ color: '#64748b' }}>{desc}</p>
    </div>
);

export default Home;
