// src/components/SwapComponent.js
import React, { useState } from 'react';
import axios from 'axios';

const SwapComponent = () => {
    const [amount, setAmount] = useState('');
    const [swapResult, setSwapResult] = useState('');

    const handleSwap = async () => {
        if (!amount || isNaN(amount)) return;
        try {
            const response = await axios.post('https://your-lifi-swap-api-url', {
                fromToken: 'ETH', // Example: Swap from ETH to LinkIt
                toToken: 'LinkIt',
                amount: amount
            });
            console.log(response.data);
            setSwapResult(response.data.message); // Adjust as per your API response
        } catch (error) {
            console.error('Error swapping:', error.message);
            setSwapResult('Error occurred during swap.');
        }
    };

    return (
        <div>
            <h2>Swap from ETH to LinkIt</h2>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleSwap}>Swap</button>
            {swapResult && <p>{swapResult}</p>}
        </div>
    );
};

export default SwapComponent;
