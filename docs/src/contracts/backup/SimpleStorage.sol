pragma solidity 0.4.24;

contract SimpleStorage {

  struct Image {
    string imageHash;
    string title;
    string coverHash;
  }

  mapping (address => Image) images;
  address[] public imageAccounts;

  function setImage(address _address, string _imageHash) public {
    var image = images[_address];

    Image.imageHash = _imageHash;

    imageAccounts.push(_address) -1;
  }

  function getImages() view public returns(address[]){
    return imageAccounts;
  }

  function getImage(address _address) view public returns(string){
    return (images[_address].imageHash);
  }


  string ipfsHash;

  function set(string x) public {
    ipfsHash = x;
  }

  //Do I have to create a mapping?
  //Can I set a SimpleStorage for each account?
  //How would every account keep track of every other account?
  //Should I use some sort of array, or linkedlist, binary tree??

  function get() public view returns (string) {
    //ipfsHash = "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ/cat.jpg";
    return ipfsHash;
  }

  function testGet() public view returns (string){
    string theAnswer = "test is here!";
    returns theAnswer;
  }
}
