pragma solidity ^0.4.6;
contract Multiple {  
    uint x; 
    event Incremented(bool indexed odd, uint x);
    function Contract() {
        x = 70;
    } 
    function inc() {
        ++x; 
        Incremented(x % 2 == 1, x); 
    }
    
}