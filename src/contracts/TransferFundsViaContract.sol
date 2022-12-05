// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TransferFundsViaContract {
  address payable public owner;

  constructor() payable {
    owner = payable(msg.sender);
  }

  // get the amount of native currency stored in this contract and withdraw it
  function deposit() public payable {}

  // get the amount of native currency stored in this contract and withdraw it
  function withdraw() public {
    uint amount = address(this).balance;
    (bool success, ) = owner.call{gas: 25000, value: amount}("");
    require(success, "Failed to withdraw");
  }
}
