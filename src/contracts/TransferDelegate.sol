// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TransferDelegate {
  // Token metadata
  string public constant name = "Delegate to pointless currency";
  string public constant symbol = "PNTLS";
  uint8 public constant decimals = 2;
  mapping(address => uint256) balances;
  mapping(address => mapping(address => uint256)) allowed;
  uint256 totalSupply_;
  address transferDelegate_;

  // Functions
  constructor(uint256 total, address transferDelegate) {
    totalSupply_ = total;
    balances[msg.sender] = totalSupply_;
    transferDelegate_ = transferDelegate;
  }

  function balanceOf(address tokenOwner) public view returns (uint) {
    return balances[tokenOwner];
  }

  function transfer(address receiver, uint numTokens) public returns (bool) {
    require(numTokens <= balances[msg.sender], "Insufficient balance for this transfer operation");
    (bool success, ) = transferDelegate_.delegatecall(
      abi.encodeWithSignature("transfer(address,uint256)", receiver, numTokens)
    );
    return success;
  }

  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }
}
