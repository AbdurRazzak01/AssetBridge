
const HDWalletProvider = require('@truffle/hdwallet-provider');
const privateKeys = {
    mainnet: '1663a267ad3d8d3ea75435cf65b0d391d7de0121db7fee2232c0d2b55382f64e'
};

module.exports = {
    networks: {
        xdc: {
            provider: () => new HDWalletProvider(privateKeys.mainnet, 'https://rpc.xdc.org'),
            network_id: 50,
            gas: 5500000,
            gasPrice: 1000000000,
            confirmations: 2,
            timeoutBlocks: 200,
            skipDryRun: true
        }
    },
    compilers: {
        solc: {
            version: "0.8.20",  // Your Solidity compiler version
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
};
