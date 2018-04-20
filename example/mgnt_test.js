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

var input = {};
const path = 'storage/'
var files = fs.readdirSync(path);
files.forEach(function (filename) {
    input[filename] = fs.readFileSync(path + filename, 'utf8');
});

var output = solc.compile({sources: input}, 1);
const contractData = output.contracts['SimpleStorageMgnt.sol:SimpleStorageMgnt'];   // 规则：冒号+contract名称，并非文件名
var bytecode = contractData.bytecode;   
var abi = JSON.parse(contractData.interface);
logger.info("abi: " + JSON.stringify(abi))
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
            
            callMethodContract();
        }
    })
}


/**
 * 智能合约单元测试
 */
function callMethodContract() {
    var result =  myContract.set(200, {
        ...commonParams,
        from: from
    });
    logger.info("set method result: " + JSON.stringify(result));

    contractUtils.getTransactionReceipt(web3, result.hash, function(receipt) {
        const value = myContract.get.call();
        console.log("get method result: " + JSON.stringify(value));
    })
}
