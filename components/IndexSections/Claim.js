import React, {Component} from 'react';
import {Container, Button, Card, Segment, Dimmer, Loader, Message, Form} from 'semantic-ui-react';
import styles from "../../styles/pages/INDEX.module.scss";
import TravelerLoot from '../../ethereum/build/TravelerLoot.sol.json';
import walletService, { ethers } from '../../lib/wallet';

class Claim extends Component{
  state = {
    loading: 0,
    name: '',
    description: '',
    image: '',
    tokenId: '',
    minted: false,
    errorMessage: "",
    all: []
  }

  constructor(){
    super();
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading: this.state.loading + 1, errorMessage: ''});

    try {
      const signer = walletService.getSigner();
      if (!signer) {
        throw new Error('Wallet not connected. Please connect your wallet first.');
      }

      const contract = new ethers.Contract(
        this.props.state.web3Settings.contractAddress,
        TravelerLoot.TravelerLoot.abi,
        signer
      );

      const tx = await contract.claim();
      await tx.wait();

      this.setState({minted: true});
      this.fetchNFTList();
    } catch(err) {
      let errorMsg = 'Transaction failed';

      if (err.code === 4001) {
        errorMsg = 'Transaction rejected by user';
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        errorMsg = 'Insufficient funds for transaction';
      } else if (err.message) {
        errorMsg = err.message.length > 150
          ? err.message.substring(0, 150) + '...'
          : err.message;
      }

      this.setState({errorMessage: errorMsg});
    }

    this.setState({loading: this.state.loading - 1});
  }

  fetchNFTList = async () => {
    this.setState({loading: this.state.loading + 1, errorMessage: ''});

    try {
      const signer = walletService.getSigner();
      if (!signer) {
        throw new Error('Wallet not connected');
      }

      const address = await signer.getAddress();
      const contract = new ethers.Contract(
        this.props.state.web3Settings.contractAddress,
        TravelerLoot.TravelerLoot.abi,
        signer
      );

      const balance = await contract.balanceOf(address);
      const balanceNum = balance.toNumber();

      let all = [];
      for (let index = 0; index < balanceNum; index++) {
        try {
          const tokenId = await contract.tokenOfOwnerByIndex(address, index);
          const uri = await contract.tokenURI(tokenId);

          // Parse base64 encoded JSON
          const json = JSON.parse(atob(uri.split(',')[1]));
          const element = {
            header: json.name,
            image: json.image
          };
          all.push(element);
        } catch (error) {
          // Skip invalid tokens
        }
      }

      this.setState({all: all, minted: true});
    } catch(err) {
      const errorMsg = err.message && err.message.length > 150
        ? err.message.substring(0, 150) + '...'
        : err.message || 'Failed to fetch NFT list';
      this.setState({errorMessage: errorMsg});
    }

    this.setState({loading: this.state.loading - 1});
  }

  render(){
    const { web3Settings } = this.props.state;
    const isConnected = web3Settings.isWeb3Connected;
    const isConnecting = web3Settings.isConnecting;
    const isCorrectNetwork = web3Settings.networkId === web3Settings.deployingNetworkId;
    const walletAvailable = web3Settings.walletAvailable;
    const connectionError = web3Settings.connectionError;

    return (
      <div className="container mx-auto mt-8">
        <div className="flex justify-around">
          <div className="px-4 sm:px-20 py-8 rounded-2xl text-center md:w-2/3 ">
            <span className="uppercase sm:text-xl tracking-widest ">
              A Real World Loot
            </span>
            <h1 className="text-center mt-4 capitalize">Start Here: Get A Traveler Loot</h1>
            <br />
            <p className="text-xl sm:text-2xl ">
              10,000 loots, discovered by travelers.
              <br />
              What treasures do they hold?
              <br />
              Which gifts will they attracts?
              <br />
              Free nights in hotels?
              <br />
              Big discounts on flights?
              <br />
              Special offers in restaurants?
              <br />
              <br />
            </p>

            <Form error={!!this.state.errorMessage || !!connectionError}>
              {/* Show connection error */}
              {connectionError && (
                <Message error onDismiss={this.props.clearError}>
                  <Message.Header>Connection Error</Message.Header>
                  <p>{connectionError}</p>
                  {!walletAvailable && (
                    <p>
                      <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{color: '#2185d0', textDecoration: 'underline'}}
                      >
                        Download MetaMask
                      </a>
                    </p>
                  )}
                </Message>
              )}

              {isConnected ? (
                isCorrectNetwork ? (
                  <div className={styles.home__feature}>
                    <div className="">
                      <Message error header="Oops!" content={this.state.errorMessage} />
                      <Button loading={this.state.loading > 0} secondary onClick={this.onSubmit}>
                        Claim
                      </Button>
                      <Button secondary onClick={this.fetchNFTList} type="button" basic color='black'>
                        Refresh
                      </Button>
                      <a href="#guildsclaim">
                        <Button secondary type="button" basic color='white'>
                          Are you in a guild?
                        </Button>
                      </a>
                      <div style={{padding: "15px"}}>
                        <Card.Group itemsPerRow={3} centered items={this.state.all} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Segment className="h-80">
                    <Dimmer active>
                      <Loader size='massive'>
                        <h1>Wrong Network!</h1>
                        <h2>You are connected to network {web3Settings.networkId} - {web3Settings.networkName}</h2>
                        <h3>Please connect to network {web3Settings.deployingNetworkId} - {web3Settings.deployingNetworkName}</h3>
                      </Loader>
                    </Dimmer>
                  </Segment>
                )
              ) : (
                <div>
                  <Container style={{color: "white"}}>
                    <div style={{padding: "5px"}}>
                      <div className="text-center">
                        <Button
                          className="hover:text-white mx-2"
                          secondary
                          onClick={this.props.connect}
                          loading={isConnecting}
                          disabled={isConnecting}
                        >
                          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                        </Button>

                        {!walletAvailable && (
                          <div style={{marginTop: '15px'}}>
                            <p style={{color: '#666', marginBottom: '10px'}}>
                              No wallet detected
                            </p>
                            <Button
                              as="a"
                              href="https://metamask.io/download/"
                              target="_blank"
                              rel="noopener noreferrer"
                              basic
                              color="orange"
                            >
                              Install MetaMask
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Container>
                </div>
              )}
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Claim;
