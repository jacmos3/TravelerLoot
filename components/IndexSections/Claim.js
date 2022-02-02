import React, {Component} from 'react';
import {Container,Button,Card,Segment,Dimmer,Loader, Message, Form} from 'semantic-ui-react';
import styles from "../../styles/pages/INDEX.module.scss"; // Styles
import TravelerLoot from '../../ethereum/build/TravelerLoot.sol.json';
class Claim extends Component{
  state = {
    loading:0,
    name:'',
    description:'',
    image:'',
    tokenId:'',
    minted:false,
    errorMessage:"",
    all:[]
  }
  constructor(){
    super();

  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({loading:this.state.loading+1, errorMessage:''})
    try{
      const accounts= await this.props.state.web3.eth.getAccounts();
      const instance = new this.props.state.web3.eth.Contract(TravelerLoot.TravelerLoot.abi, this.props.state.web3Settings.contractAddress );
      //await instance.methods.activateClaims().send({from:accounts[0]});
      await instance.methods.claim().send({from:accounts[0]});
      this.setState({minted:true});
      this.fetchNFTList();
      //console.log(this.state.all.description);

    }catch(err){
      this.setState({errorMessage: err.message});
    }
    this.setState({loading:this.state.loading-1});
  }


  fetchNFTList = async () => {
    console.log("hey");
    this.setState({loading:this.state.loading+1, errorMessage:''})
    try{
      const accounts= await this.props.state.web3.eth.getAccounts();
      const instance = new this.props.state.web3.eth.Contract(TravelerLoot.TravelerLoot.abi, this.props.state.web3Settings.contractAddress );
      let lastUserIndex = await instance.methods.balanceOf(accounts[0]).call()
      .then((result) =>{
          return JSON.parse(result);
      })
      .catch((error) =>{
        console.log(error);
      })
      let all = [];
      for (let index = 0; index < lastUserIndex; index++){
        let tokenId = await instance.methods.tokenOfOwnerByIndex(accounts[0],index).call()
        .then((result) =>{
          return result;
        })
        .catch((error)=>{
          console.log(error);
        });

        let uri = await instance.methods.tokenURI(tokenId).call()
        .then((result)=> {
          return JSON.parse(window.atob(result.split(',')[1]));

        })
        .catch((error)=>{
          console.log(error);
        });

        let element = {"header": uri.name,/*"description":uri.description,*/"image":uri.image};
        all.push(element);
        console.log(uri);
        this.setState({all:all});
      }
      this.setState({minted:true});
      //console.log(this.state.all.description);

    }catch(err){
      this.setState({errorMessage: err.message});
    }
    this.setState({loading:this.state.loading-1});
  }

render(){
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
                <Form  error={!!this.state.errorMessage}>
            {
              this.props.state.web3Settings.isWeb3Connected
              ? this.props.state.web3Settings.networkId == this.props.state.web3Settings.deployingNetworkId
                ?
                (
                    <div className={styles.home__feature}>
                      <div className="">
                        <Message error header="Oops!" content = {this.state.errorMessage} />
                      <Button  loading = {this.state.loading > 0} secondary onClick = {this.onSubmit}>Claim</Button>
                      <Button  secondary onClick = {this.fetchNFTList}  type="button" basic color='black' >Refresh</Button>
                      <a href="#guildsclaim"><Button  secondary  type="button" basic color='white' >Are you in a guild?</Button></a>
                      <div style={{padding:"15px"}}>
                        <Card.Group itemsPerRow={3} centered items={this.state.all} />
                      </div>
                      {
                        //!this.state.minted ? null : (
                          //<Card.Group itemsPerRow={2} centered items={this.state.all} />
                        //)
                      }
                      </div>
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
                            <div className="text-center">
                              <Button className=" hover:text-white  mx-2" secondary onClick={this.props.connect}>Connect Wallet</Button>
                            </div>
                          )
                        }
                        </div>
                      </Container>
                    </div>
                  )
            }
            </Form>
        </div>
      </div>


    </div>

  )
};
};
export default Claim;
