const fs = require('fs');
const solc = require('solc');
const Web3 = require('../lib/web3');
const config = require('./config')
var log4js = require('log4js');
var logger = log4js.getLogger();

logger.level = 'debug'

const web3 = new Web3(new Web3.providers.HttpProvider(config.IP_ADDRESS));

var input = {};
const path = 'contracts/'
var files = fs.readdirSync(path);
files.forEach(function (filename) {
    input[filename] = fs.readFileSync(path + filename, 'utf8');
});

var output = solc.compile({sources: input}, 1);
// logger.info("compile output: " + JSON.stringify(output));
const contractData = output.contracts['CalculateStorage.sol:CalculateStorage']; 
var bytecode = contractData.bytecode;
// logger.info("compile bytecode: " + JSON.stringify(bytecode));

const abi = JSON.parse(contractData.interface);
const contract = web3.eth.contract(abi);


var validUntilBlock = 0;
const privkey = '352416e1c910e413768c51390dfd791b414212b7b4fe6b1a18f58007fa894214';
const quota = 999999;
const from = '0dbd369a741319fa5107733e2c9db9929093e3c7';

/*************************************初始化完成***************************************/ 
startDeploy();

// get current block number
async function startDeploy() {
    web3.eth.getBlockNumber(function(err, res){
        if (!err) {
            validUntilBlock = res + 88;
            deployContract();
        }
    });
}

// 部署合约
async function deployContract() {
    contract.new({
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        data: bytecode,
        validUntilBlock: validUntilBlock,
        from: from
    }, (err, contract) => {
        if(err) {
            throw new error("contract deploy error: " + err);
            return;
            // callback fires twice, we only want the second call when the contract is deployed
        } else if(contract.address){
            myContract = contract;
            logger.info('address: ' + myContract.address);
            callMulMethodContract();
            callAddMethodContract();
        }
    })
}


/**
 * 智能合约单元测试
 */
function callMulMethodContract(value) {
    var result =  myContract.setMul(4, 50, {
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        validUntilBlock: validUntilBlock,
        from: from
    });
    logger.info("set multi method result: " + JSON.stringify(result));

    // wait for receipt
    var count = 0;
    var filter = web3.eth.filter('latest', function(err){
        if (!err) {
            count++;
            if (count > 20) {
                filter.stopWatching(function() {});
            } else {
                web3.eth.getTransactionReceipt(result.hash, function(e, receipt){
                    if(receipt) {
                        filter.stopWatching(function() {});
                        const result = myContract.getMul.call();
                        logger.info("get multi method result: " + JSON.stringify(result));
                    }
                });
            }
        }
    });
}


/**
 * 测试合约加法方法
 */
function callAddMethodContract(value) {
    var result =  myContract.setAdd(29, 50, {
        privkey: privkey,
        nonce: getRandomInt(),
        quota: quota,
        validUntilBlock: validUntilBlock,
        from: from
    });
    logger.info("set method add result: " + JSON.stringify(result));

    // wait for receipt
    var count = 0;
    var filter = web3.eth.filter('latest', function(err){
        if (!err) {
            count++;
            if (count > 20) {
                filter.stopWatching(function() {});
            } else {
                web3.eth.getTransactionReceipt(result.hash, function(e, receipt){
                    if(receipt) {
                        filter.stopWatching(function() {});
                        const result = myContract.getAdd.call();
                        logger.info("get method add result: " + JSON.stringify(result));
                    }
                });
            }
        }
    });
}


function getRandomInt() {
    return Math.floor(Math.random() * 100).toString(); 
}
