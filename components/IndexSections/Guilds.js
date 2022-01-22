import React, {Component} from 'react';
import {Button,Card,Form,Popup,Icon,Input,Message,Container, Segment,Dimmer,Loader,Grid,Dropdown} from 'semantic-ui-react';
import {derivatives} from "../../derivatives.js"
import styles from "../../styles/pages/INDEX.module.scss"; // Styles
import TravelerLoot from '../../ethereum/build/TravelerLoot.sol.json';
class Guilds extends Component{
  constructor(){
    super();

  }
  state = {
    loading:0,
    name:'',
    description:'',
    image:'',
    tokenId:'',
    guildAddress:'',
    errorMessage:"",
    addGuildsVisibility:false
  }

  hideShowAddingGuilds = async()=>{
    console.log("clicked");
    this.setState({addGuildsVisibility:!this.state.addGuildsVisibility});
  }
  onSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state.guildAddress);
    this.setState({loading:this.state.loading+1, errorMessage:''})
    try{
      const accounts= await this.props.state.web3.eth.getAccounts();
      const instance = new this.props.state.web3.eth.Contract(TravelerLoot.TravelerLoot.abi, this.props.state.web3Settings.contractAddress );
      //await instance.methods.activateClaims().send({from:accounts[0]});
      await instance.methods.claimByGuilds(this.state.tokenId,this.state.guildAddress).send({from:accounts[0]});
      this.setState({minted:true});
      this.fetchNFTList();
      //console.log(this.state.all.description);

    }catch(err){
      this.setState({errorMessage: err.message});
    }
    this.setState({loading:this.state.loading-1});
  }

  dropDownChanged = (event, {value}) => {
    event.preventDefault();
    this.setState({guildAddress: value});
  }


render(){
  var addGuildsCard = [{
    header:"Add new Guilds to the Whitelist...",
      content: 'Add new Guilds to the Whitelist...',
      onClick:this.hideShowAddingGuilds,
      className:"middle"
    }];
  function dropdownList(){
    var toRet= [];
    var item;
    for (var i = 0; i < derivatives.length; i++) {
      var temp = derivatives[i];
      item = {key: temp.header, value: temp.header, text:temp.content+" - "+temp.header};
      toRet.push(item)
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
      <Message
          header='Please Note:'
          content="Since claims have been not yet activated, these guilds have not been whitelisted yet. Whitelisting will happen before activation by contract's owner."
        />
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
    {this.state.addGuildsVisibility ?
      (
    <Container>
      <p className="text-center">
        You can add new Guilds into the game if you meet these conditions:
        <br />- You hold more than 50 Standard Traveler Loots;
        <br />- (or) You have minted a Traveler Loot for Patrons;
        <Popup content='Patrons are claimable by calling claimByPatrons() function on etherscan and paying the "priceForPatrons" price. Check the contract for details.'
          size='tiny'
          trigger={<Icon name='question circle' color='grey'size='small' circular />}
        />
        <br />- (or) You are the owner of Traveler Loot's Smart Contract.
        <br />
        <br />
        <div ><Button target="_blank" href={`${this.props.state.etherscan}#writeContract`} secondary >Etherscan</Button></div>
      </p>
    </Container>
  ) : (<br />)
}

    <div >

        <br />
        <br />
        <br />
        {
          this.props.state.web3Settings.isWeb3Connected
          ? this.props.state.web3Settings.networkId == this.props.state.web3Settings.deployingNetworkId
            ?
            (
                <div className={styles.home__feature}>
                <span>
                  </span>
                <Form onSubmit = {this.onSubmit} error={!!this.state.errorMessage}>
                  <Form.Field>
                    <h2>Claim now a Traveler Loot for Guilds</h2>
                    <p>

                      <br />Select the address of your Guild...
                      <br />And provide the relative's tokenId you own!
                      <Popup content="Guilds' mintings are limited to 900 units and are regulated by modulo operation (mod 900),
                      which means that your Loot-Derivative's tokenID targets a Traveler Loot ID which may be targeted by other
                      Guilds' tokenID too. The fastest who claims the targeted Traveler Loot, revokes any third's claiming right for the same Traveler Loot ID."

                        size='tiny'
                        trigger={<Icon name='question circle' color='grey'size='small' circular />}
                      />
                    </p>
                    <br />
                    <div className = {styles.margin5}>
                      <Dropdown
                        placeholder = 'Select Smart Contract (Guild)'
                        fluid
                        search
                        selection
                        options = {dropdownList()}
                        onChange = {this.dropDownChanged}
                      />
                    </div>
                    <div className = {styles.margin5}>
                      <Input
                        placeholder = "Insert TokenId"
                        type = 'number'
                        min = {1}
                        value = {this.state.tokenId}
                        onChange = {event => this.setState({tokenId: event.target.value})}/>
                    </div>

                  </Form.Field>
                  <br />

                  <Message error header="Oops!" content = {this.state.errorMessage} />
                  <Button disabled={this.state.tokenId.length == 0 || this.state.guildAddress.length == 0} secondary >Claim Traveler Loot for Guilds</Button>
                  <Button target="_blank" href={`${this.props.state.etherscan}#code`} type="button" basic color='black' >H4x0r</Button>
                  </Form>
                </div>
            )
            :(
                <Segment className="h-80">
                  <Dimmer active>
                    <Loader size='massive'>
                    <h1>Wrong Network!</h1>
                    <h2>You are connected to netword {this.props.state.web3Settings.networkId} - {this.props.state.web3Settings.networkName}</h2>
                    <h3>Please connect to network {this.props.state.web3Settings.deployingNetworkId} - {this.props.state.web3Settings.deployingNetworkName}</h3>
                    </Loader>
                  </Dimmer>
                </Segment>
              )
              :(
                <div>
                  <Container style={{color:"white"}}>
                    <div style={{padding:"5px"}}>
                    {
                      this.props.state.web3Settings.isWeb3Connected
                      ? (
                          <Button onClick={this.props.disconnect}>
                            {this.props.state.web3Settingsaccount}
                          </Button>
                      )

                      :(
                          <div
                            className="text-center"
                          >
                            <Button className=" hover:text-white  mx-2" secondary onClick={this.props.connect}>Connect Wallet</Button>
                          </div>
                      )
                    }
                    </div>
                  </Container>
                </div>
              )
        }
      </div>
    </div>
  )
};
};
export default Guilds;
