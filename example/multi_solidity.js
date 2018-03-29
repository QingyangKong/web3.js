const fs = require('fs');
const solc = require('solc');
const Web3 = require('../lib/web3');
const config = require('./config')
const contractUtils = require('./contract_utils')

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
const contractData = output.contracts['CalculateStorage.sol:CalculateStorage']; 
var bytecode = contractData.bytecode;
const abi = JSON.parse(contractData.interface);
const contract = web3.eth.contract(abi);

const from = '0dbd369a741319fa5107733e2c9db9929093e3c7';
var commonParams = {}

/*************************************初始化完成***************************************/ 
contractUtils.initBlockNumber(web3, function(params){
    commonParams = params
    deployContract();
})

// 部署合约
async function deployContract() {
    contract.new({ ...commonParams, data: bytecode}, (err, contract) => {
        if(err) {
            throw new error("contract deploy error: " + err);
            return;
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
    var result =  myContract.setMul(4, 50, { ...commonParams });
    logger.info("set multi method result: " + JSON.stringify(result));

    contractUtils.getTransactionReceipt(web3, result.hash, function(receipt) {
        const result = myContract.getMul.call();
        logger.info("get multi method result: " + JSON.stringify(result));
    })

}


/**
 * 测试合约加法方法
 */
function callAddMethodContract(value) {
    var result =  myContract.setAdd(29, 50, { ...commonParams });
    logger.info("set method add result: " + JSON.stringify(result));

    contractUtils.getTransactionReceipt(web3, result.hash, function(receipt) {
        const value = myContract.getAdd.call();
        logger.info("get method add result: " + JSON.stringify(value));
    })

}
