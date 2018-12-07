import React, { Component } from "react";
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import ipfs from './ipfs'


import "./App.css";

//****************************************
//****WHERE/HOW IS THE HASH STORED ON THE CONTRACT FOR THE ACCOUNT????!?!?
//******************************************
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      account: null,
      index: 0
    }
    this.captureFile = this.captureFile.bind(this);
    this.recordIndex = this.recordIndex.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }


componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    console.log('I mounted!!!!!!!!!!!');

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
     console.log('I INSTANSIATED!!!!!!!!!!! PART 2!!!!!');


    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    //Declaring this for later
    //var simpleStorageInstance;

    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     this.simpleStorageInstance = instance
    //
    //     //Truffle console must indidacte the defaultAccount as accounts[0]
    //     this.setState({ account: accounts[0] });
    //     //this.setState({ipfsHash: "QmYynFC5Wpa9W8fsumZnSGBUJ7xokKrnK96gMemHVpEa2Q"})
    //     //console.log('ipfsHash of account is: ', this.simpleStorageInstance.get.call(accounts[0]));
    //
    //     //return this.simpleStorageInstance.get.call(accounts[0]);    //*****I CORRECTED THIS!!!!!!
    //     return this.simpleStorageInstance.get({from: accounts[0]});
    //   }).then((ipfsHash) => {
    //     //Must change whatever variable that returns as the name here. ipfsHash in this case.
    //     // Update state with the result.
    //     console.log('Looks like we MAADE IT!!!! ');
    //     console.log("Account: " + accounts[0]); //When we set defaultAccount via web3, accounts[0]
    //     //refers to that defaultAccount. Using accounts[1] will give an unidentified account
    //     //Actually, not always..
    //     console.log("the Answer: " + ipfsHash);
    //
    //
    //     //************************FOOD FOR THOUGHT********************
    //     //From above, is the hash string stored only on a single block?
    //     //Or, is does each account have its own hash????
    //
    //     //***It looks like anybody on the blockchain can change the main hash in the DApp.
    //     //I guess it seems that there is not a hash for EACH account...
    //
    //     return this.setState({ ipfsHash })
    //   })
    // })

    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     this.simpleStorageInstance = instance
    //
    //     //Truffle console must indidacte the defaultAccount as accounts[0]
    //     this.setState({ account: accounts[0] });
    //     //this.setState({ipfsHash: "QmYynFC5Wpa9W8fsumZnSGBUJ7xokKrnK96gMemHVpEa2Q"})
    //     //console.log('ipfsHash of account is: ', this.simpleStorageInstance.get.call(accounts[0]));
    //
    //     //return this.simpleStorageInstance.get.call(accounts[0]);    //*****I CORRECTED THIS!!!!!!
    //     return this.simpleStorageInstance.getImage(accounts[0], {from: accounts[0]});
    //   }).then((ipfsHash) => {
    //     //Must change whatever variable that returns as the name here. ipfsHash in this case.
    //     // Update state with the result.
    //     console.log('Looks like we MAADE IT!!!! ');
    //     console.log("Account: " + accounts[0]); //When we set defaultAccount via web3, accounts[0]
    //     //refers to that defaultAccount. Using accounts[1] will give an unidentified account
    //     //Actually, not always..
    //     console.log("the Answer: " + ipfsHash);
    //
    //
    //     //************************FOOD FOR THOUGHT********************
    //     //From above, is the hash string stored only on a single block?
    //     //Or, is does each account have its own hash????
    //
    //     //***It looks like anybody on the blockchain can change the main hash in the DApp.
    //     //I guess it seems that there is not a hash for EACH account...
    //
    //     return this.setState({ ipfsHash })
    //   })
    // })


    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        this.simpleStorageInstance = instance

        //Truffle console must indidacte the defaultAccount as accounts[0]
        this.setState({ account: accounts[0] });
        //this.setState({ipfsHash: "QmYynFC5Wpa9W8fsumZnSGBUJ7xokKrnK96gMemHVpEa2Q"})
        //console.log('ipfsHash of account is: ', this.simpleStorageInstance.get.call(accounts[0]));

        //***This ensures the first item, index 0, is retrieved from the array
        return this.simpleStorageInstance.getBook(accounts[0], this.state.index, {from: accounts[0]});
      }).then((ipfsHash) => {
        //Must change whatever variable that returns as the name here. ipfsHash in this case.
        // Update state with the result.
        console.log('Looks like we MAADE IT!!!! ');
        console.log("Account: " + accounts[0]); //When we set defaultAccount via web3, accounts[0]
        //refers to that defaultAccount. Using accounts[1] will give an unidentified account
        //Actually, not always..
        console.log("the Answer: " + ipfsHash);


        //************************FOOD FOR THOUGHT********************
        //From above, is the hash string stored only on a single block?
        //Or, is does each account have its own hash????

        //***It looks like anybody on the blockchain can change the main hash in the DApp.
        //I guess it seems that there is not a hash for EACH account...

        return this.setState({ ipfsHash })
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


      // this.simpleStorageInstance.set(result[0].hash,
      //   { from: this.state.account }).then((r) => {
      //   //Get the value from the contract to prove it worked
      //   console.log('ipfsHash', this.state.ipfsHash);
      //   return this.setState({ipfsHash: result[0].hash})
      //
      // })

      // this.simpleStorageInstance.setImage(this.state.account, result[0].hash,
      //   { from: this.state.account }).then((r) => {
      //   //Get the value from the contract to prove it worked
      //   console.log("The new image setting");
      //
      //   return this.setState({ipfsHash: result[0].hash})
      //
      // })


      this.simpleStorageInstance.addBook(this.state.account, result[0].hash,
        { from: this.state.account }).then((r) => {
        //Get the value from the contract to prove it worked
        console.log("The new image setting");

        return this.setState({ipfsHash: result[0].hash})

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
              <form>
              Which index of the file do you want?
              <input  id='indexInput' type='number' onChange={this.recordIndex} />
              </form>
              <br />
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
}

export default App;
