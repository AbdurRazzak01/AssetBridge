// src/components/WithdrawComponent.js
import React, { useState } from 'react';
import { linkItToken, provider } from '../web3';

const WithdrawComponent = () => {
    const [amount, setAmount] = useState('');

    const handleWithdraw = async () => {
        if (!amount || isNaN(amount)) return;
        const signer = provider.getSigner();
        const tx = await linkItToken.connect(signer).burn(amount);
        await tx.wait();
        console.log(`Withdrawn ${amount} LinkIt tokens.`);
        // Add success message or update balance
    };

    return (
        <div>
            <h2>Withdraw LinkIt Tokens</h2>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <button onClick={handleWithdraw}>Withdraw</button>
        </div>
    );
};

export default WithdrawComponent;
