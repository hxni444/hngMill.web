import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import axiosClient from '../api/axiosClient';
import turmericImg from '../assets/Turmeric.jpg';
import corianderImg from '../assets/Coriander.jpg';
import corianderRoastedImg from '../assets/Coriander_Roasted.jpg';
import chilliImg from '../assets/chilli.png';
import kashmiriImg from '../assets/kashmiri.jpg';
import pathilImg from '../assets/Rice Powder.jpg';
import puttImg from '../assets/putt.jpg';
import wheatImg from '../assets/wheat.jpg';
import CoconutOilImg from '../assets/Coconut Oil.jpg'
import './Order.css';
import { getMalayalamName } from '../locales/productTranslations';
import ProductDetailsModal from '../components/ProductDetailsModal';

const Order = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axiosClient.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error("Error fetching products:", err))
            .finally(() => setLoading(false));
    }, []);

    const formatWeight = (weightInKg, name = "") => {
        const isLiquid = name.toLowerCase().includes('oil');
        const suffix = isLiquid ? 'L' : 'kg';
        const subSuffix = isLiquid ? 'ml' : 'g';

        if (weightInKg < 1) {
            return `${(weightInKg * 1000).toFixed(0)}${subSuffix}`;
        }
        return `${weightInKg}${suffix}`;
    };

    const addToCart = (product, weightInKg) => {
        // Determine max limit for this product
        const name = product.name.toLowerCase();
        let limit = parseFloat(import.meta.env.VITE_LIMIT_DEFAULT) || 10;
        const isLiquid = name.includes('oil');
        const unitLabel = isLiquid ? 'L' : 'kg';

        if (name.includes('turmeric')) limit = parseFloat(import.meta.env.VITE_LIMIT_TURMERIC) || 10;
        else if (name.includes('kashmiri')) limit = parseFloat(import.meta.env.VITE_LIMIT_KASHMIRI) || 10;
        else if (name.includes('chilli')) limit = parseFloat(import.meta.env.VITE_LIMIT_CHILLI) || 10;
        else if (name.includes('coriander') && name.includes('roasted')) limit = parseFloat(import.meta.env.VITE_LIMIT_CORIANDER_ROASTED) || 10;
        else if (name.includes('coriander')) limit = parseFloat(import.meta.env.VITE_LIMIT_CORIANDER) || 10;
        else if (name.includes('wheat')) limit = parseFloat(import.meta.env.VITE_LIMIT_WHEAT) || 10;
        else if (name.includes('putt')) limit = parseFloat(import.meta.env.VITE_LIMIT_RICE_PUTT) || 10;
        else if (name.includes('rice powder')) limit = parseFloat(import.meta.env.VITE_LIMIT_RICE_PATHIL) || 10;
        // Add specific limit for oil if needed, defaulting to 10 for now

        // Calculate current total weight for this product
        const currentWeightInCart = cart.reduce((total, item) => {
            return item.id === product.id ? total + (item.weight * item.qty) : total;
        }, 0);

        if (currentWeightInCart + weightInKg > limit) {
            alert(`Ordering is limited to ${limit}${unitLabel} per item for ${product.name}\nPlease visit the mill for large ordering`);
            return;
        }

        const existing = cart.find(item => item.id === product.id && item.weight === weightInKg);
        if (existing) {
            setCart(cart.map(item =>
                (item.id === product.id && item.weight === weightInKg)
                    ? { ...item, qty: item.qty + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, weight: weightInKg, qty: 1 }]);
        }
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            // Assuming price is per KG/L and weight is in KG/L
            return total + (parseFloat(item.price) * parseFloat(item.weight) * item.qty);
        }, 0);
    };

    const handleShare = () => {
        if (!cart.length) return;

        // Calculate total weight of the cart
        const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.qty), 0);

        if (totalWeight < 0.25) {
            alert("Total order quantity must be at least 250g/250ml to place an order.");
            return;
        }

        const total = calculateTotal();
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString();

        let message = `*H&G Flour Mill - Order Bill*\n`;
        message += `${date} at ${time}\n`;
        message += `------------------------------\n`;

        // Using code block for alignment in WhatsApp
        message += `\`\`\`\n`;
        message += `ITEM           QTY     AMT\n`;
        message += `------------------------------\n`;

        cart.forEach(item => {
            // Truncate name if too long to keep alignment
            let name = item.name.substring(0, 12).padEnd(14, ' ');
            let qty = `${item.qty}x${formatWeight(item.weight, item.name)}`.padStart(8, ' ');
            // Adjust qty formatting to be concise
            let weightStr = formatWeight(item.weight, item.name);
            // e.g. "1kg" or "500g"

            // Format: "Name  1x1kg  100"
            // Let's try to fit closely
            // Name: 12 chars
            // Qty: 8 chars
            // Price: rest

            let linePrice = (item.price * item.weight * item.qty).toFixed(0);
            let priceStr = `₹${linePrice}`.padStart(5, ' ');

            // Re-formatting for better fit
            // Turmeric      1x1kg    ₹200

            name = item.name.substring(0, 13).padEnd(14, ' ');

            // Combine qty and weight: 1 x 1kg
            let qtyWeight = `${item.qty} x ${weightStr}`;
            if (qtyWeight.length > 9) {
                // compact if long
                qtyWeight = `${item.qty}x${weightStr}`;
            }
            let qtyCol = qtyWeight.padStart(10, ' ');

            message += `${name}${qtyCol}${priceStr}\n`;
        });

        message += `------------------------------\n`;
        message += `TOTAL:`.padEnd(24, ' ') + `₹${total.toFixed(0)}\n`;
        message += `\`\`\`\n`;
        message += `------------------------------\n`;
        message += `*Grand Total: ₹${total.toFixed(0)}*\n`;
        message += `\nHi, I would like to order these items.`;

        const url = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (loading) return (
        <div className="container loader-container">
            <div className="mill-loader"></div>
            <p className="loading-text">Fetching fresh products...</p>
        </div>
    );

    return (
        <div className="container order-container">
            <Helmet>
                <title>Order Online - H&G Flour Mill | Buy Spices & Flour</title>
                <meta name="description" content="Place your order for fresh, authentic spices and flour from H&G Flour Mill. Turmeric, Chilli, Coriander, Wheat and more available." />
            </Helmet>
            <h1 className="order-title">Place Your Order</h1>
            <p className="order-disclaimer">
                * Images shown are for promotional purposes only. Actual product appearance may vary.
            </p>

            <div className="products-grid">
                {products.map(product => {
                    const name = product.name.toLowerCase();
                    let productImg = null;

                    if (name.includes('kashmiri')) productImg = kashmiriImg;
                    else if (name.includes('chilli')) productImg = chilliImg;
                    else if (name.includes('coriander') && name.includes('roasted')) productImg = corianderRoastedImg;
                    else if (name.includes('coriander')) productImg = corianderImg;
                    else if (name.includes('turmeric')) productImg = turmericImg;
                    else if (name.includes('wheat')) productImg = wheatImg;
                    else if (name.includes('putt')) productImg = puttImg;
                    else if (name.includes('rice powder')) productImg = pathilImg;
                    else if (name.includes('oil')) productImg = CoconutOilImg;

                    return (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAdd={addToCart}
                            image={productImg}
                        />
                    );
                })}
            </div>

            {/* Cart / Bill Summary */}
            {cart.length > 0 && (
                <div className="glass-panel cart-panel">
                    <div className="cart-header">
                        <h3 className="cart-title">Cart ({cart.length})</h3>
                        <span className="cart-total">
                            Total : ₹{calculateTotal().toFixed(0)}
                        </span>
                    </div>

                    <div className="cart-items">
                        {cart.map((item, idx) => (
                            <div key={idx} className="cart-item">
                                <span>{item.name} ({formatWeight(item.weight, item.name)}) x {item.qty}</span>
                                <span className="remove-btn" onClick={() => removeFromCart(idx)}>✕</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleShare} className="btn btn-primary share-btn">
                        Send Order to WhatsApp
                    </button>
                </div>
            )}



        </div>
    );
};

const ProductCard = ({ product, onAdd, image }) => {
    // User requested correction: if stock_out is true, it implies stock out.
    // Checking for true, 'true', 1, or '1'.
    const isStockOut = product.stock_out === true || product.stock_out === 'true' || parseInt(product.stock_out) === 1;
    const isLiquid = product.name.toLowerCase().includes('oil');

    // Initial unit: if liquid, default to 'L'
    const [weightInput, setWeightInput] = useState("");
    const [unit, setUnit] = useState(isLiquid ? "L" : "kg");
    const [showDetails, setShowDetails] = useState(false);

    const malayalamName = getMalayalamName(product.name);

    const handleAdd = () => {
        let weight = parseFloat(weightInput);
        if (!weight || weight <= 0) return;

        // Convert to kg/L if g/ml is selected
        if (unit === 'g' || unit === 'ml') {
            weight = weight / 1000;
        }

        // Strict 100g/100ml minimum check
        // 100g = 0.1kg
        if (weight < 0.1) {
            alert(`Min product order is 100${isLiquid ? 'ml' : 'g'}`);
            return;
        }

        onAdd(product, weight);
        setWeightInput(""); // Reset
    };

    // Toggle Logic
    const toggleUnit = () => {
        if (isLiquid) {
            setUnit(prev => prev === 'L' ? 'ml' : 'L');
        } else {
            setUnit(prev => prev === 'kg' ? 'g' : 'kg');
        }
    };

    // Price display logic
    const priceDisplay = parseFloat(product.price) === 0 ? 'xxx' : product.price;

    return (
        <>
            <div className={`glass-panel product-card ${isStockOut ? 'stock-out' : ''}`}>
                <div onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
                    {image && (
                        <div className="product-image-container">
                            <img
                                src={image}
                                alt={product.name}
                                className="product-image"
                            />
                            {isStockOut && (
                                <div className="stock-out-badge">
                                    Out of Stock
                                </div>
                            )}
                        </div>
                    )}

                    {!image && isStockOut && (
                        <div className="stock-out-badge" style={{ position: 'static', transform: 'none', margin: '1rem auto' }}>
                            Out of Stock
                        </div>
                    )}

                    <div className="product-info">
                        <div className="product-header-row">
                            <h3>{product.name}</h3>
                            <span
                                className="more-link"
                                onClick={(e) => { e.stopPropagation(); setShowDetails(true); }}
                            >
                                More
                            </span>
                        </div>
                        {malayalamName && <p className="product-name-ml">{malayalamName}</p>}
                        <p className="product-price">
                            {typeof priceDisplay === 'number' ? `₹${priceDisplay}` : `₹${priceDisplay}`}
                            <span style={{ color: '#666', fontWeight: 'normal', fontSize: '0.8em' }}> / {isLiquid ? 'L' : 'kg'}</span>
                        </p>
                    </div>
                </div>

                <div className={`weight-entry-container ${isStockOut ? 'disabled' : ''}`}>
                    <div className="weight-input-group">
                        <input
                            type="number"
                            value={weightInput}
                            onChange={(e) => setWeightInput(e.target.value)}
                            placeholder="Qty"
                            className="weight-input"
                            disabled={isStockOut}
                        />
                        <button
                            onClick={toggleUnit}
                            className="unit-toggle-btn"
                            disabled={isStockOut}
                            title="Tab to switch unit"
                        >
                            {unit} <span style={{ opacity: 0.6, fontSize: '0.8em' }}>⇄</span>
                        </button>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="btn btn-primary add-btn"
                        disabled={isStockOut}
                    >
                        ADD
                    </button>
                </div>
            </div>

            {showDetails && (
                <ProductDetailsModal
                    product={product}
                    image={image}
                    malayalamName={malayalamName}
                    onClose={() => setShowDetails(false)}
                />
            )}
        </>
    );
};

export default Order;
