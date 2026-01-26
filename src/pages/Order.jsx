import React, { useState, useEffect } from 'react';
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

    const addToCart = (product, weight) => {
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

        if (currentWeightInCart + weight > limit) {
            alert(`Ordering is limited to ${limit}kg per item for ${product.name}\nPlease visit the mill for large ordering`);
            return;
        }

        const existing = cart.find(item => item.id === product.id && item.weight === weight);
        if (existing) {
            setCart(cart.map(item =>
                (item.id === product.id && item.weight === weight)
                    ? { ...item, qty: item.qty + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { ...product, weight, qty: 1 }]);
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
        const total = calculateTotal();
        let message = `*Hi, I would like to order the following products:*\n\n`;
        cart.forEach(item => {
            message += `• ${item.name} (${item.weight}kg) x ${item.qty} = ₹${(item.price * item.weight * item.qty).toFixed(0)}\n`;
        });
        message += `\n*Total Estimate: ₹${total.toFixed(0)}*`;

        // Check if mobile or web
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
                            ₹{calculateTotal().toFixed(0)}
                        </span>
                    </div>

                    <div className="cart-items">
                        {cart.map((item, idx) => (
                            <div key={idx} className="cart-item">
                                <span>{item.name} ({item.weight}kg) x {item.qty}</span>
                                <span className="remove-btn" onClick={() => removeFromCart(idx)}>✕</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleShare} className="btn btn-primary share-btn">
                        Share Order (WhatsApp)
                    </button>
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product, onAdd, image }) => {
    const [weight, setWeight] = useState(1); // Default 1kg
    // User requested correction: if stock_out is true, it implies stock out.
    // Checking for true, 'true', 1, or '1'.
    const isStockOut = product.stock_out === true || product.stock_out === 'true' || parseInt(product.stock_out) === 1;

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

            <div className={`weight-selector-container ${isStockOut ? 'disabled' : ''}`}>
                <label className="weight-label">Weight (kg)</label>
                <div className="weight-buttons">
                    {[0.5, 1, 2, 5].map(w => (
                        <button key={w}
                            onClick={() => setWeight(w)}
                            disabled={isStockOut}
                            className={`weight-btn ${weight === w ? 'active' : ''}`}
                        >
                            {w}
                        </button>
                    ))}
                </div>
                <div className="custom-weight-wrapper">
                    <input
                        type="number"
                        step="0.1"
                        value={weight}
                        disabled={isStockOut}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        className="custom-weight-input"
                        placeholder="Custom Weight"
                    />
                </div>
            </div>

            <button
                onClick={() => !isStockOut && onAdd(product, weight)}
                className={`btn btn-primary add-to-cart-btn ${isStockOut ? 'disabled' : ''}`}
                disabled={isStockOut}>
                {isStockOut ? 'Unavailable' : 'Add to Cart'}
            </button>
        </div>
    );
};

export default Order;
