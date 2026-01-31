import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';

import axiosClient from '../api/axiosClient';
import turmericImg from '../assets/Turmeric.jpg';
import corianderImg from '../assets/Coriander.jpg';
import corianderRoastedImg from '../assets/Coriander_Roasted.jpg';
import chilliImg from '../assets/chilli.png';
import kashmiriImg from '../assets/kashmiri.jpg';
import pathilImg from '../assets/pathil.jpg';
import puttImg from '../assets/putt.jpg';
import wheatImg from '../assets/wheat.jpg';

import './Order.css';

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

    const formatWeight = (weightInKg) => {
        if (weightInKg < 1) {
            return `${(weightInKg * 1000).toFixed(0)}g`;
        }
        return `${weightInKg}kg`;
    };

    const addToCart = (product, weightInKg) => {
        // Determine max limit for this product
        const name = product.name.toLowerCase();
        let limit = parseFloat(import.meta.env.VITE_LIMIT_DEFAULT) || 10;

        if (name.includes('turmeric')) limit = parseFloat(import.meta.env.VITE_LIMIT_TURMERIC) || 10;
        else if (name.includes('kashmiri')) limit = parseFloat(import.meta.env.VITE_LIMIT_KASHMIRI) || 10;
        else if (name.includes('chilli')) limit = parseFloat(import.meta.env.VITE_LIMIT_CHILLI) || 10;
        else if (name.includes('coriander') && name.includes('roasted')) limit = parseFloat(import.meta.env.VITE_LIMIT_CORIANDER_ROASTED) || 10;
        else if (name.includes('coriander')) limit = parseFloat(import.meta.env.VITE_LIMIT_CORIANDER) || 10;
        else if (name.includes('wheat')) limit = parseFloat(import.meta.env.VITE_LIMIT_WHEAT) || 10;
        else if (name.includes('putt')) limit = parseFloat(import.meta.env.VITE_LIMIT_RICE_PUTT) || 10;
        else if (name.includes('pathil')) limit = parseFloat(import.meta.env.VITE_LIMIT_RICE_PATHIL) || 10;

        // Calculate current total weight for this product
        const currentWeightInCart = cart.reduce((total, item) => {
            return item.id === product.id ? total + (item.weight * item.qty) : total;
        }, 0);

        if (currentWeightInCart + weightInKg > limit) {
            alert(`Ordering is limited to ${limit}kg per item for ${product.name}\nPlease visit the mill for large ordering`);
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
            // Assuming price is per KG and weight is in KG
            return total + (parseFloat(item.price) * parseFloat(item.weight) * item.qty);
        }, 0);
    };

    const handleShare = () => {
        if (!cart.length) return;

        // Calculate total weight of the cart
        const totalWeight = cart.reduce((sum, item) => sum + (item.weight * item.qty), 0);

        if (totalWeight < 0.25) {
            alert("Total order weight must be at least 250g to place an order.");
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
            let qty = `${item.qty}x${formatWeight(item.weight)}`.padStart(8, ' '); // e.g. " 1x500g" or " 2x1kg"
            // Adjust qty formatting to be concise
            let weightStr = formatWeight(item.weight);
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
                    else if (name.includes('pathil')) productImg = pathilImg;

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
                                <span>{item.name} ({formatWeight(item.weight)}) x {item.qty}</span>
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

    const [weightInput, setWeightInput] = useState("");
    const [unit, setUnit] = useState("kg");

    const handleAdd = () => {
        let weight = parseFloat(weightInput);
        if (!weight || weight <= 0) return;

        // Convert to kg if g is selected
        if (unit === 'g') {
            weight = weight / 1000;
        }

        // Strict 100g minimum check
        // 100g = 0.1kg
        if (weight < 0.1) {
            alert("Min product order is 100g");
            return;
        }

        onAdd(product, weight);
        setWeightInput(""); // Reset
    };

    return (
        <div className={`glass-panel product-card ${isStockOut ? 'stock-out' : ''}`}>
            {image && (
                <div className="product-image-container">
                    <img
                        src={image}
                        alt={product.name}
                        className="product-image"
                    />
                </div>
            )}

            {isStockOut && (
                <div className="stock-out-badge">
                    Out of Stock
                </div>
            )}

            <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">₹{product.price} / kg</p>
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
                        onClick={() => setUnit(prev => prev === 'kg' ? 'g' : 'kg')}
                        className="unit-toggle-btn"
                        disabled={isStockOut}
                    >
                        {unit}
                    </button>
                </div>
                <button
                    onClick={handleAdd}
                    className="btn btn-primary add-btn"
                    disabled={isStockOut || !weightInput}>
                    ADD
                </button>
            </div>
        </div>
    );
};

export default Order;
