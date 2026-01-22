import React,{Component} from 'react';
import {Button} from 'semantic-ui-react';
import Link from 'next/link';
import styles from "../styles/components/Layout.module.scss";

class Header extends Component{
  constructor(props) {
     super(props)
  }

  truncateAddress(address){
    if (!address || address.length < 12) return address || '';
    const begin = address.substring(0, 6).concat("...");
    const end = address.substring(address.length-6);
    return begin+end;
  }

  render(){
    const { state } = this.props;
    const isConnected = state.isWeb3Connected;
    const isConnecting = state.isConnecting;

    return (
      <div className="w-full flex justify-between py-2 bg-black px-4 ">
        {/* Main logo */}
        <div className={styles.header__logo}>
          <Link href="/" legacyBehavior>
            <a><h2>Traveler Loot</h2></a>
          </Link>
        </div>

        {/* Navigation */}
        <div className="self-center hidden sm:block" >
          <ul className="flex space-x-8">
            {this.props.links.map(({ name, path }, i) => {
              return (
                <li className="self-center text-xl" key={i}>
                  <Link href={path} legacyBehavior>
                    <a>{name}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{padding:"5px"}}>
          {isConnected ? (
            <Button onClick={this.props.disconnect}>
              {this.truncateAddress(state.account)}
            </Button>
          ) : (
            <a href="#Start">
              <Button
                onClick={this.props.connect}
                loading={isConnecting}
                disabled={isConnecting}
              >
                {isConnecting ? 'Connecting...' : 'Connect wallet'}
              </Button>
            </a>
          )}
        </div>
      </div>
    );
  }
}

export default Header;
