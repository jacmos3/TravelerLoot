import React, {Component} from 'react';
import Layout from '../components/Layout.js';
import Presentation from '../components/IndexSections/Presentation.js';
import Claim from '../components/IndexSections/Claim.js';
import Plot from '../components/IndexSections/Plot.js';
import Types from '../components/IndexSections/Types.js';
import Guilds from '../components/IndexSections/Guilds.js';
import Elements from '../components/IndexSections/Elements.js';

import {Header} from 'semantic-ui-react';
import walletService from '../lib/wallet';

class MyDapp extends Component{
  state = {
    OGLOOTWebsite:"https://www.lootproject.com/",
    opensea:"https://opensea.io/collection/travelerloot",
    etherscan:"https://etherscan.io/address/0x38cd9992e44064cb8bd68cdf17d164b82b25277c",
    twitter:"https://twitter.com/tripscommunity",
    website:"https://www.travelerloot.com",
    discord:"https://discord.gg/tripscommunity",
    tripsCommunity:"https://www.tripscommunity.com",
    web3Settings:{
      isWeb3Connected: false,
      isConnecting: false,
      connectionError: null,
      walletAvailable: true,
      deployingNetworkId: 1,
      deployingNetworkName: "Ethereum Mainnet",
      contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x38cd9992e44064cb8bd68cdf17d164b82b25277c"
    }
  };

  constructor(){
    super();
  }

  async componentDidMount(){
    // Check if wallet is available
    const walletAvailable = walletService.isWalletAvailable();

    if (!walletAvailable) {
      this.setState({
        web3Settings: {
          ...this.state.web3Settings,
          walletAvailable: false,
          connectionError: 'No wallet detected. Please install MetaMask or another Web3 wallet.'
        }
      });
      return;
    }

    // Check if already connected
    const isConnected = await walletService.isConnected();
    if (isConnected) {
      await this.connect();
    }
  }

  disconnect = () => {
    walletService.disconnect();
    this.setState({
      web3Settings: {
        ...this.state.web3Settings,
        isWeb3Connected: false,
        isConnecting: false,
        connectionError: null,
        account: null,
        ethBalance: 0
      }
    });
  }

  connect = async () => {
    // Check wallet availability first
    if (!walletService.isWalletAvailable()) {
      this.setState({
        web3Settings: {
          ...this.state.web3Settings,
          walletAvailable: false,
          connectionError: 'No wallet detected. Please install MetaMask or another Web3 wallet.'
        }
      });
      return;
    }

    // Set connecting state
    this.setState({
      web3Settings: {
        ...this.state.web3Settings,
        isConnecting: true,
        connectionError: null
      }
    });

    try {
      const result = await walletService.connect();

      if (result) {
        this.setState({
          web3Settings: {
            ...this.state.web3Settings,
            isWeb3Connected: true,
            isConnecting: false,
            connectionError: null,
            account: result.address,
            networkId: result.chainId,
            networkName: result.chainId === 1 ? 'Ethereum Mainnet' : `Chain ${result.chainId}`,
            ethBalance: parseFloat(result.balance)
          }
        });
      }
    } catch (error) {
      let errorMessage = 'Failed to connect wallet.';

      if (error.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection in your wallet.';
      } else if (error.message) {
        errorMessage = error.message.length > 100
          ? error.message.substring(0, 100) + '...'
          : error.message;
      }

      this.setState({
        web3Settings: {
          ...this.state.web3Settings,
          isConnecting: false,
          connectionError: errorMessage
        }
      });
    }
  }

  clearError = () => {
    this.setState({
      web3Settings: {
        ...this.state.web3Settings,
        connectionError: null
      }
    });
  }

  render(){
    return (
      <Layout
        disconnect={this.disconnect}
        connect={this.connect}
        clearError={this.clearError}
        state={this.state}
      >

        <Presentation state={this.state}/>

        <div className="bg-black flex flex-wrap mx-auto sticky top-0 w-full justify-center space-x-6 sm:space-x-10 py-4 z-10 sm:text-2xl font-display">
          <div>
            <a className="hover:text-gray-600" href="#Start">Claim</a>
          </div>
          <div>
            <a className="hover:text-gray-600" href="#Plot">Plot</a>
          </div>
          <div>
            <a className="hover:text-gray-600" href="#Guilds">Guilds</a>
          </div>
          <div>
            <a className="hover:text-gray-600" href="#Types">Types</a>
          </div>
          <div>
            <a className="hover:text-gray-600" href="#Elements">Elements</a>
          </div>
        </div>

        <div id="Start" className="bg-gray-PLATINUM sm:py-20 py-10 pb-40 text-black">
          <Claim
            disconnect={this.disconnect}
            connect={this.connect}
            clearError={this.clearError}
            state={this.state}
          />
        </div>

        <div id="Plot" className="bg-black py-20">
          <Plot />
        </div>

        <div id="Types" className="bg-gray-PLATINUM sm:py-20 py-10 pb-40 text-black ">
          <Types state={this.state}/>
        </div>

        <div id="Guilds" className="bg-black py-20 text-white ">
          <Guilds
            disconnect={this.disconnect}
            connect={this.connect}
            clearError={this.clearError}
            state={this.state}
          />
        </div>

        <div id="Elements" className="bg-black py-20 text-white ">
          <Elements />
        </div>
      </Layout>
    )
  }
}

export default MyDapp;
