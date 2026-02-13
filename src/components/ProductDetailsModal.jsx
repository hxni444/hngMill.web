import React from 'react';
import './ProductDetailsModal.css';
import { Link } from 'react-router-dom';

const ProductDetailsModal = ({ product, image, malayalamName, onClose }) => {
    if (!product) return null;

    // Customize descriptions based on product type
    let descriptions = [
        "Sourced from the finest farms.",
        "Washed, Dried, and Ground to perfection.",
        "100% Pure & Preservative Free.",
        "Freshness locked in every gram."
    ];

    if (product.name.toLowerCase().includes('oil')) {
        descriptions = [
            "Sourced from premium Kerala coconuts.",
            "100% Pure & Sulphur Free.",
            "Traditional Cold Pressed (Chekku) extraction.",
            "Zero additives or heating.",
            "Natural aroma and authentic taste."
        ];
    } else if (product.name.toLowerCase().includes('putt') || product.name.toLowerCase().includes('rice')) {
        descriptions = [
            "Premium Rice carefully selected.",
            "Perfectly roasted for soft texture.",
            "100% Natural & Chemical Free.",
            "Ideal for authentic breakfast dishes."
        ];
    }

    const isLiquid = product.name.toLowerCase().includes('oil');
    // Ensure it strictly matches Rice Powder and excludes Puttu
    const isRice = product.name.toLowerCase().includes('rice powder') && !product.name.toLowerCase().includes('putt');
    const displayPrice = parseFloat(product.price) === 0 ? 'xxx' : product.price;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>

                <div className="modal-image-container">
                    <img
                        src={image}
                        alt={product.name}
                        className={`modal-product-image ${product.stock_out ? 'grayscale' : ''}`}
                    />
                    {product.stock_out && <div className="modal-stock-badge">Out of Stock</div>}
                </div>

                <div className="modal-content">
                    <h2 className="modal-title">{product.name}</h2>
                    {malayalamName && <h3 className="modal-subtitle-ml">{malayalamName}</h3>}

                    <div className="modal-price-tag">
                        ₹{displayPrice} <span className="unit">/ {isLiquid ? 'L' : 'kg'}</span>
                    </div>

                    <div className="modal-description">
                        <p><strong>Our Promise:</strong></p>
                        <ul className="modal-features">
                            {descriptions.map((desc, i) => (
                                <li key={i}>{desc}</li>
                            ))}
                        </ul>
                        <p className="modal-note">
                            Experience the authentic taste of H&G Flour Mill.
                            Our {product.name.toLowerCase()} is processed with
                            the highest standards of purity and care.
                        </p>

                        {isRice && (
                            <Link to="/cooking-guide/rice-powder" className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem', textAlign: 'center' }}>
                                View Cooking Guide 👨‍🍳
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;
