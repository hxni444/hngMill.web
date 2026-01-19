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
        // Calculate current total weight for this product
        const currentWeightInCart = cart.reduce((total, item) => {
            return item.id === product.id ? total + (item.weight * item.qty) : total;
        }, 0);

        if (currentWeightInCart + weight > 10) {
            alert("ordering is limited to 10kg per item\nplease visit the mill for large ordering");
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
        const url = `https://wa.me/919447131773?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading fresh products...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <Helmet>
                <title>Order Online - H&G Flour Mill | Buy Spices & Flour</title>
                <meta name="description" content="Place your order for fresh, authentic spices and flour from H&G Flour Mill. Turmeric, Chilli, Coriander, Wheat and more available." />
            </Helmet>
            <h1 style={{ textAlign: 'center' }}>Place Your Order</h1>
            <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '2rem', fontStyle: 'italic' }}>
                * Images shown are for promotional purposes only. Actual product appearance may vary.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
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
                <div className="glass-panel" style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    left: '20px',
                    maxWidth: '500px',
                    margin: '0 auto',
                    padding: '1rem',
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    zIndex: 1000,
                    border: '1px solid var(--color-primary)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <h3 style={{ fontSize: '1.2rem' }}>Cart ({cart.length})</h3>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            ₹{calculateTotal().toFixed(0)}
                        </span>
                    </div>

                    <div style={{ maxHeight: '120px', overflowY: 'auto', marginBottom: '0.8rem' }}>
                        {cart.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                <span>{item.name} ({item.weight}kg) x {item.qty}</span>
                                <span style={{ cursor: 'pointer', color: 'red', padding: '0 5px' }} onClick={() => removeFromCart(idx)}>✕</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleShare} className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
                        Share Order (WhatsApp)
                    </button>
                </div>
            )}
        </div>
    );
};

const ProductCard = ({ product, onAdd, image }) => {
    const [weight, setWeight] = useState(1); // Default 1kg
    const isStockOut = parseInt(product.stock_out) === 1;

    return (
        <div className="glass-panel" style={{
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            opacity: isStockOut ? 0.7 : 1,
            position: 'relative',
            overflow: 'hidden' // Ensure image respects border radius
        }}>
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
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    zIndex: 10
                }}>
                    Out of Stock
                </div>
            )}

            <div>
                <h3 style={{ fontSize: '1.25rem' }}>{product.name}</h3>
                <p style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>₹{product.price} / kg</p>
            </div>

            <div style={{ pointerEvents: isStockOut ? 'none' : 'auto', opacity: isStockOut ? 0.5 : 1 }}>
                <label style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '0.5rem' }}>Weight (kg)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {[0.5, 1, 2, 5].map(w => (
                        <button key={w}
                            onClick={() => setWeight(w)}
                            disabled={isStockOut}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                borderRadius: '8px',
                                border: weight === w ? '2px solid var(--color-primary)' : '1px solid #ddd',
                                background: weight === w ? '#ecfdf5' : 'white',
                                cursor: isStockOut ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {w}
                        </button>
                    ))}
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                    <input
                        type="number"
                        step="0.1"
                        value={weight}
                        disabled={isStockOut}
                        onChange={(e) => setWeight(parseFloat(e.target.value))}
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ddd' }}
                        placeholder="Custom Weight"
                    />
                </div>
            </div>

            <button
                onClick={() => !isStockOut && onAdd(product, weight)}
                className="btn btn-primary"
                disabled={isStockOut}
                style={{
                    marginTop: 'auto',
                    backgroundColor: isStockOut ? '#9ca3af' : '',
                    background: isStockOut ? 'none' : '',
                    cursor: isStockOut ? 'not-allowed' : 'pointer',
                    boxShadow: isStockOut ? 'none' : ''
                }}>
                {isStockOut ? 'Unavailable' : 'Add to Cart'}
            </button>
        </div>
    );
};

export default Order;
