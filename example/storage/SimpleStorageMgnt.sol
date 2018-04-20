pragma solidity ^0.4.19;

import "./SimpleStorage.sol";

contract SimpleStorageMgnt {
    address simpleStorageAdr;
    SimpleStorage simple = SimpleStorage(0x99080039b22ec28fc2819811a788012131ae382a);

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