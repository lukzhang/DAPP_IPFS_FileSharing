import React, { Component } from "react";
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import ipfs from './ipfs';
import 'bootstrap/dist/css/bootstrap.css';

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      index: 0,
      arrayLength: 0
    }
    this.captureFile = this.captureFile.bind(this);
    this.recordIndex = this.recordIndex.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract();

    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }






 instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */


    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)


    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance

        //Truffle console must indidacte the defaultAccount as accounts[0]
        this.setState({ account: accounts[0] });

        //***This ensures the first item, index 0, is retrieved from the array
        return this.simpleStorageInstance.getBook(accounts[0], this.state.index, {from: accounts[0]});
      }).then((ipfsHash) => {
        //Must change whatever variable that returns as the name here. ipfsHash in this case.
        // Update state with the result.
        console.log('Account was successfully retrieved ');
        console.log("Account: " + accounts[0]); //When we set defaultAccount via web3, accounts[0]
        //refers to that defaultAccount. Using accounts[1] will give an unidentified account

        console.log("IpfsHash: " + ipfsHash);

        this.setState({ ipfsHash })

        return this.simpleStorageInstance.getLength(this.state.account);
      }).then((arrayLength) => {

        return this.setState({arrayLength});
      })
    })

  }




captureFile(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  recordIndex(event){
    event.preventDefault();

    if(event.target.value < 0){
      event.target.value = 0;
    }

    let indexNumber = event.target.value;

    this.setState({index: indexNumber});
    console.log("recorded the index " + this.state.index);


    this.instantiateContract();
  }



  onSubmit(event) {
    event.preventDefault();

    ipfs.files.add(this.state.buffer, (error, result) => {

      if(error){
        console.error(error)
        return
      }


      this.simpleStorageInstance.addBook(this.state.account, result[0].hash,
        { from: this.state.account }).then((r) => {
        //Get the value from the contract to prove it worked
        console.log("The new image setting");

        //Update the length and then set the current index to that length-1
        // this.setState({length: this.state.length+1});
        // this.setState({index: this.state.length-1});

        var currIndex = this.state.arrayLength;
        console.log('index is ', currIndex);
        //this.setState({index: currIndex.value()});

        return;
      }).then((r) => {
        var prevLength = this.state.arrayLength;
        this.instantiateContract();

      }).then((r) =>{
        //It is better to grab the hash directly from the blockchain, NOT our input
        //return this.setState({ipfsHash: result[0].hash});

        //Instead, refresh page/render?
        window.location.reload();

      })
    })


  }




  render() {

    if(this.state.ipfsHash===''){
      console.log('ITS EMPTY!!!!!!!!!!!!!!!!!!!!!!!');
    }
    else{
      console.log('its NOTTTT EMPTY ipfsHash', this.state.ipfsHash);
    }

    //Shows customer their account
    var userAccount = "Your account is: " + this.state.account;

    //Shows current IPFS _address
    var currIPFS = "The IPFS address is: " + this.state.ipfsHash;

    //OR
    //If ipfsHash != '', then set the blockchain account's ipfsHash to current


    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Your Image</h1>
              <p>This image is stored on IPFS & The Ethereum Blockchain!!!</p>
              <br />

              {/*<div className="content" dangerouslySetInnerHTML={{__html: userAccount}}></div>*/}
              <font size="5">
              <span className="badge badge-info" dangerouslySetInnerHTML={{__html: userAccount}} />


              <br />
              <br />

              {/*<div className="content" dangerouslySetInnerHTML={{__html: currIPFS}}></div>*/}
              <span className="badge badge-light" dangerouslySetInnerHTML={{__html: currIPFS}} />

              <br />
              </font>

            {/*<form>
            Which index of the file do you want?
            <input  id='indexInput' type='number' onChange={this.recordIndex} />
            </form>*/}



              <br />

              <button onClick={this.handleFirst}
              className="btn btn-info btn-sm m-1">First</button>

              <button onClick={this.handleDecrement}
              className="btn btn-primary btn-sm m-1"> Prev </button>

              <font size="5">
              <span className="badge badge-success">
                {this.state.index}
              </span>
              </font>

              <button onClick={this.handleIncrement}
              className="btn btn-primary btn-sm m-1">Next</button>

              <button onClick={this.handleLast}
              className="btn btn-info btn-sm m-1">Last</button>

              <br/>


              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h2>Upload Image</h2>
              <form onSubmit={this.onSubmit} >
                <input type='file' onChange={this.captureFile} />

                <input type='submit' />
              </form>
            </div>
          </div>
        </main>
      </div>
    );
  }


  handleIncrement = () => {
    //Make sure index is put into backend/smart contracts
    //Refreshing the page resets the length
    let nextValue = this.state.index + 1;
    if(nextValue < this.state.arrayLength){
      this.setState({index: nextValue});
      this.instantiateContract();
    }

  }

  handleDecrement = () => {
    let prevValue = this.state.index - 1;
    if(prevValue >= 0){
      this.setState({index: prevValue});
      this.instantiateContract();
    }

  }

  handleFirst = () => {
    this.setState({index: 0});
    this.instantiateContract();
  }

  handleLast = () => {
    this.setState({index: this.state.arrayLength-1});
    this.instantiateContract();
  }






}

export default App;
