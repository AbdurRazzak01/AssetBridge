


import Web3 from 'web3';
import LinkItTokenABI from './LinkItToken.json';

const provider = new Web3.providers.HttpProvider('https://rpc.xdc.org');
const web3 = new Web3(provider);

const contractAddress = '0x586e2d1cDCe10fC0Ebd71A57DC647089a410ca6f';
const linkItToken = new web3.eth.Contract(LinkItTokenABI.abi, contractAddress);

export { linkItToken, provider };
