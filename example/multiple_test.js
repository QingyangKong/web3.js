
const fs = require('fs');
const solc = require('solc');
const Web3 = require('../lib/web3');

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:1337"));

const input = fs.readFileSync('Multiple.sol');
const output = solc.compile(input.toString(), 1);
const contractData = output.contracts[':Multiple'];   // 规则：冒号+contract名称，并非文件名
const bytecode = contractData.bytecode;   
const abi = JSON.parse(contractData.interface);

var validUntilBlock = 0;
const privkey = '352416e1c910e413768c51390dfd791b414212b7b4fe6b1a18f58007fa894214';
const quota = 999999;
const from = '0x0dbd369a741319fa5107733e2c9db9929093e3c7';
const to = '0x546226ed566d0abb215c9db075fc36476888b310';

var address;
var contract;
var inc;

startDeploy();

var update = function (err, x) {
    console.log("Incremented update: " + JSON.stringify(x, null, 2));
};

async function startDeploy() {
    web3.eth.getBlockNumber(function(err, res){
        if (!err) {
            validUntilBlock = res + 88;
            createContract();
        }
    });
}

function createContract() {

    web3.eth.contract(abi).new({
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        data: bytecode,
        validUntilBlock: validUntilBlock
    }, function (err, c) {
        if (err) {
            console.error(err);
            return;

        // callback fires twice, we only want the second call when the contract is deployed
        } else if(c.address){

            contract = c;
            console.log('address: ' + contract.address);

            inc = contract.Incremented({odd: true}, {
                    privkey: privkey,
                    nonce: getRandomInt(),
                    quota: quota,
                    data: bytecode,
                    validUntilBlock: validUntilBlock
                }, update);

            console.log("Incremented inc: " + JSON.stringify(inc));

            callContract();
        }
    });
};

var counter = 0;
var callContract = function () {
    counter++;
    var all = 70 + counter;
    var log = 'Transaction sent ' + counter + ' times. ' + 
        'Expected x value is: ' + (all - (all % 2 ? 0 : 1)) + ' ' +
        'Waiting for the blocks to be mined...';
    console.log("call method log: " + log);        
    contract.inc({
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        data: bytecode,
        validUntilBlock: validUntilBlock
    });
};


function getRandomInt() {
    return Math.floor(Math.random() * 100).toString(); 
}