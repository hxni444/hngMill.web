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
                <p className="subtitle">Purity in Every Grain, Perfection in Every Pack.</p>
            </div>

            <div className="process-grid">
                <div className="glass-panel process-card">
                    <div className="step-number">01</div>
                    <h2>Purification</h2>
                    <h3 className="step-title">The Washing Process</h3>
                    <p>
                        Our journey begins with absolute purification. We believe that premium quality starts with a clean slate.
                        Every batch of raw grain undergoes a rigorous deep-cleansing process to remove every trace of dust,
                        soil, and impurities. We don't just rinse; we purify, ensuring that the foundation of your flour
                        is nothing but pure, unadulterated goodness.
                    </p>
                </div>

                <div className="glass-panel process-card">
                    <div className="step-number">02</div>
                    <h2>Preservation</h2>
                    <h3 className="step-title">The Drying Process</h3>
                    <p>
                        Once purified, the grains enter our preservation stage. To ensure longevity and prevent any spoilage,
                        we meticulously remove all moisture. utilizing both traditional sun-drying methods and state-of-the-art
                        machine drying where consistent climate control is needed. This step locks in the natural nutrients
                        and ensures the grain remains fresh and ready for the mill.
                    </p>
                </div>

                <div className="glass-panel process-card">
                    <div className="step-number">03</div>
                    <h2>Perfection</h2>
                    <h3 className="step-title">The Grinding Process</h3>
                    <p>
                        The finale is a symphony of precision. Our grinding process is where potential becomes product.
                        Using advanced milling technology, we pulverize the dried grains into a fine, consistent powder.
                        This isn't just crushing; it's extracting the very essence, robust flavor, and vital nutrition
                        of the grain, delivering a product that truly elevates your cooking.
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
        </div>
    );
};

export default About;
