import React,{Component} from 'react';
import {Button} from 'semantic-ui-react';
import {Link} from '../routes';
import styles from "../styles/components/Layout.module.scss"; // Styles
import { useRouter } from "next/router"; // Routing
import Web3 from "web3";
import Web3Modal from "web3modal";

class Header extends Component{
  constructor(props) {
     super(props)
  }
  truncateAddress(address){
    const begin = address.substring(0, 6).concat("...");
    const end = address.substring(address.length-6);
    return begin+end;
  }
  render(){
    return (
      <div className="w-full flex justify-between py-2 bg-black px-4 ">
      {/* Main logo */}
      <div className={styles.header__logo}>
        <Link href="/">
          <h2>Traveler Loot</h2>
        </Link>
      </div>

      {/* Navigation */}
      <div className="self-center hidden sm:block" >
        <ul className="flex space-x-8">
          {this.props.links.map(({ name, path }, i) => {
            // For each link, render link
            return (
              <li className="self-center text-xl" key={i}>
                <Link href={path}>
                    {name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div style={{padding:"5px"}}>
      {
        this.props.state.isWeb3Connected
        ? (
            <Button onClick={this.props.disconnect}>
              {this.truncateAddress(this.props.state.account)}
            </Button>
        )

        : (
          <a href="#Start">
            <Button onClick={this.props.connect}>
              Connect wallet
            </Button>
            </a>
        )
      }
      </div>
    </div>
    );
  }
}
export default Header;
