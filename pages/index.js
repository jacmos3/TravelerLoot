import React, {Component} from 'react';
import Layout from '../components/Layout.js';
import Presentation from '../components/IndexSections/Presentation.js';
import Claim from '../components/IndexSections/Claim.js';
import Plot from '../components/IndexSections/Plot.js';
import Types from '../components/IndexSections/Types.js';
import Guilds from '../components/IndexSections/Guilds.js';
import Elements from '../components/IndexSections/Elements.js';

import {Header} from 'semantic-ui-react';
//import web3 from '../ethereum/web3';
import {Router} from '../routes';
import TravelerLoot from '../ethereum/build/TravelerLoot.sol.json';
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

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
      infura:"8886e44c58d547f5bbbd81e0460296a2",
      isWeb3Connected:false,
      deployingNetworkId : 1, //1 ethereum, 4 rinkeby
      deployingNetworkName : "Ethereum Mainnet"
    }
  };

  constructor(){
    super();

  }

  async componentDidMount(){
    var web3Settings = this.state.web3Settings;
    web3Settings.contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    this.setState({web3Settings:web3Settings});
    //console.log(this.state);
    //console.log(derivatives);
  }
  update = async (nextState)=>{
    console.log("nextState: "+JSON.stringify(nextState));
    this.setState(nextState);
  }

  disconnect = (event) =>{
      console.log("disconnect");
      var web3Settings = this.state.web3Settings;
      web3Settings.isWeb3Connected = false;
      this.setState({web3Settings:web3Settings});
  }

  connect = async (event) => {
      var providerOptions={
       injected:{
         display:{
           name: "Default",
           description: "Connect with the provider in your Browser"
         },
         package:null
       },
       walletconnect: {
          display: {
            name: "Mobile",
            description: "Scan qrcode with your mobile wallet"
          },
          package: WalletConnectProvider,
          options: {
            infuraId: this.state.web3Settings.infura // required
          }
       }
      }

      var web3Modal = new Web3Modal({
        network: "rinkeby", // optional
        cacheProvider: false, // optional
        providerOptions // required
      });

      var provider;
      web3Modal.clearCachedProvider();
      try {
        provider = await web3Modal.connect();
      } catch(e) {
        console.log("Could not get a wallet connection", e);
        return;
      }

      var web3=new Web3(provider);

      provider.on('accountsChanged', function (accounts) {
        console.log("account changed "+accounts[0]);
        window.location.reload();
      })

      provider.on('chainChanged', function (networkId) {
        console.log("chain changed: reloading page");
        window.location.reload();
      })

      provider.on("disconnect",function() {
        console.log("disconnecting");
        provider.close();
        web3Modal.clearCachedProvider();
        provider=null;
      }
     );

      this.setState({web3:web3});
      //console.log(this.state.web3);
       const networkId =  await this.state.web3.eth.net.getId();
       const accounts = await this.state.web3.eth.getAccounts();
       //console.log("account:"+ accounts[0]);

       const ethBalance = await this.state.web3.eth.getBalance(accounts[0]) / 10 ** 18;
      // console.log(this.state.web3Settings.isWeb3Connected);
       var web3Settings = this.state.web3Settings;
       web3Settings.account = accounts[0];
       web3Settings.networkId = networkId;
       web3.eth.net.getNetworkType()
        .then((value) => {
         web3Settings.networkName = value;
         this.forceUpdate();
       });

       web3Settings.ethBalance = ethBalance;
       web3Settings.isWeb3Connected = accounts.length > 0;
       this.setState({web3Settings:web3Settings});

       console.log(this.state.web3Settings.isWeb3Connected);
    }


  render(){
    return (

      <Layout disconnect = {this.disconnect} connect = {this.connect}  state = {this.state}>

        <Presentation  state={this.state}/>

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

        <div id="Start" className="bg-gray-PLATINUM  sm:py-20 py-10 pb-40 text-black">
          <Claim disconnect = {this.disconnect} connect = {this.connect}  state = {this.state} />
        </div>

        <div id="Plot" className="bg-black py-20">
          <Plot />
        </div>

        <div id="Types" className="bg-gray-PLATINUM sm:py-20 py-10 pb-40 text-black ">
          <Types state = {this.state}/>
        </div>

        <div id="Guilds" className="bg-black  py-20 text-white ">
          <Guilds disconnect = {this.disconnect} connect = {this.connect}  state = {this.state} />
        </div>

        <div id="Elements" className="bg-black  py-20 text-white ">
          <Elements />
        </div>
      </Layout>
    )
  }
}

export default MyDapp;
