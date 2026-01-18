import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        <div className="container" style={{ padding: '2rem 0', maxWidth: '800px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Milling Rate Estimate</h1>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <p style={{ marginBottom: '2rem', textAlign: 'center', color: '#666' }}>
                    Enter the quantity (in kg) for each item to see the estimated milling charge.
                </p>

                <div style={{ display: 'grid', gap: '1.5rem' }}>
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

                <div style={{ marginTop: '2rem', padding: '1rem', background: '#ecfdf5', borderRadius: '12px', textAlign: 'center' }}>
                    <h3>Total Estimate: ₹{calculateTotal().toFixed(0)}</h3>
                </div>
                <p style={{ color: '#6666', marginBottom: '2rem', textAlign: 'center' }}>
                    Actual milling charge may vary based on the quality of the grain and the milling process.
                </p>
            </div>
        </div>
    );
};

const InputRow = ({ label, rate, id, inputs, setInputs }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label style={{ fontWeight: '600', flex: 1 }}>{label} <span style={{ fontSize: '0.8rem', color: '#999' }}>(₹{rate}/kg)</span></label>
        <input
            type="number"
            placeholder="0 kg"
            value={inputs[id] || ''}
            onChange={(e) => setInputs({ ...inputs, [id]: e.target.value })}
            style={{
                padding: '0.8rem',
                borderRadius: '8px',
                border: '1px solid #ddd',
                width: '120px'
            }}
        />
    </div>
);

export default Estimate;
