const Web3 = require('../lib/web3');
const config = require('./config')

var log4js = require('log4js');
var logger = log4js.getLogger();

logger.level = 'debug'

const web3 = new Web3(new Web3.providers.HttpProvider(config.IP_ADDRESS));


/*************************************初始化完成***************************************/ 
citaTest();

async function citaTest() {

    logger.info("web3.isConnected: " + web3.isConnected());

    // * net_peerCount
    // * cita_blockNumber
    // * cita_sendTransaction
    // * cita_getBlockByHash
    // * cita_getBlockByNumber
    // * cita_getTransaction
    // * eth_getTransactionCount
    // * eth_getCode
    // * eth_getTransactionReceipt
    // * eth_call

    logger.info("--------begin test base case of cita -------");

    //1. get cita block height
    web3.eth.getBlockNumber(function (err, result) {
        if (err) {
            logger.error("get current block height error: " + err);
        } else {
            logger.info("current block height:" + result);
        }
    });

    //2. get cita peer node count
    web3.net.getPeerCount(function (err, result) {
        if (err) {
            throw new error("get cita peer node count error: " + err);
        } else {
            logger.info("cita peer node count:" + result);
        }
    });


    //3. cita_getBlockByHeight
    web3.eth.getBlockByNumber(0x10, false, function (err, result) {
        if (err) {
            throw new error("get block by height error: " + err);
        } else {
            logger.info("get hash by height: " + result.hash);

            //4 cita_getBlockByHash
            web3.eth.getBlockByHash(result.hash, function (err, result) {
                if(err) {
                    throw new error("get block by hash error: " + err);
                } else {
                    logger.info("get block by hash : " + JSON.stringify(result));
                }
            });

        }
    });

    web3.eth.getMetaData(0x10, function(err, result) {
        if (err) {
            throw new error("get meta data by height error: " + err);
        } else {
            logger.info("get meta data by height: " + JSON.stringify(result));
        }
    })
    
}