pragma solidity >=0.4.21 <0.6.0;
//This is the solidity file to edit and use. You must migrate then copy the
//relavent json file in build/contracts to the client folder. Copy into client/src/contracts directory

contract SimpleStorage {
  string ipfsHash;
  string answerss = "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg";

  struct Image {
    string imageHash;   //Can we check if this is an img file?
    string title;
    string coverHash;   //Change this to contentsHash?
  }

  mapping (address => Image) images;
  address[] public imageAccounts;

  //Can we have one address with multiple images/files?

  //************PRACTICISMO*****************

  struct Book {
    //Can use the length of array to find max index length for front end navigation
    string[] bookHash;
    string[] bookTitle;
    string[] bookCoverHash;
  }



  mapping (address => Book) books;
  address[] public bookAccounts;



  function addBook(address _address, string memory _bookHash)public{
    //var book = books[_address];

    books[_address].bookHash.push(_bookHash) -1; //Do I need the -1???
    //Add the title, and cover later...

    bookAccounts.push(_address) -1;
  }

  function getBook(address _address, uint i) view public returns(string memory){
    return books[_address].bookHash[i];
  }

  //Get length of bookHash array. Used for frontend navigation between all the files
  function getLength(address _address) view public returns(uint256){
    return books[_address].bookHash.length;
  }


  //****************************************


  function setImage(address _address, string memory _imageHash) public {
    //var image = images[_address];

    images[_address].imageHash = _imageHash;

    imageAccounts.push(_address) -1;
  }

  function getImages() view public returns(address[] memory) {
    return imageAccounts;
  }

  function getImage(address _address) view public returns(string memory){
    return images[_address].imageHash;
  }

  function set(string memory x) public {
    ipfsHash = x;
    //ipfsHash = "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg";
  }

  function get() public view returns (string memory) {

    return ipfsHash;
  }

  function getTest() public view returns (string memory) {

    return answerss;
  }
}
