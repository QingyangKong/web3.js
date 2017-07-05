/**
 * Created by suyanlong on 17-7-5.
 */

// cita_getLogs
// net_peerCount
// cita_blockHeight
// cita_sendTransaction
// cita_getBlockByHash
// cita_getBlockByHeight
// cita_getTransaction
// cita_getTransactionReceipt
// cita_call
// cita_getTransactionCount
// cita_getCode

var Web3 = require('./index.js');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:1337'));
var util = require("./lib/utils/utils.js");

console.log("--------begin-------");

//1. get cita block height
web3.cita.getBlockNumber(function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data
        console.log("data = " + result);
    }
});


//2. get cita peer node count
web3.net.getPeerCount(function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data
        console.log("data = " + result);
    }

});


//3. cita_getBlockByHeight
web3.cita.getBlock(9, function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data and pretty print output
        console.log(JSON.stringify(result, null, 2));
    }
});


//4 cita_getBlockByHash
//error = Error: InvalidParams what is that???? shit!!!
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

// //address 40*4 = 160
// console.log(util.toChecksumAddress("1111111111"));
// console.log(util.toAddress("10"));

//5 cita_getTransaction
web3.cita.getTransaction(height_hash, function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data and pretty print output
        console.log(JSON.stringify(result, null, 2));
    }
});

//6 getTransactionReceipt
web3.cita.getTransactionReceipt(height_hash, function (err, result) {
    if (err) {
        //error info
        console.log("error = " + err);
    } else {
        // cita return data and pretty print output
        console.log(JSON.stringify(result, null, 2));
    }
});



console.log("-----end-------");

