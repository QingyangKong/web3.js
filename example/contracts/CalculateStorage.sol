pragma solidity ^0.4.14;

import "./SafeMath.sol";

contract CalculateStorage {

    using SafeMath for *;

    bool allowAdd = true;

    uint mulResult;
    uint addResult;

    function setMul(uint x, uint y) public {
        require(x < 100 && y < 100);
        var result = SafeMath.mul(x, y);
        mulResult = result;
    }

    function getMul() public constant returns (uint) {
        return mulResult;
    }

    modifier allowedAdd() {
        if (!allowAdd)
            throw;
        _;
    }

    function setAdd(uint x, uint y) public allowedAdd() {
        var result = SafeMath.add(x, y);
        addResult = result;
    }

    function getAdd() public constant returns (uint) {
        return addResult;
    }
}
