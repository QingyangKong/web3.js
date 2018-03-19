const Web3 = require('../lib/web3');
const config = require('./config')
var log4js = require('log4js');
var logger = log4js.getLogger();

logger.level = 'info'

const web3 = new Web3(new Web3.providers.HttpProvider(config.IP_ADDRESS));

const COUNT_NUMBER = 50;

getBlockTimeByCurrentNumber(function(height1, time1){

    var count = 0;
    var latestHeight = height1;
    var latestTime = time1;
    var firstTime = time1;
    var firstHeight = height1;
    var filter = web3.eth.filter('latest', function(err){
        if (!err) {
            count++;
            if (count > COUNT_NUMBER) {
                filter.stopWatching(function() {});
                logger.info("diff block height: " + (latestHeight-firstHeight))
                logger.info("diff block time: " + (latestTime-firstTime)/1000)
                logger.info("average block time: " + (latestTime-firstTime)/1000/(latestHeight-firstHeight))
            } else {
                getBlockTimeByCurrentNumber(function(height2, time2){
                    var diff = (time2 - time1) / 1000;
                    logger.info("current count is " + count + " and diff block timestamp is: " + diff)
                    height1 = height2;
                    time1 = time2;
                    latestHeight = height2;
                    latestTime = time2;
                })
            }
        }
    });

})

async function getBlockTimeByCurrentNumber(callback){
    web3.eth.getBlockNumber(function (err, height) {
        if (err) {
            logger.error("get current block height error: " + err);
        } else {
            logger.info("current block height:" + height);
            web3.eth.getBlockByNumber(height, false, function (err, result) {
                if (err) {
                    throw new error("get block by height error: " + err);
                } else {
                    callback(height, result.header.timestamp);
                }
            });
        }
    });
}