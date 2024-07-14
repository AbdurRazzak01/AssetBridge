import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import LinkItTokenABI from './LinkItToken.json';
import { getTokens, getRoutes, executeRoute, getChains } from '@lifi/sdk';
import './App.css';
import './styles.css';
import Notification from './Notification';

const linkItTokenAddress = '0x596Edf19c398757e19c5fcDbCe73F7003FF50903';
const defaultChain = 'XDC';

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [linkItToken, setLinkItToken] = useState(null);
  const [linkItBalance, setLinkItBalance] = useState('');
  const [linkItDecimals, setLinkItDecimals] = useState('');
  const [linkItName, setLinkItName] = useState('');
  const [linkItSymbol, setLinkItSymbol] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [swapAmount, setSwapAmount] = useState('');
  const [swapFromToken, setSwapFromToken] = useState('');
  const [swapToToken, setSwapToToken] = useState(linkItTokenAddress);
  const [swapStatus, setSwapStatus] = useState('');
  const [tokens, setTokens] = useState([]);
  const [availableChains, setAvailableChains] = useState([]);
  const [selectedBlockchain, setSelectedBlockchain] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '' });

  useEffect(() => {
    const initializeWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable().then(() => {
          setWeb3(window.web3);
        });
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        setWeb3(window.web3);
      } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
    };

    initializeWeb3();
  }, []);

  useEffect(() => {
    if (web3) {
      web3.eth.getAccounts().then((accounts) => {
        setAccounts(accounts);
      });

      const linkItTokenInstance = new web3.eth.Contract(LinkItTokenABI.abi, linkItTokenAddress);
      setLinkItToken(linkItTokenInstance);
    }
  }, [web3]);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (linkItToken) {
        const [name, symbol, decimals] = await Promise.all([
          linkItToken.methods.name().call(),
          linkItToken.methods.symbol().call(),
          linkItToken.methods.decimals().call()
        ]);

        setLinkItName(name);
        setLinkItSymbol(symbol);
        setLinkItDecimals(decimals);

        if (accounts.length > 0) {
          const walletLinkItBalance = await linkItToken.methods.balanceOf(accounts[0]).call();
          setWalletBalance(walletLinkItBalance);
        }
      }
    };

    fetchTokenDetails();
  }, [linkItToken, accounts]);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const availableTokens = await getTokens(defaultChain);
        console.log('Fetched tokens:', availableTokens); // Debug statement
        setTokens(availableTokens);
        if (availableTokens.length > 0) {
          setSwapFromToken(availableTokens[0].address);
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
      }
    };

    fetchTokens();
  }, []);

  useEffect(() => {
    const fetchAvailableChains = async () => {
      try {
        const chains = await getChains();
        setAvailableChains(chains);
        if (chains.length > 0) {
          setSelectedBlockchain(chains[0].id);
        }
      } catch (error) {
        console.error('Error fetching available chains:', error);
      }
    };

    fetchAvailableChains();
  }, []);

  const handleConnectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccounts(accounts);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const handleDeposit = async () => {
    if (linkItToken && depositAmount > 0) {
      try {
        const amountToSend = web3.utils.toWei(depositAmount, 'ether');
        await linkItToken.methods.mint(accounts[0], amountToSend).send({ from: accounts[0], gas: 8000000 });

        setDepositAmount('');
        showNotification('Minted Successfully');
      } catch (error) {
        console.error('Error depositing:', error);
        alert('Error depositing. Please try again.');
      }
    }
  };

  const handleWithdraw = async () => {
    if (linkItToken && withdrawAmount > 0) {
      try {
        const amountToBurn = web3.utils.toWei(withdrawAmount, 'ether');
        await linkItToken.methods.burn(accounts[0], amountToBurn).send({ from: accounts[0], gas: 8000000 });

        setWithdrawAmount('');
        showNotification('Withdrawn Successfully');
      } catch (error) {
        console.error('Error withdrawing:', error);
        alert('Error withdrawing. Please try again.');
      }
    }
  };

  const handleSwap = async () => {
    if (swapAmount > 0 && swapFromToken && swapToToken) {
      try {
        const amountToSwap = web3.utils.toWei(swapAmount, 'ether');

        const routes = await getRoutes({
          fromChain: selectedBlockchain,
          fromToken: swapFromToken,
          fromAmount: amountToSwap,
          toChain: defaultChain,
          toToken: swapToToken,
          toAddress: accounts[0],
        });

        if (routes.routes && routes.routes.length > 0) {
          const route = routes.routes[0];
          await executeRoute({
            signer: web3.eth.accounts.wallet.add(accounts[0]),
            route: route,
          });

          setSwapAmount('');
          showNotification(`Swapped ${swapAmount} tokens successfully`);
        } else {
          setSwapStatus('No routes available');
        }
      } catch (error) {
        console.error('Error swapping:', error);
        alert('Error swapping. Please try again.');
      }
    }
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 5000);
  };

  if (!web3) {
    return <div> Connect With Your Wallet!</div>;
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="company-name">AssetBridge </div>
        <nav className="navigation">
          <a href="#">Home</a>
          <a href="https://www.canva.com/design/DAGIHsjJtt0/dWpQO3OlmX61CR07muW0Yw/edit?utm_content=DAGIHsjJtt0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton">Learn More</a>
        </nav>
      </header>

      <main className="main-content">
        <section className="left-section">
          <div className="action-card">
            <h2>Let The World Link For You!</h2>
          </div>

          <div className="action-card">
            <h3>Account Details</h3>
            {accounts.length > 0 && (
              <>
                <p>Contract Name: {linkItName}</p>
                <p>Contract Symbol: {linkItSymbol}</p>
                <p>Your Wallet Address: {accounts[0]}</p>
                <p>Your LinkIt Balance: {web3.utils.fromWei(walletBalance, 'ether')} {linkItSymbol}</p>
              </>
            )}
            <button onClick={handleConnectWallet}>Connect Wallet</button>
          </div>
        </section>

        <section className="right-section">
          <div className="action-card">
            <h2>Deposit</h2>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder={`Enter amount of ${linkItSymbol} to mint`}
            />
            <button onClick={handleDeposit}>Deposit</button>
          </div>

          <div className="action-card">
            <h2>Withdraw</h2>
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder={`Enter amount of ${linkItSymbol} to withdraw`}
            />
            <button onClick={handleWithdraw}>Withdraw</button>
          </div>

          <div className="action-card">
            <h2>Swap</h2>
            <select onChange={(e) => setSelectedBlockchain(e.target.value)} value={selectedBlockchain}>
              <option value="">Select Blockchain</option>
              {availableChains.map((chain) => (
                <option key={chain.id} value={chain.id}>
                  {chain.name} ({chain.chainType})
                </option>
              ))}
            </select>
            <select onChange={(e) => setSwapFromToken(e.target.value)} value={swapFromToken}>
              <option value="">Select From Token</option>
              {Array.isArray(tokens) && tokens.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={swapAmount}
              onChange={(e) => setSwapAmount(e.target.value)}
              placeholder="Enter amount to swap"
            />
            <button onClick={handleSwap}>Swap</button>
            <p className="swap-status">{swapStatus}</p>
          </div>
        </section>
      </main>

      {notification.show && (
        <Notification message={notification.message} onClose={() => setNotification({ show: false, message: '' })} />
      )}

      <section className="open-eden-section">
        <a href="https://www.canva.com/design/DAGIHsjJtt0/dWpQO3OlmX61CR07muW0Yw/edit?utm_content=DAGIHsjJtt0&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton">
          <img src="Red.jpg" alt="Learn More About Our Project!" />
        </a>
      </section>

      <footer className="footer">
        <p>&copy; 2024 AssetBridge. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
