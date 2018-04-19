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

const input = fs.readFileSync('ERC20Token.sol');
const output = solc.compile(input.toString(), 1);
const contractData = output.contracts[':ERC20Token'];   // 规则：冒号+contract名称，并非文件名
const bytecode = contractData.bytecode;  
const abi = JSON.parse(contractData.interface);
const Contract = web3.eth.contract(abi);

const from = '0x0dbd369a741319fa5107733e2c9db9929093e3c7';
const to = '0x546226ed566d0abb215c9db075fc36476888b310';
const abiTo = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const logo = "http://7xq40y.com1.z0.glb.clouddn.com/download.png";
var commonParams = {};

/*************************************初始化完成***************************************/ 

contractUtils.initBlockNumber(web3, function(params){
    commonParams = params
    deployContract();
})

// 部署合约
function deployContract() {
    logger.info("deploy contract ...")
    Contract.new(10000, "cita token", 8, "CIT", logo, {...commonParams, data: bytecode }, (err, contract) => {
        if(err) {
            logger.error(err);
            return;
        } else if(contract.address){
            myContract = contract;
            logger.info('contract address: ' + myContract.address);

            storeAbiToBlockchain(myContract.address, contractData.interface.toString())

            callMethodContract();
        }
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
    logger.info("abi Object is: " + abi)
}


/**
 * 智能合约单元测试
 */
async function callMethodContract(address) {

    logger.info("the balance of from address is : " + myContract.balanceOf.call(from)); 

}
