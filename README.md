# DAPP_IPFS_FileSharing
Work in progress. DAPP uses IPFS for each account to store each file as an array. Images are used here for display.


### Prerequisites

npm

Truffle

MetaMask

Ganache


### Installing

After cloning repository, go into the client directory from the IPFS_DAPP directory

```
git clone https://github.com/lukzhang/DAPP_IPFS_FileSharing.git
cd IPFS_DAPP
cd client
```

If it is not open already, open up Ganache and browser with MetaMask that connects to the local blockchain network from ganache. 
Migrate the contracts with --reset to be safe. Note, if you want to modify the contracts, you must navigate to the IPFS_DAPP
directory and change the .sol files in the contracts directory. Migrate from IPFS_DAPP directory and copy the corresponding .json files
from build/contracts to client/source/contracts

```
truffle migrate --reset
```

Because I refer to the first account from web3 as account[0], you must state via truffle to set the default account to this

```
truffle console
web3.eth.defaultAccount = web3.eth.accounts[0]
```

Finally run the server in the IPFS_DAPP/client directory. Metamask sometimes has issues when starting it, so try restarting Ganache and MetaMask and resetting the
account in MetaMask.

```
npm run start
```

### Functions

You should be able to upload images for each account. You can view various images once you uploaded them by changing the index.


## Acknowledgments

* Much of the starter code was inspired by https://github.com/dappuniversity/ipfs_image_uploader
