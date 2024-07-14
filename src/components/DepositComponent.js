import React, { useEffect } from 'react';
import { linkItToken } from '../web3';

function DepositComponent() {
    useEffect(() => {
        const getBalance = async () => {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                const balance = await linkItToken.methods.balanceOf(accounts[0]).call();
                console.log('Balance:', balance);
            } catch (error) {
                console.error('Error getting balance:', error);
            }
        };

        getBalance();
    }, []);

    return <div>Deposit Component</div>;
}

export default DepositComponent;
