import React, {Component} from 'react';
import {Button, Card, Form, Popup, Icon, Input, Message, Container, Segment, Dimmer, Loader, Dropdown} from 'semantic-ui-react';
import {derivatives} from "../../derivatives.js";
import styles from "../../styles/pages/INDEX.module.scss";
import TravelerLoot from '../../ethereum/build/TravelerLoot.sol.json';
import walletService, { ethers } from '../../lib/wallet';

class Guilds extends Component{
  constructor(){
    super();
  }

  state = {
    loading: 0,
    name: '',
    description: '',
    image: '',
    tokenId: '',
    guildAddress: '',
    errorMessage: "",
    addGuildsVisibility: false
  }

  hideShowAddingGuilds = async() => {
    this.setState({addGuildsVisibility: !this.state.addGuildsVisibility});
  }

  onSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    const tokenId = parseInt(this.state.tokenId, 10);
    if (isNaN(tokenId) || tokenId < 1 || tokenId > 10000) {
      this.setState({errorMessage: 'Token ID must be a number between 1 and 10000'});
      return;
    }

    if (!this.state.guildAddress || !/^0x[a-fA-F0-9]{40}$/.test(this.state.guildAddress)) {
      this.setState({errorMessage: 'Please select a valid guild address'});
      return;
    }

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

      const tx = await contract.claimByGuilds(tokenId, this.state.guildAddress);
      await tx.wait();

      this.setState({minted: true, tokenId: '', guildAddress: ''});
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

  dropDownChanged = (event, {value}) => {
    event.preventDefault();
    this.setState({guildAddress: value});
  }

  render(){
    const { web3Settings } = this.props.state;
    const isConnected = web3Settings.isWeb3Connected;
    const isConnecting = web3Settings.isConnecting;
    const isCorrectNetwork = web3Settings.networkId === web3Settings.deployingNetworkId;
    const walletAvailable = web3Settings.walletAvailable;
    const connectionError = web3Settings.connectionError;

    var addGuildsCard = [{
      header: "Or you can add new Guilds to the Whitelist...",
      content: 'Or you can add new Guilds to the Whitelist...',
      onClick: this.hideShowAddingGuilds,
      className: "middle"
    }];

    function dropdownList(){
      var toRet = [];
      for (var i = 0; i < derivatives.length; i++) {
        var temp = derivatives[i];
        var item = {key: temp.header, value: temp.header, text: temp.content + " - " + temp.header};
        toRet.push(item);
      }
      return toRet;
    }

    return (
      <div className="container mx-auto mt-8">
        <div className="flex justify-around ">
          <div className="px-20 py-8 rounded text-center">
            <span className="uppercase sm:text-xl tracking-widest">Guilds</span>
            <br />
            <h1 className="text-center mt-4 text-white">Whitelisted Loot Projects</h1>
          </div>
        </div>

        <div className="text-center sm:text-2xl my-4 sm:w-2/3 mx-auto px-4">
          <div>
            If you own one NFT of these Projects, then you are in a Guild:
            <br />
            <br />
            <div id="derivatives">
              <Card.Group itemsPerRow={2} centered items={derivatives} />
              <div id="guildsclaim">
                <Card.Group itemsPerRow={1} centered items={addGuildsCard} />
              </div>
            </div>
          </div>
        </div>

        {this.state.addGuildsVisibility ? (
          <Container>
            <p className="text-center">
              You can add new Guilds into the game if you meet these conditions:
              <br />- You hold more than 50 Standard Traveler Loots;
              <br />- (or) You have minted a Traveler Loot for Patrons;
              <Popup
                content='Patrons are claimable by calling claimByPatrons() function on etherscan and paying the "priceForPatrons" price. Check the contract for details.'
                size='tiny'
                trigger={<Icon name='question circle' color='grey' size='small' circular />}
              />
              <br />- (or) Getting in touch with <a href={this.props.state.discord}>Trips Community</a> and proposing your idea and your reason why.
              <br />
              <br />
              <div>
                <Button target="_blank" href={`${this.props.state.etherscan}#writeContract`} secondary>
                  Etherscan
                </Button>
              </div>
            </p>
          </Container>
        ) : (<br />)}

        <div>
          <br />
          <br />
          <br />

          {/* Show connection error */}
          {connectionError && (
            <Container>
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
            </Container>
          )}

          {isConnected ? (
            isCorrectNetwork ? (
              <div className={styles.home__feature}>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                  <Form.Field>
                    <h2>Claim now a Traveler Loot for Guilds</h2>
                    <p>
                      <br />Select the address of your Guild...
                      <br />And insert the tokenId you own!
                      <Popup
                        content="Guilds' mintings are limited to 900 units and are regulated by modulo operation (mod 900), which means that your Loot-Derivative's tokenID targets a Traveler Loot ID which may be targeted by other Guilds' tokenID too. The fastest who claims the targeted Traveler Loot, revokes any third's claiming right for the same Traveler Loot ID."
                        size='tiny'
                        trigger={<Icon name='question circle' color='grey' size='small' circular />}
                      />
                    </p>
                    <br />
                    <div className={styles.margin5}>
                      <Dropdown
                        placeholder='Select Smart Contract (Guild)'
                        fluid
                        search
                        selection
                        options={dropdownList()}
                        onChange={this.dropDownChanged}
                        value={this.state.guildAddress}
                      />
                    </div>
                    <div className={styles.margin5}>
                      <Input
                        placeholder="Insert TokenId"
                        type='number'
                        min={1}
                        max={10000}
                        value={this.state.tokenId}
                        onChange={event => this.setState({tokenId: event.target.value})}
                      />
                    </div>
                  </Form.Field>
                  <br />
                  <Message error header="Oops!" content={this.state.errorMessage} />
                  <Button
                    disabled={this.state.tokenId.length === 0 || this.state.guildAddress.length === 0}
                    secondary
                    loading={this.state.loading > 0}
                  >
                    Claim Traveler Loot for Guilds
                  </Button>
                  <Button
                    target="_blank"
                    href={`${this.props.state.etherscan}#code`}
                    type="button"
                    basic
                    color='black'
                  >
                    H4x0r
                  </Button>
                </Form>
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
                        <p style={{color: '#999', marginBottom: '10px'}}>
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
        </div>
      </div>
    );
  }
}

export default Guilds;
