import { ethers } from 'ethers';

const CHAIN_ID = 1; // Ethereum Mainnet
const CHAIN_CONFIG = {
  chainId: '0x1',
  chainName: 'Ethereum Mainnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'],
  blockExplorerUrls: ['https://etherscan.io']
};

class WalletService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
  }

  // Check if wallet is available
  isWalletAvailable() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  // Connect to wallet
  async connect() {
    if (!this.isWalletAvailable()) {
      throw new Error('No wallet detected. Please install MetaMask or another Web3 wallet.');
    }

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found');
      }

      // Create provider and signer
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.address = accounts[0];

      // Get network info
      const network = await this.provider.getNetwork();
      this.chainId = network.chainId;

      // Setup event listeners
      this._setupListeners();

      // Get balance
      const balance = await this.provider.getBalance(this.address);

      return {
        address: this.address,
        chainId: this.chainId,
        balance: ethers.utils.formatEther(balance),
        provider: this.provider,
        signer: this.signer
      };
    } catch (error) {
      this.disconnect();
      throw error;
    }
  }

  // Disconnect wallet
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.address = null;
    this.chainId = null;
  }

  // Setup event listeners
  _setupListeners() {
    if (!this.isWalletAvailable()) return;

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        this.disconnect();
      }
      window.location.reload();
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('disconnect', () => {
      this.disconnect();
    });
  }

  // Check if connected
  async isConnected() {
    if (!this.isWalletAvailable()) return false;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts && accounts.length > 0;
    } catch {
      return false;
    }
  }

  // Get current account
  async getAccount() {
    if (!this.isWalletAvailable()) return null;

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      return accounts && accounts.length > 0 ? accounts[0] : null;
    } catch {
      return null;
    }
  }

  // Ensure correct network
  async ensureCorrectNetwork() {
    if (!this.isWalletAvailable()) return false;

    try {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (parseInt(chainId, 16) !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: CHAIN_CONFIG.chainId }]
          });
          return true;
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [CHAIN_CONFIG]
            });
            return true;
          }
          return false;
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  // Get contract instance
  getContract(address, abi) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    return new ethers.Contract(address, abi, this.signer);
  }

  // Get provider (read-only operations)
  getProvider() {
    return this.provider;
  }

  // Get signer (write operations)
  getSigner() {
    return this.signer;
  }
}

// Singleton instance
const walletService = new WalletService();

export default walletService;
export { ethers };
