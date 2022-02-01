import React, {Component} from 'react';
import styles from "../../styles/pages/INDEX.module.scss"; // Styles
import {Image,Button,Message,Statistic} from 'semantic-ui-react';
const Web3 = require('web3');

class Presentation extends Component{
  constructor(){
    super();
  }

    state = {height:0,target:14135801}

    componentDidMount() {
      this.checkBlock();
        this.interval = setInterval(() => this.checkBlock(), 10000);
    }

    componentWillUnmount() {
      clearInterval(this.interval);
    }

   async checkBlock() {
      var web3 = new Web3('https://mainnet.infura.io/v3/078b180cf49e4531891cb1168cf4eb51');
      var result = await web3.eth.getBlockNumber()
      .then();
      this.setState({"height":result});

      console.log(this.state.height);
  }
render(){

  return (
    <div className="mx-auto px-2 sm:px-4 text-center py-10 sm:py-20 justify-around flex flex-wrap hero-img bg-opacity-10">
      <div className="w-full sm:w-1/2">


        {this.state.height - this.state.target <= 0 ? (
          <div>
          <h2>{this.state.height - this.state.target} blocks to go!</h2>
          <Message
              header='Please Note:'
              content="Mintings will be possible starting from block #14135801! Please do not try to interact with the contract during the lock time, or your transaction will fail! "
            />

        </div >)
          : ""}
        <div className="sm:px-4">
          <div className={styles.home__cta}>
            <h1 className="interline">Traveler Loot</h1>
            <p className="text-xl sm:text-2xl text-white">
              <br />

              Traveler Loot is a <a target= "_blank" href="https://www.lootproject.com/">Loot</a> derivative for the travel industry, generated and stored on chain.
              Stats, images, and other functionality are intentionally omitted for others to interpret. Feel free to use Traveler Loot in any way you want.
            </p>
          </div>
          <div className="flex py-8 w-full justify-center space-x-6">
            <a
              href={this.props.state.opensea}
              className="self-center p-3 border border-gray-800 rounded-xl  bg-black hover:bg-blue-1"
              target="_blank"
            >
              <Image className="hover:text-white  w-6 h-6 mx-2" src="../img/opensea.svg"  />
            </a>
            <a
              href={this.props.state.twitter}
              className="self-center p-3 border border-gray-800 rounded-xl  bg-black hover:bg-blue-1"
              target="_blank"
            >
              <Image className="fill-current w-6 h-6 mx-2" src="../img/twitter.svg"/>
            </a>
            <a
              href={this.props.state.discord}
              className="self-center p-3 border border-gray-800 rounded-xl  bg-black hover:bg-blue-1"
              target="_blank"
            >
              <Image className="fill-current  text-white w-6 h-6 mx-2" src="../img/discord.svg"/>
            </a>

          </div>
          <div><a href={`${this.props.state.etherscan}#code`} target="_blank">VIEW CONTRACT</a></div>
          <br />
          <div className="text-center">
            <a href="#Start">
              <Button className=" hover:text-white  mx-2" secondary >Claim a Traveler Loot</Button>
            </a>
          </div>

        </div>
      </div>
    </div>
  )
};
};
export default Presentation;
