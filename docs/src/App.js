import React, { Component } from "react";
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";
import ipfs from './ipfs';
import 'bootstrap/dist/css/bootstrap.css';
import MovieRow from './MovieRow.js'
import "./App.css";


class App extends Component {
  constructor(props) {
    super(props)


    this.state = {
      ipfsHash: '',
      web3: null,
      buffer: null,
      contentBuffer: null,
      account: null,
      index: 0,
      arrayLength: 0,
      rows: [],
      currTitle: '',
      lookupAddress: '',
      allAddresses: [],
      allLikes: [],
      tokens: 0
    }

    this.captureFile = this.captureFile.bind(this);
    this.captureContent = this.captureContent.bind(this);
    this.recordIndex = this.recordIndex.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.addIPFSItem = this.addIPFSItem.bind(this);
    this.showAccounts = this.showAccounts.bind(this);
    this.titleChangeHandler=this.titleChangeHandler.bind(this);
    this.giveLike=this.giveLike.bind(this);
    this.sendLike=this.sendLike.bind(this);
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

    //Instance of SimpleStorage contract
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    //Retrieves the accounts
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

        this.setState({arrayLength});

        return this.simpleStorageInstance.accountBalanceManual(this.state.account);
      }).then((numTokens)=>{
        return this.setState({tokens: numTokens});
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

  //Same as captureFile, but with article contentsHash
  captureContent(event) {
      event.preventDefault()
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        this.setState({ contentBuffer: Buffer(reader.result) })
        console.log('Content buffer', this.state.contentBuffer)
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


  async onSubmit(event) {
    event.preventDefault();

    let results = await ipfs.files.add(this.state.buffer);
    let second = await ipfs.files.add(this.state.contentBuffer);

    let hash1 = results[0].hash;
    let hash2 = second[0].hash;

    let answer ={thePic: hash1, theContents: hash2}

    console.log(answer)

    this.simpleStorageInstance.addBookReport(this.state.account, hash1,
          this.state.currTitle, hash2,
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

  }




  render() {

    if(this.state.ipfsHash===''){
      console.log('ipfsHash is empty');
    }
    else{
      console.log('ipfsHash is ', this.state.ipfsHash);
    }

    //Account Like Tokens
    var accountTokens = "You have " + this.state.tokens + " LIKE Tokens";

    //Shows customer their account
    var userAccount = "Your account is: " + this.state.account;

    //Shows current IPFS _address
    var currIPFS = "The IPFS address is: " + this.state.ipfsHash;

    //OR
    //If ipfsHash != '', then set the blockchain account's ipfsHash to current



    return (
      <div className="App">

        <table className="titleBar">
        <tbody>

          <h1 className='theHeading'>Interactive News</h1>
          <p id='descHeading'>
            Articles stored on IPFS and the blockchain</p>
        </tbody>

        </table>

        <div id='searchComponent'>
          <span id='searchBar'/>
        <input onChange={this.searchChangeHandler} placeholder="Enter address for article lookup"
        id = 'addressInput'/>

        <button onClick={this.addIPFSItem}
          className="btn btn-info btn-sm m-1" id='addressButton'>Show Articles</button>

        <button onClick={this.sendLike}
            className="btn btn-success btn-sm m-1" id='addressButton'>Send a LIKE</button>

        <span id='searchBar'/>
          <button onClick={this.showAccounts}
            className="btn btn-warning btn-sm m-1"
            style={{marginTop: 10, padding: 10, paddingLeft: 120, paddingRight: 120}}>
            Show List of Accounts</button>
        </div>

        <br/>
          <font size="5">
          <span className="badge badge-info" dangerouslySetInnerHTML={{__html: userAccount}} />
          </font>
        <br/>
        <br/>

          <button onClick={this.giveLike}
            className="btn btn-primary btn-sm m-1"
            style={{marginTop: 10, padding: 10, paddingLeft: 120, paddingRight: 120}}>
            Buy a LIKE Token</button>

          <font size="5">
        <span className="badge badge-info" dangerouslySetInnerHTML={{__html: accountTokens}} />
        </font>

        {/*Gives a row of tables of IPFS items*/}
        <ul>
          {
            this.state.rows.map((row, index) => {
              return (
                <table>

                  <tr key={index}>
                    <td>
                      <img alt ="poster" width="120" src = {row.poster_src} />
                    </td>
                    <td>
                    <h3>{row.title}</h3>
                    <p>

                      <iframe src={row.overview} width="800"/>
                      </p>

                    </td>
                  </tr>

                </table>

              )
            })
          }
        </ul>


        {/*Gives a row of addresses that have submited articles*/}
        <div id='allAddresses'>
        <ul>
          {
            this.state.allAddresses.map((allAddresses, index) => {
              return (
                <table>
                  <tr key={index}>
                    <td>
                    <p>{allAddresses}</p>
                    </td>
                    <p>
                      <span className="badge badge-primary" dangerouslySetInnerHTML=
                        {{__html: this.state.allLikes[index] + " likes"}} />
                    </p>
                  </tr>
                </table>

              )
            })
          }
        </ul>
        </div>



        {/*<nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
        </nav>*/}

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">

              {/*<div className="content" dangerouslySetInnerHTML={{__html: userAccount}}></div>*/}
              <font size="5">




              <br />
              <br />
                <br />
                <br />

                <h1>Submit an Article Below</h1>

              {/*<div className="content" dangerouslySetInnerHTML={{__html: currIPFS}}></div>*/}

              <span className="badge badge-light" dangerouslySetInnerHTML={{__html: currIPFS}} />

              </font>

              <br />
              <br />
              <br />
              <br />
              <h3>Your Article Cover Photos</h3>

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
              <br></br>
              <br></br>
              <br></br>
              <h3>Title of Article</h3>


                <input style={{
                  fontSize: 14,
                  display: 'block',
                  paddingTop: 8,
                  paddingBottom: 8,
                  paddingLeft: 14,
                  width: "25%"
                }} onChange={this.titleChangeHandler} placeholder="Enter title of article" class="container"/>


            <form onSubmit={this.onSubmit} >
              <br></br>
              <h3>Upload CoverImage</h3>
              <input type='file' onChange={this.captureFile} />
                <br></br>
                <br></br>
                <h3>Your Article Contents</h3>
              <input type='file' onChange={this.captureContent} />
                <br></br>
                <br></br>
              <input type='submit' value='Submit Article'/>
            </form>

              <br></br>
              <br></br>
              <br></br>
              <br></br>


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

  searchChangeHandler = (event) => {
    console.log(event.target.value)
    const searchAddress = event.target.value;
    this.setState({lookupAddress: searchAddress})
  }

  titleChangeHandler(event){
    console.log(event.target.value)
    const title = event.target.value;
    this.setState({currTitle: title})
  }

  async giveLike() {
    console.log("like");
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    await this.simpleStorageInstance.buyOneToken({from: this.state.account});
    let numTokens = await this.simpleStorageInstance.accountBalance();
    this.setState({tokens: numTokens})
  }

  async sendLike() {
    console.log("Send like");
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    await this.simpleStorageInstance.giveLike(this.state.lookupAddress,
      {from: this.state.account});
  }


  async showAccounts() {
    console.log("SHOW ACCOUNTS");
    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    var allAddresses = await this.simpleStorageInstance.getBookAccounts();

    var likes=[];

    for(var i=0; i<allAddresses.length; i++){
      console.log('The address is ', allAddresses[i])

      let currBalance =
        await this.simpleStorageInstance.accountBalanceManual(allAddresses[i]);

        console.log('Likes is ', currBalance.toNumber())

        likes.push(currBalance.toNumber())
    }

    this.setState({allLikes: likes})

    return this.setState({allAddresses: allAddresses})
  }

//This duplicates the code above but modularized into a method
//Use a paramater for address
async addIPFSItem () {

  var finalItems = []
  var searchAddress = this.state.lookupAddress;

  const contract = require('truffle-contract')
  const simpleStorage = contract(SimpleStorageContract)
  simpleStorage.setProvider(this.state.web3.currentProvider)

  var i;
  var arrayLength = await this.simpleStorageInstance.getLength(searchAddress);
  for(i=0; i<arrayLength ; i++){
    // Here I use `await` instead of `.then` to make the promise return "normally"
  var hashVal = await this.simpleStorageInstance.getBook(searchAddress, i, { from: searchAddress });
  // I do the transformations you did inside `.then(() => { ... })` "just" after the function call
  var ipfsPrefix = "https://ipfs.io/ipfs/";
  var ipfsURL = ipfsPrefix + hashVal;
  var p = ipfsURL;

  // Again, using `await` instead of `.then`
  var k = await this.simpleStorageInstance.getTitle(searchAddress, i, { from: searchAddress })

  var contentsURL = await this.simpleStorageInstance.getContents(searchAddress, i, { from: searchAddress });
  var l = ipfsPrefix + contentsURL;

  finalItems.push({id: i, poster_src: p, title: k, overview: l})
  console.log('final item ', finalItems[i])
  }

  return this.setState({rows: finalItems})

  }



}

export default App;
