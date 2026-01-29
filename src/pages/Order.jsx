import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import html2canvas from 'html2canvas';
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
    const billRef = useRef(null);

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

    const handleShare = async () => {
        if (!cart.length) return;

        try {
            if (billRef.current) {
                // Temporarily make visible for capture
                billRef.current.style.display = 'block';
                const canvas = await html2canvas(billRef.current, { backgroundColor: '#ffffff', scale: 2 });
                billRef.current.style.display = 'none';

                // Convert to blob/image
                canvas.toBlob((blob) => {
                    const file = new File([blob], "order_bill.png", { type: "image/png" });

                    // Web Share API (Mobile)
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        navigator.share({
                            files: [file],
                            title: 'H&G Flour Mill Order',
                            text: 'Hi, I would like to oder these items',
                        }).catch((err) => console.log('Share failed/cancelled', err));
                    } else {
                        // Fallback: Download
                        const link = document.createElement('a');
                        link.download = 'HG_Order_Bill.png';
                        link.href = canvas.toDataURL();
                        link.click();
                        alert("Bill image downloaded! Please attach it to WhatsApp.");

                        // Open WhatsApp
                        const total = calculateTotal();
                        const message = `*Hi, I would like to oder these items. Total: ₹${total.toFixed(0)}*`;
                        const url = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                        window.open(url, '_blank');
                    }
                });
            }
        } catch (error) {
            console.error("Error generating bill:", error);
            alert("Could not generate bill image. Falling back to text share.");
            // Fallback to text share
            const total = calculateTotal();
            let message = `*Hi, I would like to order the following products:*\n\n`;
            cart.forEach(item => {
                message += `• ${item.name} (${formatWeight(item.weight)}) x ${item.qty} = ₹${(item.price * item.weight * item.qty).toFixed(0)}\n`;
            });
            message += `\n*Total Estimate: ₹${total.toFixed(0)}*`;
            const url = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        }
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
                                <span>{item.name} ({formatWeight(item.weight)}) x {item.qty}</span>
                                <span className="remove-btn" onClick={() => removeFromCart(idx)}>✕</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleShare} className="btn btn-primary share-btn">
                        Get Bill & Share
                    </button>
                </div>
            )}

            {/* Hidden Bill Component for Capture */}
            <div ref={billRef} style={{ display: 'none', position: 'absolute', top: '-9999px', left: '-9999px', width: '400px', background: 'white', padding: '20px' }}>
                <BillReceipt cart={cart} total={calculateTotal()} formatWeight={formatWeight} />
            </div>
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

        if (weight < 0.25) {
            alert("min Oder 250 g");
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

const BillReceipt = ({ cart, total, formatWeight }) => (
    <div className="bill-receipt" style={{
        fontFamily: '"Courier New", Courier, monospace',
        padding: '30px',
        backgroundColor: '#fffdf8', // Slight tint for paper feel
        border: '1px solid #e5e7eb',
        backgroundImage: 'repeating-linear-gradient(#fffdf8 0px, #fffdf8 24px, #e5e7eb 25px)', // Rule lines effect
        backgroundSize: '100% 25px',
        color: '#333'
    }}>
        <div className="bill-header" style={{ textAlign: 'center', marginBottom: '20px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px' }}>
            <h2 style={{ color: '#059669', fontSize: '24px', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>H&G Flour Mill</h2>
            <p style={{ fontSize: '14px', margin: '5px 0', fontWeight: 'bold', textTransform: 'uppercase', color: '#555' }}>Digital Order</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Premium Quality Food Products</p>
            <div style={{ borderTop: '2px dashed #333', marginTop: '15px' }}></div>
        </div>

        <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '15px', border: '2px solid #333' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '12px' }}>
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>Time: {new Date().toLocaleTimeString()}</span>
            </div>

            <table className="bill-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #333' }}>
                        <th style={{ padding: '8px 0', textAlign: 'left', textTransform: 'uppercase', fontSize: '12px' }}>Item</th>
                        <th style={{ padding: '8px 0', textAlign: 'right', textTransform: 'uppercase', fontSize: '12px' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px dashed #ccc' }}>
                            <td style={{ padding: '12px 0' }}>
                                <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                <div style={{ fontSize: '12px', color: '#555' }}>{formatWeight(item.weight)} x {item.qty}</div>
                            </td>
                            <td style={{ padding: '12px 0', textAlign: 'right', verticalAlign: 'top' }}>
                                ₹{(item.price * item.weight * item.qty).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{ borderTop: '2px solid #333' }}>
                        <td style={{ padding: '15px 0', fontWeight: 'bold', fontSize: '18px' }}>TOTAL</td>
                        <td style={{ padding: '15px 0', fontWeight: 'bold', textAlign: 'right', fontSize: '20px' }}>
                            ₹{total.toFixed(2)}
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>

        <div className="bill-footer" style={{ marginTop: '20px', textAlign: 'center', fontSize: '10px', color: '#555', backgroundColor: 'rgba(255,255,255,0.9)', padding: '10px' }}>
            <p>Thank you for choosing H&G Flour Mill!</p>
            <p>Contact: {import.meta.env.VITE_FOOTER_PHONE_NUMBER}</p>
        </div>
    </div>
);

export default Order;
