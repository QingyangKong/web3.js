const fs = require('fs');
const solc = require('solc');
const Web3 = require('../lib/web3');
const coder = require('../lib/solidity/coder')
const utils = require('../lib/utils/utils');
const config = require('./config')
const contractUtils = require('./contract_utils')

var log4js = require('log4js');
var logger = log4js.getLogger();

logger.level = 'debug'

const web3 = new Web3(new Web3.providers.HttpProvider(config.IP_ADDRESS));

const input = fs.readFileSync('SimpleStorage.sol');
const output = solc.compile(input.toString(), 1);
const contractData = output.contracts[':SimpleStorage'];   // 规则：冒号+contract名称，并非文件名
var bytecode = contractData.bytecode;   
var abi = JSON.parse(contractData.interface);
const contract = web3.eth.contract(abi);

const from = '0dbd369a741319fa5107733e2c9db9929093e3c7';
const to = '0x546226ed566d0abb215c9db075fc36476888b310';
const abiTo = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
var commonParams = {};

/*************************************初始化完成***************************************/ 

contractUtils.initBlockNumber(web3, function(params){
    commonParams = params
    deployContract();
})

// 部署合约
async function deployContract() {
    contract.new({...commonParams, data: bytecode}, (err, contract) => {
        if(err) {
            logger.error("deploy contract fail with " + err);
            return;
        } else if(contract.address){
            myContract = contract;
            console.info('address: ' + myContract.address);
            console.info('abi.toString(): ' + JSON.stringify(abi));
            storeAbiToBlockchain(myContract.address, JSON.stringify(abi));
            
            callMethodContract();
        }
    })
}


/**
 * 上传abi至区块链
 * @param {string} abi 
 */
function storeAbiToBlockchain(address, abi) {

    var hex = utils.fromUtf8(abi);
    if (hex.slice(0, 2) == '0x') hex = hex.slice(2);

    var code = (address.slice(0, 2) == '0x'? address.slice(2):address) + hex;
    web3.eth.sendTransaction({
        ...commonParams,
        to: abiTo,
        data: code
    }, function(err, res) {
        if(err) {
            logger.error("send transaction error: " + err)
        } else {
            logger.info("send transaction result: " + JSON.stringify(res))
            contractUtils.getTransactionReceipt(web3, res.hash, function(receipt) {
                getAbi(address)
            })
        }
    })
}

function getAbi(address) {
    var result = web3.eth.getAbi(address, "latest");
    var abi = utils.toUtf8(result);
    logger.info("get abi: " + JSON.stringify(abi));
}

/**
 * 智能合约单元测试
 */
function callMethodContract() {
    var result =  myContract.set(5, {
        ...commonParams,
        from: from
    });
    logger.info("set method result: " + JSON.stringify(result));

    contractUtils.getTransactionReceipt(web3, result.hash, function(receipt) {
        const value = myContract.get.call();
        console.log("get method result: " + JSON.stringify(value));
    })
}
