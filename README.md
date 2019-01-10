NOTE: Update was made so that contracts may migrate with Truffle 5 (rather than Truffle 4 as was previously done)

# DAPP_IPFS_FileSharing
Work in progress. DAPP uses IPFS for each account to store each file as an array. Images are used here for display.


### Prerequisites

npm

Truffle

MetaMask

Ganache

IPFS


### Installing

After cloning repository, go into the client directory from the IPFS_DAPP directory

```
git clone https://github.com/lukzhang/DAPP_IPFS_FileSharing.git
cd DAPP_IPFS_FileSharing
cd client
```

If it is not open already, open up Ganache and browser with MetaMask. 
Migrate the contracts with --reset to be safe. Note, if you want to modify the contracts, you must navigate to the root directory and change the .sol files in the contracts directory. Migrate from IPFS_DAPP directory and copy the corresponding .json files from build/contracts to client/source/contracts

```
truffle migrate --reset
```

Because I refer to the first account from web3 as account[0], you must state via **truffle5** to set the default account to this. However, for me, I no longer need to do this. I had to essentially do this with truffle 4. I put this procedure just in case.

```
truffle console
let accounts = await web3.eth.getAccounts()
first = accounts[0]
web3.eth.defaultAccount = first
```

Finally run the server in the ./client directory. Metamask sometimes has issues when starting it, so try restarting MetaMask and resetting the account in MetaMask by going to custom RPC.

```
npm run start
```

### Functions

You should be able to upload images for each account. You can view various images once you uploaded them by toggling the buttons


## Acknowledgments

* Much of the starter code was inspired by https://github.com/dappuniversity/ipfs_image_uploader
