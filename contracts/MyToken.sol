pragma solidity >=0.4.21 <0.6.0;

import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol';
import 'openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol';

/*
Creates a Like token to be given to accounts
*/

contract MyToken is ERC721Full, ERC721Mintable{

  string name;
  string symbol;

  constructor (string memory _name, string memory _symbol) public ERC721Full(_name, _symbol) {
      // solhint-disable-previous-line no-empty-blocks
      name=_name;
      symbol=_symbol;


      /*

      After deploying contract, make sure to addMinter() by passing in SimpleStorage address
      MyToken is intially the only minter. Only minters can add minters

      */

  }
}
