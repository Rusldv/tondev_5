pragma ton-solidity >= 0.35.0;
pragma AbiHeader expire;

contract Test {
    function getNum() public pure returns (uint) {
        tvm.accept();
        return 112;
    }
}