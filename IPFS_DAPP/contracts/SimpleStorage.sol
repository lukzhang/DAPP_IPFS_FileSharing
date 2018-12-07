pragma solidity 0.4.24;
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
    string[] bookHash;
    string[] bookTitle;
    string[] bookCoverHash;
  }

  mapping (address => Book) books;
  address[] public bookAccounts;

  function addBook(address _address, string _bookHash){
    var book = books[_address];

    book.bookHash.push(_bookHash) -1; //Do I need the -1???
    //Add the title, and cover later...

    bookAccounts.push(_address) -1;
  }

  function getBook(address _address, uint i) view public returns(string){
    return books[_address].bookHash[i];
  }


  //****************************************


  function setImage(address _address, string _imageHash){
    var image = images[_address];

    image.imageHash = _imageHash;

    imageAccounts.push(_address) -1;
  }

  function getImages() view public returns(address[]) {
    return imageAccounts;
  }

  function getImage(address _address) view public returns(string){
    return images[_address].imageHash;
  }

  function set(string x) public {
    ipfsHash = x;
    //ipfsHash = "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg";
  }

  function get() public view returns (string) {

    return ipfsHash;
  }

  function getTest() public view returns (string) {

    return answerss;
  }
}
