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

const input = fs.readFileSync('Token.sol');
const output = solc.compile(input.toString(), 1);
const contractData = output.contracts[':Token'];   // 规则：冒号+contract名称，并非文件名
const bytecode = contractData.bytecode;  
const abi = JSON.parse(contractData.interface);
const Contract = web3.eth.contract(abi);

const from = '0x0dbd369a741319fa5107733e2c9db9929093e3c7';
const to = '0x546226ed566d0abb215c9db075fc36476888b310';
const abiTo = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
var commonParams = {};

/*************************************初始化完成***************************************/ 

contractUtils.initBlockNumber(web3, function(params){
    commonParams = params
    deployContract();
})

// 部署合约
function deployContract() {
    logger.info("deploy contract ...")
    Contract.new(100000, {...commonParams, data: bytecode }, (err, contract) => {
        if(err) {
            logger.error(err);
            return;
        } else if(contract.address){
            myContract = contract;
            logger.info('contract address: ' + myContract.address);

            storeAbiToBlockchain(myContract.address, JSON.stringify(abi));

            listenEvent(myContract);

            callMethodContract();
        }
    });
}

function listenEvent(contract) {
    // 获取事件对象
    var myEvent = contract.Transfer();
    // 监听事件，监听到事件后会执行回调函数，并且停止继续监听
    myEvent.watch(function(err, result) {
        if (!err) {
            logger.info("Transfer event result: " + JSON.stringify(result));
        } else {
            logger.error("Transfer event error: " + JSON.stringify(err));
        }
        myEvent.stopWatching();
    });
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
        from: from,
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
    var abi = utils.toUtf8(result)
    logger.info("get abi is: " + abi)
}


/**
 * 智能合约单元测试
 */
async function callMethodContract(address) {

    logger.info("before transfer the balance of from address is : " + myContract.getBalance.call(from)); 
    logger.info("before transfer the balance of to address is : " + myContract.getBalance.call(to)); 

    var result = myContract.transfer(to, '1000', {...commonParams, from: from });

    logger.info("transfer success and the receipt: " + JSON.stringify(result))

    contractUtils.getTransactionReceipt(web3, result.hash, function(receipt) {
        if(receipt) {
            logger.info("after transfer the balance of from address is : " + myContract.getBalance.call(from)); 
            logger.info("after transfer the balance of to address is : " + myContract.getBalance.call(to)); 
        }
    })

}
