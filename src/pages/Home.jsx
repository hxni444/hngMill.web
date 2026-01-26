import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            <Helmet>
                <title>Home - H&G Flour Mill | Fresh Spices & Flour</title>
                <meta name="description" content="Welcome to H&G Flour Mill. Purest grains and finest flour, fresh from the mill. Order turmeric, chilli, coriander and more online." />
            </Helmet>
            {/* Hero Section */}
            <section className="hero-section">
                <h1 className="hero-title">
                    Purest <span className="highlight-grains">Grains</span>, <br />
                    Finest <span className="highlight-flour">Flour</span>.
                </h1>
                <p className="hero-description">
                    Experience the authentic taste of freshly milled spices and grains.
                    Direct from H&G Flour Mill to your kitchen.
                </p>
                <div className="hero-buttons">
                    <Link to="/order" className="btn btn-primary hero-btn-primary">
                        Order Fresh Products
                    </Link>

                </div>
            </section>

            {/* Features Grid */}
            <h2 className="features-title">Why Choose H&G?</h2>
            <div className="features-grid">
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
    <div className="glass-panel feature-card">
        <div className="feature-icon">{icon}</div>
        <h3 className="feature-title">{title}</h3>
        <p className="feature-desc">{desc}</p>
    </div>
);

export default Home;
