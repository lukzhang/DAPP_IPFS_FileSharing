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

  struct Book {
    //Can use the length of array to find max index length for front end navigation
    string[] bookHash;
    string[] bookTitle;
    string[] contents;
  }



  mapping (address => Book) books;
  address[] public bookAccounts;


  /* function addBook(address _address, string memory _bookHash)public{
    //var book = books[_address];

    books[_address].bookHash.push(_bookHash) -1; //Do I need the -1???
    //Add the title, and cover later...



    bookAccounts.push(_address) -1;
  } */





  //Function that imitates above, but adds the title and contents
  function addBookReport(address _address, string memory _bookHash, string memory
    _bookTitle, string memory _contents) public {

      books[_address].bookHash.push(_bookHash) -1;    //This is the image
      //Can we limit size of string???
      books[_address].bookTitle.push(_bookTitle) -1;  //Should title also be stored via IPFS?
      books[_address].contents.push(_contents) -1;  //Should contents be stored via IPFS?

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



    function getTitle(address _address, uint i) view public returns(string memory){
      return books[_address].bookTitle[i];
    }

    function getContents(address _address, uint i) view public returns(string memory){
      return books[_address].contents[i];
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
