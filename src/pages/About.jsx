import React from 'react';
import { Helmet } from 'react-helmet-async';
import './About.css';

const About = () => {
    return (
        <div className="container about-container">
            <Helmet>
                <title>Our Process - H&G Flour Mill | Quality & Purity</title>
                <meta name="description" content="Discover the rigourous 3-step process behind H&G Flour Mill's premium quality. Washing, Drying, and Grinding to perfection." />
            </Helmet>

            <div className="about-header">
                <h1>The H&G Standard</h1>
                <p className="subtitle">Purity in Every Gram of Spices & Grains</p>
            </div>

            <div className="process-grid">
                <div className="glass-panel process-card">
                    <div className="step-number">01</div>
                    <h2>Purification</h2>
                    <h3 className="step-title">The Washing Process</h3>
                    <p>
                        Our journey begins with absolute purification. We believe that premium quality starts with a clean slate.
                        Every batch of raw grain undergoes a rigorous deep-cleansing process to remove every trace of dust,
                        soil, and impurities. We don't just rinse; we purify, ensuring that the foundation of our  Spices & Grains
                        is nothing but pure, unadulterated goodness.
                    </p>
                </div>

                <div className="glass-panel process-card">
                    <div className="step-number">02</div>
                    <h2>Preservation</h2>
                    <h3 className="step-title">The Drying Process</h3>
                    <p>
                        Once purified, the  Spices & Grains enter our preservation stage. To ensure longevity and prevent any spoilage,
                        we meticulously remove all moisture. utilizing both traditional sun-drying methods and in-house build
                        machine drying where consistent climate control is needed. This step locks in the natural nutrients
                        and ensures the  Spices & Grains remains fresh and ready for the mill.
                    </p>
                </div>

                <div className="glass-panel process-card">
                    <div className="step-number">03</div>
                    <h2>Perfection</h2>
                    <h3 className="step-title">The Grinding Process</h3>
                    <p>
                        The finale is a symphony of precision. Our grinding process is where potential becomes product.
                        Using advanced milling technology, we pulverize the dried  Spices & Grains into a fine, consistent powder.
                        This isn't just crushing; it's extracting the very essence, robust flavor, and vital nutrition
                        of the  Spices & Grains, delivering a product that truly elevates your cooking.
                    </p>
                </div>
            </div>

            <div className="glass-panel ethos-panel">
                <h3>Our Promise</h3>
                <p>
                    At H&G Flour Mill, we don't take shortcuts. We believe that the care we put into our process
                    directly translates to the taste on your plate. From the first wash to the final grind,
                    our commitment to excellence is unyielding.
                </p>
            </div>

            <div className="location-section">
                <h2>Visit Us</h2>
                <div className="glass-panel map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3906.891459459767!2d75.680073!3d11.7020995!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba680269cc1680f%3A0x33aa4718e1eaf26b!2sH%26G%20Flour%20Mill!5e0!3m2!1sen!2sin!4v1769449328855!5m2!1sen!2sin"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="H&G Flour Mill Location"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default About;
