pragma solidity ^0.4.19;

contract SimpleStorage {
    uint storedData;

    function set(uint x) {
        storedData = x;
    }

    function get() view returns (uint) {
        return storedData;
    }
}
