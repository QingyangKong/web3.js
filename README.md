# cita JavaScript RPC API 

Now, crypatpe cita implement RPC:
```
cita_getLogs
net_peerCount
cita_blockHeight
cita_sendTransaction
cita_getBlockByHash
cita_getBlockByHeight
cita_getTransaction
cita_getTransactionReceipt
cita_call
cita_getTransactionCount
cita_getCode
```

eg:
```
var Web3 = require('web3');
var web3 = new Web3();

```

You need to run a local cryptape cita node to use this library.


## Installation
npm install github:cryptape/web3.js#develop

### Node.js



* Include `web3.min.js` in your html file. (not required for the meteor package)

## Usage
Use the `web3` object directly from global namespace:

```js
console.log(web3); // it's here!
```

Set a provider (HttpProvider)

```js
web3.setProvider(new web3.providers.HttpProvider('http://localhost:1337'));
```

There you go, now you can use it:
#### 1. get cita block height

```js
web3.cita.getBlockNumber(function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data
        console.log("data = " + result);
    }
});

```

#### 2. get cita peer node count
```js
web3.net.getPeerCount(function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data
        console.log("data = " + result);
    }

});
```


#### 3. cita_getBlockByHeight
```js
web3.cita.getBlock(9, function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data and pretty print output
        console.log(JSON.stringify(result, null, 2));
    }
});

```

#### 4. cita_getBlockByHash
```js
var height_hash = "0x116b5f9449c01dd39afed9f26af26f79181b31194200094f61ecee6a1e422a32";//value from setp 3
web3.cita.getBlock(height_hash, function (err, result) {
    if(err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data and pretty print output
        console.log(JSON.stringify(result, null, 2));
    }
});

```

#### 5. cita_getTransaction
```js
web3.cita.getTransaction(height_hash, function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data and pretty print output
        console.log(JSON.stringify(result, null, 2));
    }
});

```

#### 6.cita_getTransactionReceipt
```js
web3.cita.getTransactionReceipt(height_hash, function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data and pretty print output
        console.log(JSON.stringify(result, null, 2));
    }
});

```

#### 7. 
```js


```



## Contribute!

### Requirements

* Node.js
* npm

```bash
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo apt-get install nodejs-legacy
```

### Building (gulp)

```bash
npm run-script build
```


