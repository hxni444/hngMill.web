import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdaImg from '../assets/Cooking Guide/Ada.jpg';
import KunjiPathilImg from '../assets/Cooking Guide/Kunji Pathil.jpg';
import NoolPuttImg from '../assets/Cooking Guide/Nool Putt.jpg';
import OttuPathilImg from '../assets/Cooking Guide/Ottu Pathil.jpg';
import './CookingGuide.css';

const CookingGuide = () => {

    const dishes = [
        { title: 'Ada', img: AdaImg },
        { title: 'Kunji Pathil', img: KunjiPathilImg },
        { title: 'Nool Putt', img: NoolPuttImg },
        { title: 'Ottu Pathil', img: OttuPathilImg },
    ];

    return (
        <div className="container cooking-guide-container">
            <Helmet>
                <title>Cooking Guide - Rice Powder | H&G Flour Mill</title>
                <meta name="description" content="Learn how to make soft Pathiri and delicious Noolputtu using H&G Flour Mill's premium Rice Powder." />
            </Helmet>

            <h1 className="guide-title">Rice Powder Cooking Guide</h1>
            <p className="guide-subtitle">Perfect recipes for your H&G Fresh Rice Powder</p>

            <div className="dish-gallery-section">
                <h2 className="section-title">Dishes that can be cooked with our All in one rice powder</h2>
                <div className="dish-gallery-scroll">
                    {dishes.map((dish, index) => (
                        <div key={index} className="dish-card">
                            <img src={dish.img} alt={dish.title} className="dish-image" />
                            <p className="dish-title">{dish.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="glass-panel recipe-card single-instruction-card">
                <div className="recipe-header">
                    <h2>Preparation Instructions</h2>
                    <span className="recipe-tag">For Soft Pathiri, Noolputtu, and more</span>
                </div>
                <div className="recipe-content">
                    <div className="instructions-container">
                        <div className="lang-section english">
                            <h3>Preparation Guide</h3>
                            <p className="main-instruction"><strong>Use 1:1 Ratio:</strong> Equal parts Water and Rice Powder.</p>
                            <p className="sub-instruction">Add more water if needed.</p>
                        </div>

                        <div className="section-divider"></div>

                        <div className="lang-section malayalam">
                            <h3>തയ്യാറാക്കുന്ന വിധം</h3>
                            <p className="main-instruction"><strong>1:1 അനുപാതം ഉപയോഗിക്കുക:</strong> തുല്യ അളവിൽ വെള്ളവും അരിപ്പൊടിയും എടുക്കുക.</p>
                            <p className="example-text">(ഉദാഹരണം: ഒരു കപ്പ് അരിപ്പൊടിക്ക് ഒരു കപ്പ് വെള്ളം)</p>
                            <p className="sub-instruction">ആവശ്യമെങ്കിൽ കൂടുതൽ വെള്ളം ചേർക്കുക.</p>
                        </div>
                    </div>

                    <div className="important-note-card">
                        <div className="note-icon">ℹ️</div>
                        <div className="note-text">
                            <p className="en-note"><strong>Note:</strong> No need to use hot water for our product.</p>
                            <p className="ml-note"><strong>ശ്രദ്ധിക്കുക:</strong> ഞങ്ങളുടെ ഉൽപ്പന്നത്തിന് ചൂടുവെള്ളം ഉപയോഗിക്കേണ്ടതില്ല.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookingGuide;
