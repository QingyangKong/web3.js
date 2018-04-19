pragma solidity ^0.4.19;

import "./SimpleStorage.sol";

contract SimpleStorageMgnt {
    address simpleStorageAdr;
    SimpleStorage simple = SimpleStorage(0x8865fd90e85da78c3cb8ee6b7087388f31d20f79);

    function getAddr() view public returns(address) {
        return simpleStorageAdr;
    }

    function set(uint x) public {
        simple.set(x);
    }

    function get() view public returns (uint) {
        return simple.get();
    }
}