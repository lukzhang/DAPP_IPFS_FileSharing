pragma solidity >=0.4.21 <0.6.0;
//This is the solidity file to edit and use. You must migrate then copy the
//relavent json file in build/contracts to the client folder. Copy into client/src/contracts directory

import './MyToken.sol';

/*
Storage that contains articles where IPFS stores contents and cover photo
IPFS hash values are stored in the array within the structs. Titles are directly
stored as a string within the array in the struct

Note: struct 'Book' actually refers to article, as do its couterparts such as
bookHash, bookTitle, etc.
*/

contract SimpleStorage {

  //Contains an article including a cover image, title, and contents. Each is stored
  //in an array as each user can have more than one article
  struct Book {
    //Can use the length of array to find max index length for front end navigation
    string[] bookHash;    //Cover photo
    string[] bookTitle;   //Title of article
    string[] contents;    //Contents of article
  }

  //The ERC721 token
  MyToken public myToken;  //Instance of token
  uint256 public tokenId;  //Id of token that is to be minted

  //Maps the user's address to their articles
  mapping (address => Book) books;

  //Contains each users' account who has submitted an article
  address[] public bookAccounts;

  //Initializes the contract by instatiating the token and setting the index
  //to 0 for the token ID for minting
  constructor (MyToken _myToken) public {
    myToken = _myToken;
    tokenId=0;
  }

  //User buys one token for themselves
  function buyOneToken() public payable {
    require(myToken.mint(msg.sender, tokenId));
    tokenId++;
  }

  //Returns the amount of tokens user has
  function accountBalance() view public returns(uint256){
    return myToken.balanceOf(msg.sender);
  }

  //Checks balance of account that isn't msg.sender
  function accountBalanceManual(address _address) view public returns(uint256){
    return myToken.balanceOf(_address);
  }

  //Mints a token to another address
  function giveLike(address _to) public payable{
    require(myToken.mint(_to, tokenId));
    tokenId++;
  }

  //Function that adds article
  function addBookReport(address _address, string memory _bookHash, string memory
    _bookTitle, string memory _contents) public {

      //Adds the cover photo, title, and contents
      books[_address].bookHash.push(_bookHash) -1;
      books[_address].bookTitle.push(_bookTitle) -1;
      books[_address].contents.push(_contents) -1;

      //Iterate through array to check if address exists. If not, push to array.
      bool bookAdded = false;
      for(uint i=0; i<bookAccounts.length; i++){
        if(bookAccounts[i] == _address){
          bookAdded = true;
          break;
        }
      }

      if(!bookAdded){
        bookAccounts.push(_address) -1;
      }
    }

    //Return array of bookAccounts. In future, should partition array in cycles
    //Reads from blockchain are free. Perhaps should just reed the public array..
    function getBookAccounts() public view returns(address[] memory){
      return bookAccounts;
    }

    //Title of article
    function getTitle(address _address, uint i) view public returns(string memory){
      return books[_address].bookTitle[i];
    }

    //Article contents
    function getContents(address _address, uint i) view public returns(string memory){
      return books[_address].contents[i];
    }

    //Article based on user address and index
    function getBook(address _address, uint i) view public returns(string memory){
      return books[_address].bookHash[i];
    }

    //Get length of bookHash array. Used for frontend navigation between all the files
    function getLength(address _address) view public returns(uint256){
      return books[_address].bookHash.length;
    }

}
