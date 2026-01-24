import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

import './Estimate.css';

const Estimate = () => {
    const [rates, setRates] = useState([]);
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://millapi.vercel.app/api/estimate')
            .then(res => {
                setRates(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching rates:", err);
                setLoading(false);
            });
    }, []);

    const calculateTotal = () => {
        let total = 0;
        rates.forEach(item => {
            // API returns 'price' as string, confirm parsing
            const price = parseFloat(item.price);
            const weight = parseFloat(inputs[item.id]) || 0;
            total += weight * price;
        });
        return total;
    };

    /* Share functionality removed as per user request */

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading rates...</div>;

    return (
        <div className="container estimate-container">
            <Helmet>
                <title>Get Estimate - H&G Flour Mill | Grinding Rates</title>
                <meta name="description" content="Calculate your milling estimate online. Check current grinding rates for different grains at H&G Flour Mill." />
            </Helmet>
            <h1 className="estimate-title">Milling Rate Estimate</h1>

            <div className="glass-panel estimate-panel">
                <p className="estimate-instruction">
                    Enter the quantity (in kg) for each item to see the estimated milling charge.
                </p>

                <div className="input-grid">
                    {rates.map(item => (
                        <InputRow
                            key={item.id}
                            label={item.product}
                            rate={item.price}
                            id={item.id}
                            inputs={inputs}
                            setInputs={setInputs}
                        />
                    ))}
                </div>

                <div className="total-estimate-box">
                    <h3>Total Estimate: ₹{calculateTotal().toFixed(0)}</h3>
                </div>
                <p className="estimate-disclaimer">
                    Actual milling charge may vary based on the quality of the grain and the milling process.
                </p>
            </div>
        </div>
    );
};

const InputRow = ({ label, rate, id, inputs, setInputs }) => (
    <div className="input-row">
        <label className="input-label">{label} <span className="price-hint">(₹{rate}/kg)</span></label>
        <input
            type="number"
            placeholder="0 kg"
            value={inputs[id] || ''}
            onChange={(e) => setInputs({ ...inputs, [id]: e.target.value })}
            className="input-field"
        />
    </div>
);

export default Estimate;
